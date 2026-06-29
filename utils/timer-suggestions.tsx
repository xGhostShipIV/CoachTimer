import { SavedConfiguration } from "@/utils/configuration-storage";

// A timer must have been started more than this many times before we trust
// its usage history enough to suggest it.
const MIN_USAGES_FOR_SUGGESTION = 6;
// A past usage counts toward "used around now" if it falls within this many
// hours of the current time of day (measured on a circular 24h clock).
export const TIME_WINDOW_HOURS = 1;
// Cap how many suggestions we surface at once.
const DEFAULT_MAX_SUGGESTIONS = 3;

// Fractional hour-of-day (e.g. 13.5 for 1:30pm).
function hourOfDay(date: Date): number {
    return date.getHours() + date.getMinutes() / 60;
}

// Shortest distance between two hours-of-day, accounting for midnight
// wraparound (e.g. 23:00 and 01:00 are 2 hours apart, not 22).
function circularHourDistance(a: number, b: number): number {
    const diff = Math.abs(a - b);
    return Math.min(diff, 24 - diff);
}

// Suggests saved configurations whose usage history clusters around the
// current time of day. Only configs used regularly (more than five times)
// are considered, and they're ranked by how many of their past starts fall
// near `now`, so the most time-appropriate timers come first.
export function suggestConfigurations(
    saved: SavedConfiguration[],
    now: Date = new Date(),
    maxSuggestions: number = DEFAULT_MAX_SUGGESTIONS
): SavedConfiguration[] {
    const currentHour = hourOfDay(now);

    return saved
        .filter((entry) => entry.usageTimestamps.length >= MIN_USAGES_FOR_SUGGESTION)
        .map((entry) => {
            const nearbyUsages = entry.usageTimestamps.filter(
                (timestamp) => circularHourDistance(hourOfDay(new Date(timestamp)), currentHour) <= TIME_WINDOW_HOURS
            ).length;
            return { entry, nearbyUsages };
        })
        .filter((scored) => scored.nearbyUsages > 0)
        .sort((a, b) => b.nearbyUsages - a.nearbyUsages)
        .slice(0, maxSuggestions)
        .map((scored) => scored.entry);
}

import { TimeConfiguration } from "@/data/data-types";
import AsyncStorage from "@react-native-async-storage/async-storage";

// AsyncStorage is backed by localStorage on web and native key-value stores
// on iOS/Android, so saved timers carry over on whatever device runs the app.
const STORAGE_KEY = "@IntervalTimer:savedConfigurations";

// Only the most recent MAX_USAGE_TIMESTAMPS start times are kept per config.
const MAX_USAGE_TIMESTAMPS = 10;

interface StoredEntry {
    configuration: TimeConfiguration;
    usageTimestamps: number[];
}

export interface SavedConfiguration {
    name: string;
    configuration: TimeConfiguration;
    usageTimestamps: number[];
}

async function readAll(): Promise<Record<string, StoredEntry>> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
}

async function writeAll(configurations: Record<string, StoredEntry>): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(configurations));
}

export async function listSavedConfigurations(): Promise<SavedConfiguration[]> {
    const configurations = await readAll();
    return Object.entries(configurations)
        .map(([name, entry]) => ({ name, configuration: entry.configuration, usageTimestamps: entry.usageTimestamps }))
        .sort((a, b) => a.name.localeCompare(b.name));
}

export async function saveConfiguration(name: string, configuration: TimeConfiguration): Promise<void> {
    const configurations = await readAll();
    configurations[name] = {
        configuration,
        usageTimestamps: configurations[name]?.usageTimestamps ?? [],
    };
    await writeAll(configurations);
}

export async function deleteConfiguration(name: string): Promise<void> {
    const configurations = await readAll();
    delete configurations[name];
    await writeAll(configurations);
}

// Records that a saved configuration was used to actually start a timer
// (as opposed to merely being loaded into the setup form).
export async function recordConfigurationUsage(name: string): Promise<void> {
    const configurations = await readAll();
    const existing = configurations[name];
    if (!existing) return;

    const usageTimestamps = [...existing.usageTimestamps, Date.now()].slice(-MAX_USAGE_TIMESTAMPS);
    configurations[name] = { ...existing, usageTimestamps };
    await writeAll(configurations);
}

// Dev-only helper for manually testing the home-screen "Suggested for Now"
// feature. Usage timestamps are generated relative to the current moment
// (not hardcoded), so the seeded data is meaningful whenever this is run:
// - "Right Now (Suggested)" usually starts at this exact hour -> should show up.
// - "Different Time of Day" usually starts ~6h from now -> should NOT show up.
// - "Not Used Enough" starts at this hour too, but only 3 times -> below the
//   regular-use threshold, so it should NOT show up either.
// - "Borderline (Suggested)" sits right at the regular-use threshold -> should show up.
export async function seedSuggestionTestData(): Promise<void> {
    const HOUR_MS = 60 * 60 * 1000;
    const DAY_MS = 24 * HOUR_MS;
    const now = Date.now();

    // `count` usages, one per day going backwards, each `hourOffset` hours
    // away from the current time of day.
    const usagesNearHour = (hourOffset: number, count: number): number[] =>
        Array.from({ length: count }, (_, i) => now - i * DAY_MS + hourOffset * HOUR_MS);

    const sampleIntervals = (onSeconds: number, offSeconds: number, repeats: number): TimeConfiguration["intervals"] => [
        { on: onSeconds * 1000, off: offSeconds * 1000, repeats },
    ];

    const seedConfigurations: Record<string, StoredEntry> = {
        "Right Now (Suggested)": {
            configuration: { numRounds: 3, roundRest: 30000, intervals: sampleIntervals(45, 15, 4) },
            usageTimestamps: usagesNearHour(0, 8),
        },
        "Different Time of Day": {
            configuration: { numRounds: 4, roundRest: 20000, intervals: sampleIntervals(30, 30, 6) },
            usageTimestamps: usagesNearHour(6, 8),
        },
        "Not Used Enough": {
            configuration: { numRounds: 2, roundRest: 45000, intervals: sampleIntervals(60, 20, 3) },
            usageTimestamps: usagesNearHour(0, 3),
        },
        "Borderline (Suggested)": {
            configuration: { numRounds: 5, roundRest: 15000, intervals: sampleIntervals(20, 10, 8) },
            usageTimestamps: usagesNearHour(0, 6),
        },
    };

    const configurations = await readAll();
    await writeAll({ ...configurations, ...seedConfigurations });
}

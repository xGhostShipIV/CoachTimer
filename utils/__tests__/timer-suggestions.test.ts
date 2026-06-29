import type { SavedConfiguration } from "@/utils/configuration-storage";
import { suggestConfigurations, TIME_WINDOW_HOURS } from "@/utils/timer-suggestions";

const HOUR_MS = 60 * 60 * 1000;

const baseConfiguration: SavedConfiguration["configuration"] = {
    numRounds: 3,
    roundRest: 30000,
    intervals: [{ on: 45000, off: 15000, repeats: 4 }],
};

// `hourOffsets` are hours away from `now` (can be negative); each becomes one
// past usage timestamp for the returned entry.
function makeEntry(name: string, now: Date, hourOffsets: number[]): SavedConfiguration {
    return {
        name,
        configuration: baseConfiguration,
        usageTimestamps: hourOffsets.map((offset) => now.getTime() + offset * HOUR_MS),
    };
}

describe("suggestConfigurations", () => {
    const now = new Date(2026, 0, 15, 13, 0, 0); // 1:00pm

    it("returns nothing when there are no saved configurations", () => {
        expect(suggestConfigurations([], now)).toEqual([]);
    });

    it("excludes a config that hasn't been used enough times, even if every usage is right now", () => {
        const entry = makeEntry("Rarely Used", now, [0, 0, 0, 0, 0]); // 5 usages: below the 6-use threshold

        expect(suggestConfigurations([entry], now)).toEqual([]);
    });

    it("includes a config right at the regular-use threshold", () => {
        const entry = makeEntry("Borderline", now, [0, 0, 0, 0, 0, 0]); // exactly 6 usages

        expect(suggestConfigurations([entry], now)).toEqual([entry]);
    });

    it("excludes a config whose usage history clusters at a different time of day", () => {
        const entry = makeEntry("Evening Routine", now, [6, 6, 6, 6, 6, 6]); // always 6h from now

        expect(suggestConfigurations([entry], now)).toEqual([]);
    });

    it("includes usages right at the edge of the time window", () => {
        const entry = makeEntry("Edge Of Window", now, Array(6).fill(TIME_WINDOW_HOURS)); // exactly at the boundary

        expect(suggestConfigurations([entry], now)).toEqual([entry]);
    });

    it("excludes usages just outside the time window", () => {
        // hourOfDay only has minute-level precision, so the offset needs a
        // whole extra minute (not just seconds) to register as outside the
        // window.
        const justOver = TIME_WINDOW_HOURS + 5 / 60;
        const entry = makeEntry("Just Outside Window", now, Array(6).fill(justOver));

        expect(suggestConfigurations([entry], now)).toEqual([]);
    });

    it("treats the time window as circular across midnight", () => {
        const lateNight = new Date(2026, 0, 15, 23, 0, 0); // 11:00pm
        // `lateNight` plus the window wraps past midnight; still within range.
        const entry = makeEntry("Past Midnight", lateNight, Array(6).fill(TIME_WINDOW_HOURS));

        expect(suggestConfigurations([entry], lateNight)).toEqual([entry]);
    });

    it("ignores a heavily-used config if none of its usages fall near the current time", () => {
        const entry = makeEntry("Never Near Now", now, [12, 12, 12, 12, 12, 12, 12, 12]); // always opposite time of day

        expect(suggestConfigurations([entry], now)).toEqual([]);
    });

    it("ranks configs by how many of their usages fall near the current time", () => {
        const mostlyNearby = makeEntry("Mostly Nearby", now, [0, 0, 0, 0, 0, 6]); // 5 near, 1 far
        const partlyNearby = makeEntry("Partly Nearby", now, [0, 0, 0, 6, 6, 6]); // 3 near, 3 far

        expect(suggestConfigurations([partlyNearby, mostlyNearby], now)).toEqual([mostlyNearby, partlyNearby]);
    });

    it("defaults to surfacing at most three suggestions", () => {
        const entries = ["A", "B", "C", "D"].map((name) => makeEntry(name, now, [0, 0, 0, 0, 0, 0]));

        expect(suggestConfigurations(entries, now)).toHaveLength(3);
    });

    it("caps the number of suggestions at the requested maximum", () => {
        const entries = ["A", "B", "C", "D"].map((name) => makeEntry(name, now, [0, 0, 0, 0, 0, 0]));

        expect(suggestConfigurations(entries, now, 2)).toHaveLength(2);
    });
});

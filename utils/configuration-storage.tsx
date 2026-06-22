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

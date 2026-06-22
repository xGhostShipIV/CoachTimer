import { TimeConfiguration } from "@/data/data-types";

export const DEFAULT_CONFIG: TimeConfiguration = {
    intervals: [
        {
            on: 60000,
            off: 30000,
            repeats: 1
        }
    ],
    numRounds: 3,
    roundRest: 30000
};

export const TEST_CONFIG: TimeConfiguration = {
    ...DEFAULT_CONFIG,
    intervals: [
        {
            on: 30000,
            off: 30000,
            repeats: 3
        },
        {
            on: 10000,
            off: 10000,
            repeats: 1
        },
        {
            on: 50000,
            off: 50000,
            repeats: 5
        }
    ]
}
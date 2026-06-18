import { TimeConfiguration } from "@/data/data-types";

export const DEFAULT_CONFIG: TimeConfiguration = {
    intervals: [
        {
            on: 60,
            off: 30,
            repeats: 1
        }
    ],
    numRounds: 3,
    roundRest: 30
};

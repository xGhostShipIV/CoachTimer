export interface SoundOptions {
    // Which sound do we play on round start?
    roundStartSfx?: string;
    // Which sound do we play on round end?
    roundEndSfx?: string;
    // Which sound do we play on round warning?
    roundEndWarningSfx?: string;
    // How much time in round remaining before we play it?
    roundEndWarningMs?: number;
    // How much remaining rest time before we play it?
    restEndWarningMs?: number;
}

export interface IntervalData {
    on: number;
    off: number;
    repeats: number;

    soundConfiguration?: SoundOptions;
}

// Configuration struct for setting up a timer
export interface TimeConfiguration {
    // How many times do we repeat our intervals?
    numRounds: number;
    // How long do we rest between rounds?
    roundRest: number;
    // Sounds.

    // This could probably go in its own file.
    soundConfiguration?: SoundOptions

    // Interval definitions
    intervals: IntervalData[];
}
import { useSoundManager } from "@/components/Notifications/sound-manager";
import { IntervalData, TimeConfiguration } from "@/data/data-types";
import { calculateRoundTime } from "@/utils/time-utils";
import { setTimerCallback } from "@/utils/timer-engine";
import { useEffect, useRef, useState } from "react";

export type Stage = "on" | "off" | "roundRest" | "finished";

export interface IntervalPreview {
    on: number;
    off: number;
}

// A flattened interval entry: `start` is the global repeat index (across all
// intervals) at which this interval begins.
interface IntervalStep {
    start: number;
    interval: IntervalData;
}

// Visual state derived each frame and rendered by the component.
interface TimerState {
    currentStage: Stage;
    currentRoundCount: number;
    timeRemainingMS: number;
}

// Drives a round-based on/off interval timer: advances through each
// interval's repeats, rests between rounds, and fires the configured sound
// effects on phase transitions and warning thresholds.
export function useIntervalTimer(data: TimeConfiguration) {
    const [timerState, setTimerState] = useState<TimerState | undefined>(undefined);
    const soundManager = useSoundManager();

    // Playback position within the current round: which global repeat index
    // we're on, and elapsed time within that interval's on/off cycle or rest.
    const currentIntervalIndex = useRef<number>(0);
    const timeInInterval = useRef<number>(0);
    const timeInRest = useRef<number>(0);
    const isResting = useRef<boolean>(false);

    // Guards so warning sounds only fire once per round/rest, not every frame
    // the remaining time happens to sit below the warning threshold.
    const hasPlayedRoundEndWarning = useRef<boolean>(false);
    const hasPlayedRestEndWarning = useRef<boolean>(false);

    // Tracks the on/off phase of the currently active interval entry so its
    // own start/end sfx fire once per transition (i.e. once per repeat).
    const previousIntervalPhase = useRef<"on" | "off" | undefined>(undefined);
    const hasPlayedIntervalOnWarning = useRef<boolean>(false);
    const hasPlayedIntervalOffWarning = useRef<boolean>(false);
    // The round's own start sfx always coincides with the first interval's
    // start, so skip the interval's once to give the round sound priority.
    const suppressNextIntervalStart = useRef<boolean>(true);

    const intervalSteps = useRef<IntervalStep[]>([]);
    const totalRepeats = useRef<number>(0);
    const stopTimerRef = useRef<(() => void) | null>(null);

    // frame and timestamp refs for the timer engine
    const frameRef = useRef<number | null>(null);
    const previousTimeRef = useRef<number | null>(null);

    const playSound = (soundName: string | undefined) => {
        if (soundName) {
            soundManager(soundName);
        }
    };

    // Plays an interval's own start/end/warning sfx on phase transitions and
    // threshold crossings. Skipped whenever a round-level sfx already fired
    // this frame, since the round sound takes priority over the interval's.
    const playIntervalPhaseSounds = (interval: IntervalData, phase: "on" | "off", roundSoundFiredThisFrame: boolean) => {
        const soundConfig = interval.soundConfiguration;
        const enteringPhase = previousIntervalPhase.current !== phase;

        if (phase === "on" && enteringPhase) {
            hasPlayedIntervalOnWarning.current = false;

            if (suppressNextIntervalStart.current) {
                suppressNextIntervalStart.current = false;
            } else if (!roundSoundFiredThisFrame) {
                playSound(soundConfig?.roundStartSfx);
            }
        }

        if (phase === "off" && enteringPhase) {
            hasPlayedIntervalOffWarning.current = false;

            if (!roundSoundFiredThisFrame) {
                playSound(soundConfig?.roundEndSfx);
            }
        }

        if (phase === "on") {
            const remaining = interval.on - timeInInterval.current;
            const warningMs = soundConfig?.roundEndWarningMs;
            if (warningMs !== undefined && remaining <= warningMs && !hasPlayedIntervalOnWarning.current) {
                hasPlayedIntervalOnWarning.current = true;
                if (!roundSoundFiredThisFrame) {
                    playSound(soundConfig?.roundEndWarningSfx);
                }
            }
        } else {
            const remaining = interval.on + interval.off - timeInInterval.current;
            const warningMs = soundConfig?.restEndWarningMs;
            if (warningMs !== undefined && remaining <= warningMs && !hasPlayedIntervalOffWarning.current) {
                hasPlayedIntervalOffWarning.current = true;
                if (!roundSoundFiredThisFrame) {
                    playSound(soundConfig?.roundEndWarningSfx);
                }
            }
        }

        previousIntervalPhase.current = phase;
    };

    // Flattens intervals into steps keyed by the global repeat index at which
    // each one starts, so a repeat index can be resolved back to its interval.
    const buildIntervalSteps = (intervals: IntervalData[]): IntervalStep[] => {
        let start = 0;

        return intervals.map((interval) => {
            const step: IntervalStep = { start, interval };
            start += interval.repeats;
            return step;
        });
    };

    // Resolves the IntervalData a global repeat index falls into, bounded by
    // totalRepeats so indices past the end correctly miss instead of falling
    // back to the last registered step.
    const getIntervalAtIndex = (index: number): IntervalData | undefined => {
        if (index < 0 || index >= totalRepeats.current) return undefined;

        const steps = intervalSteps.current;
        for (let i = steps.length - 1; i >= 0; i--) {
            if (steps[i].start <= index) return steps[i].interval;
        }

        return undefined;
    };

    // Frame update function called every frame
    const onFrame = (deltaMs: number) => {
        if (isResting.current) {
            timeInRest.current += deltaMs;
            const restRemaining = Math.max(data.roundRest - timeInRest.current, 0);

            const restWarningMs = data.soundConfiguration?.restEndWarningMs;
            if (restWarningMs !== undefined && restRemaining <= restWarningMs && !hasPlayedRestEndWarning.current) {
                hasPlayedRestEndWarning.current = true;
                playSound(data.soundConfiguration?.roundEndWarningSfx);
            }

            if (timeInRest.current < data.roundRest) {
                setTimerState((previous) => previous ? {
                    ...previous,
                    timeRemainingMS: restRemaining
                } : undefined);
                return;
            }

            // Rest is over - start the next round from its first interval.
            isResting.current = false;
            timeInRest.current = 0;
            hasPlayedRestEndWarning.current = false;
            hasPlayedRoundEndWarning.current = false;
            currentIntervalIndex.current = 0;
            timeInInterval.current = 0;
            previousIntervalPhase.current = undefined;
            suppressNextIntervalStart.current = true;

            playSound(data.soundConfiguration?.roundStartSfx);

            setTimerState((previous) => previous ? {
                ...previous,
                currentStage: "on",
                currentRoundCount: previous.currentRoundCount + 1,
                timeRemainingMS: calculateRoundTime(data.intervals)
            } : undefined);
            return;
        }

        timeInInterval.current += deltaMs;

        let current = getIntervalAtIndex(currentIntervalIndex.current);

        // Advance through any on/off segments completed this frame. The very
        // last repeat has no trailing off/rest, matching calculateRoundTime.
        while (current) {
            const isLastSlot = currentIntervalIndex.current === totalRepeats.current - 1;
            const segmentDuration = isLastSlot ? current.on : current.on + current.off;

            if (timeInInterval.current < segmentDuration) break;

            timeInInterval.current -= segmentDuration;
            currentIntervalIndex.current += 1;
            current = getIntervalAtIndex(currentIntervalIndex.current);
        }

        if (!current) {
            // All repeats of all intervals for this round are complete.
            playSound(data.soundConfiguration?.roundEndSfx);

            setTimerState((previous) => {
                if (!previous) return undefined;

                if (previous.currentRoundCount >= data.numRounds) {
                    // Last round finished - no rest period afterwards.
                    stopTimerRef.current?.();
                    return { ...previous, currentStage: "finished" };
                }

                isResting.current = true;
                timeInRest.current = 0;

                return {
                    ...previous,
                    currentStage: "roundRest",
                    timeRemainingMS: data.roundRest
                };
            });
            return;
        }

        const activeInterval = current;
        const intervalPhase: "on" | "off" = timeInInterval.current < activeInterval.on ? "on" : "off";

        let roundSoundFiredThisFrame = false;

        setTimerState((previous) => {
            if (!previous) return undefined;

            const newTimeRemaining = Math.max(previous.timeRemainingMS - deltaMs, 0);

            const roundWarningMs = data.soundConfiguration?.roundEndWarningMs;
            if (roundWarningMs !== undefined && newTimeRemaining <= roundWarningMs && !hasPlayedRoundEndWarning.current) {
                hasPlayedRoundEndWarning.current = true;
                roundSoundFiredThisFrame = true;
                playSound(data.soundConfiguration?.roundEndWarningSfx);
            }

            return {
                ...previous,
                currentStage: intervalPhase,
                timeRemainingMS: newTimeRemaining
            };
        });

        playIntervalPhaseSounds(activeInterval, intervalPhase, roundSoundFiredThisFrame);
    };

    useEffect(() => {
        setTimerState({
            currentStage: "on",
            currentRoundCount: 1,
            timeRemainingMS: calculateRoundTime(data.intervals)
        });

        intervalSteps.current = buildIntervalSteps(data.intervals);
        totalRepeats.current = data.intervals.reduce((acc, interval) => acc + interval.repeats, 0);

        playSound(data.soundConfiguration?.roundStartSfx);

        stopTimerRef.current = setTimerCallback(frameRef, previousTimeRef, onFrame);

        return () => stopTimerRef.current?.();
    }, []);

    // Remaining on/off time for the currently active interval: ticks down
    // the on time first, then the off time, once the on phase is spent.
    const getCurrentIntervalRemaining = (interval: IntervalData): IntervalPreview => {
        const elapsed = timeInInterval.current;

        if (elapsed < interval.on) {
            return { on: interval.on - elapsed, off: interval.off };
        }

        return { on: 0, off: Math.max(interval.on + interval.off - elapsed, 0) };
    };

    // Current and next interval to preview, with the current one's on/off
    // ticked down to its actual remaining time.
    const intervalPreview: IntervalPreview[] = [];
    const current = getIntervalAtIndex(currentIntervalIndex.current);
    const next = getIntervalAtIndex(currentIntervalIndex.current + 1);
    if (current) intervalPreview.push(getCurrentIntervalRemaining(current));
    if (next) intervalPreview.push(next);

    return {
        currentStage: timerState?.currentStage,
        currentRoundCount: timerState?.currentRoundCount,
        timeRemainingMS: timerState?.timeRemainingMS,
        intervalPreview,
    };
}

import { formatTimestamp } from "@/utils/time-utils";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "../../themed-text";
import { ThemedView } from "../../themed-view";
import { TimeConfiguration } from "./interval-setup-view";

interface ActiveTimerProps {
    data: TimeConfiguration;
    onFinish?: () => void;
    onStop?: () => void;
}

type Stage = "on" | "off" | "roundRest" | "finished";

export default function IntervalActiveTimer({ data, onFinish, onStop }: ActiveTimerProps) {
    const [stage, setStage] = useState<Stage>("on");
    const [displayMs, setDisplayMs] = useState(0);

    const frameRef = useRef<number | null>(null);
    const previousRef = useRef<number | null>(null);
    const finishedCalledRef = useRef(false);

    const roundRef = useRef(1);
    const intervalIndexRef = useRef(0);
    const repRef = useRef(1);
    const remainingRef = useRef(0);

    const { intervals, numRounds, roundRest } = data;
    const currentInterval = intervals[intervalIndexRef.current];

    const setStageAndRemaining = (nextStage: Stage) => {
        setStage(nextStage);

        if (nextStage === "finished") {
            remainingRef.current = 0;
            setDisplayMs(0);
            return;
        }

        const nextDuration =
            nextStage === "roundRest"
                ? roundRest * 1000
                : ((nextStage === "on" ? currentInterval?.on : currentInterval?.off) ?? 0) * 1000;

        remainingRef.current = nextDuration;
        setDisplayMs(nextDuration);
    };

    const initializeTimer = () => {
        roundRef.current = 1;
        intervalIndexRef.current = 0;
        repRef.current = 1;
        finishedCalledRef.current = false;

        if (intervals.length === 0) {
            setStageAndRemaining("finished");
            return;
        }

        remainingRef.current = intervals[0].on * 1000;
        setDisplayMs(remainingRef.current);
        setStage("on");
    };

    const advanceStage = () => {
        const lastIndex = intervals.length - 1;
        const currentIndex = intervalIndexRef.current;
        const current = intervals[currentIndex];
        const repeats = current?.repeats ?? 1;

        if (stage === "on") {
            const isLastInterval = currentIndex === lastIndex;
            const isLastRep = repRef.current === repeats;

            if (isLastInterval && isLastRep) {
                if (roundRef.current < numRounds) {
                    setStageAndRemaining("roundRest");
                } else {
                    setStageAndRemaining("finished");
                }
            } else {
                setStageAndRemaining("off");
            }
            return;
        }

        if (stage === "off") {
            if (repRef.current < repeats) {
                repRef.current += 1;
                setStageAndRemaining("on");
                return;
            }

            const nextIndex = currentIndex + 1;
            if (nextIndex <= lastIndex) {
                intervalIndexRef.current = nextIndex;
                repRef.current = 1;
                setStageAndRemaining("on");
                return;
            }

            if (roundRef.current < numRounds) {
                setStageAndRemaining("roundRest");
            } else {
                setStageAndRemaining("finished");
            }
            return;
        }

        if (stage === "roundRest") {
            roundRef.current += 1;
            intervalIndexRef.current = 0;
            repRef.current = 1;
            setStageAndRemaining("on");
        }
    };

    useEffect(() => {
        initializeTimer();
    }, [intervals, numRounds, roundRest]);

    useEffect(() => {
        if (stage === "finished") {
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
            previousRef.current = null;
            return;
        }

        const tick = (now: number) => {
            if (previousRef.current == null) previousRef.current = now;
            const delta = now - previousRef.current;
            previousRef.current = now;

            remainingRef.current = Math.max(0, remainingRef.current - delta);
            setDisplayMs(remainingRef.current);

            if (remainingRef.current <= 0) {
                advanceStage();
            }

            frameRef.current = requestAnimationFrame(tick);
        };

        frameRef.current = requestAnimationFrame(tick);

        return () => {
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
            previousRef.current = null;
        };
    }, [stage, intervals, numRounds, roundRest]);

    useEffect(() => {
        if (stage === "finished" && !finishedCalledRef.current) {
            finishedCalledRef.current = true;
            onFinish?.();
        }
    }, [stage, onFinish]);

    return (
        <ThemedView>
            <ThemedText>{`Round ${roundRef.current} / ${numRounds}`}</ThemedText>
            <ThemedText>{`Interval ${intervalIndexRef.current + 1} / ${intervals.length}`}</ThemedText>
            <ThemedText>{`Rep ${repRef.current} / ${currentInterval?.repeats ?? 1}`}</ThemedText>
            <ThemedText>{`Stage: ${stage}`}</ThemedText>
            <ThemedText style={styles.timerText}>{formatTimestamp(displayMs, false)}</ThemedText>

            <ThemedView style={styles.controlsRow}>
                <Pressable style={[styles.controlButton, styles.stopButton]} onPress={() => onStop?.()}>
                    <ThemedText style={styles.controlButtonText}>Stop</ThemedText>
                </Pressable>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    controlsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
    },
    controlButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: "#0A84FF",
        marginHorizontal: 8,
    },
    controlButtonText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
    stopButton: {
        backgroundColor: "#FF3B30",
    },
    timerText: {
        fontSize: 28,
    },
});
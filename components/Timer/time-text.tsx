import { formatTimestamp } from "@/utils/time-utils";
import { useEffect, useRef, useState } from "react";
import { ThemedText } from "../themed-text";
import { styles } from "./time-keeper-styles";

interface TimeTextProps {
    /** Render milliseconds in the output string. */
    showMilliseconds?: boolean;
    /** Whether the timer should be paused. */
    isPaused: boolean;
    /** Called every frame with the delta since the previous frame. */
    onTick?: (frameDelta: number) => void;
    /** Use this value to reset the timer from the parent. */
    resetSignal?: number;
    /** Optional countdown start time in milliseconds. */
    countdownFrom?: number;
}

export function TimeText({
    showMilliseconds = true,
    isPaused,
    onTick,
    resetSignal = 0,
    countdownFrom,
}: TimeTextProps) {
    const [elapsedTime, setElapsedTime] = useState(countdownFrom ?? 0);
    const accumulatedRef = useRef(0);
    const startRef = useRef<number | null>(null);
    const previousFrameRef = useRef<number | null>(null);
    const frameIdRef = useRef<number | null>(null);
    const previousResetRef = useRef(resetSignal);
    const previousCountdownFromRef = useRef(countdownFrom);

    const getCurrentTime = (now: number) => {
        const runningOffset = startRef.current !== null ? now - startRef.current : 0;
        const totalElapsed = accumulatedRef.current + runningOffset;

        if (countdownFrom === undefined) {
            return totalElapsed;
        }

        return Math.max(0, countdownFrom - totalElapsed);
    };

    useEffect(() => {
        if (isPaused) {
            if (frameIdRef.current !== null) {
                cancelAnimationFrame(frameIdRef.current);
                frameIdRef.current = null;
            }
            return;
        }

        const now = Date.now();
        startRef.current = now;
        previousFrameRef.current = now;

        const tick = () => {
            const now = Date.now();
            const frameDelta = previousFrameRef.current ? now - previousFrameRef.current : 0;
            const nextElapsed = getCurrentTime(now);

            previousFrameRef.current = now;
            setElapsedTime(nextElapsed);
            onTick?.(frameDelta);
            frameIdRef.current = requestAnimationFrame(tick);
        };

        frameIdRef.current = requestAnimationFrame(tick);

        return () => {
            if (frameIdRef.current !== null) {
                cancelAnimationFrame(frameIdRef.current);
                frameIdRef.current = null;
            }

            if (startRef.current !== null) {
                accumulatedRef.current += Date.now() - startRef.current;
                startRef.current = null;
            }

            previousFrameRef.current = null;
        };
    }, [isPaused, onTick, countdownFrom]);

    useEffect(() => {
        if (resetSignal === previousResetRef.current && countdownFrom === previousCountdownFromRef.current) {
            return;
        }

        previousResetRef.current = resetSignal;
        previousCountdownFromRef.current = countdownFrom;

        if (frameIdRef.current !== null) {
            cancelAnimationFrame(frameIdRef.current);
            frameIdRef.current = null;
        }

        accumulatedRef.current = 0;
        startRef.current = null;
        previousFrameRef.current = null;
        setElapsedTime(countdownFrom ?? 0);
        onTick?.(0);
    }, [resetSignal, countdownFrom, onTick]);

    return (
        <ThemedText style={styles.timerText}>
            {formatTimestamp(elapsedTime, showMilliseconds)}
        </ThemedText>
    );
}

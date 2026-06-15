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
}

const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = 60 * MS_IN_SECOND;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;

function pad(value: number, length: number) {
    return String(value).padStart(length, '0');
}

function formatTimestamp(timestamp: number, showMilliseconds: boolean) {
    const hours = Math.floor(timestamp / MS_IN_HOUR);
    const minutes = Math.floor((timestamp % MS_IN_HOUR) / MS_IN_MINUTE);
    const seconds = Math.floor((timestamp % MS_IN_MINUTE) / MS_IN_SECOND);
    const milliseconds = timestamp % MS_IN_SECOND;

    const timeString = `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}`;

    return showMilliseconds
        ? `${timeString}:${pad(Math.floor(milliseconds / 10), 2)}`
        : timeString;
}

export function TimeText({
    showMilliseconds = true,
    isPaused,
    onTick,
    resetSignal = 0,
}: TimeTextProps) {
    const [elapsedTime, setElapsedTime] = useState(0);
    const accumulatedRef = useRef(0);
    const startRef = useRef<number | null>(null);
    const previousFrameRef = useRef<number | null>(null);
    const frameIdRef = useRef<number | null>(null);
    const previousResetRef = useRef(resetSignal);

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
            const nextElapsed = accumulatedRef.current + (now - (startRef.current ?? now));

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
    }, [isPaused, onTick]);

    useEffect(() => {
        if (resetSignal === previousResetRef.current) {
            return;
        }

        previousResetRef.current = resetSignal;

        if (frameIdRef.current !== null) {
            cancelAnimationFrame(frameIdRef.current);
            frameIdRef.current = null;
        }

        accumulatedRef.current = 0;
        startRef.current = null;
        previousFrameRef.current = null;
        setElapsedTime(0);
        onTick?.(0);
    }, [resetSignal, onTick]);

    return (
        <ThemedText style={styles.timerText}>
            {formatTimestamp(elapsedTime, showMilliseconds)}
        </ThemedText>
    );
}

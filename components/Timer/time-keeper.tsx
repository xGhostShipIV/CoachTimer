import { useEffect, useRef, useState } from "react";
import { Pressable } from "react-native";
import NotificationContainer, { NotificationData } from "../Notifications/notification-container";
import { useSoundManager } from "../Notifications/sound-manager";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { styles } from "./time-keeper-styles";
import { TimeText } from "./time-text";

// Now I can create and edit notifications.
// How can I connect my elapsed time, to the execution of our notifications?

export function TimeKeeper() {
    const [isPaused, setIsPaused] = useState(true);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null);

    const accumulatedTimeRef = useRef(0);

    const startTimeRef = useRef<number | null>(null);
    const requestRef = useRef<number | null>(null);

    const notificationSet = useSoundManager();

    useEffect(() => {
        if (isPaused) {
            if (requestRef.current !== null) {
                cancelAnimationFrame(requestRef.current);
                requestRef.current = null;
            }
            return;
        }

        startTimeRef.current = Date.now();

        const tick = () => {
            const now = Date.now();
            const elapsedSinceStart = startTimeRef.current ? now - startTimeRef.current : 0;
            setElapsedTime(accumulatedTimeRef.current + elapsedSinceStart);
            requestRef.current = requestAnimationFrame(tick);
        };

        requestRef.current = requestAnimationFrame(tick);

        return () => {
            if (requestRef.current !== null) {
                cancelAnimationFrame(requestRef.current);
                requestRef.current = null;
            }
        };
    }, [isPaused]);

    const togglePause = () => {
        if (isPaused) {
            setIsPaused(false);
            return;
        }

        if (startTimeRef.current !== null) {
            accumulatedTimeRef.current += Date.now() - startTimeRef.current;
        }

        setElapsedTime(accumulatedTimeRef.current);
        setIsPaused(true);
    };

    const clearTimer = () => {
        if (requestRef.current !== null) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = null;
        }

        setIsPaused(true);
        setElapsedTime(0);
        accumulatedTimeRef.current = 0;
        startTimeRef.current = null;
    };

    return (
        <ThemedView style={styles.container}>
            <NotificationContainer onCreate={(notification) => setCurrentNotification(notification)} />
            <ThemedText type="title" style={styles.labelText}>
                Elapsed Time
            </ThemedText>

            <TimeText timestamp={elapsedTime} showMilliseconds={true} />

            <ThemedView style={styles.buttonRow}>
                <Pressable
                    style={[
                        styles.button,
                        isPaused ? styles.buttonPaused : styles.buttonRunning,
                        styles.buttonMargin,
                    ]}
                    onPress={ () => {
                        notificationSet(isPaused ? 'four_double_beep' : '');
                        togglePause();
                    }}
                >
                    <ThemedText style={styles.buttonText}>
                        {isPaused ? 'Resume' : 'Pause'}
                    </ThemedText>
                </Pressable>

                <Pressable style={[styles.button, styles.buttonClear]} onPress={clearTimer}>
                    <ThemedText style={styles.buttonText}>Stop / Clear</ThemedText>
                </Pressable>
            </ThemedView>
        </ThemedView>
    );
}

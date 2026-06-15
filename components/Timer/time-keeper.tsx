import { useCallback, useRef, useState } from "react";
import { Pressable } from "react-native";
import NotificationContainer from "../Notifications/notification-container";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { styles } from "./time-keeper-styles";
import { TimeText } from "./time-text";

// Now I can create and edit notifications.
// How can I connect my elapsed time, to the execution of our notifications?

export function TimeKeeper() {
    const [isPaused, setIsPaused] = useState(true);
    const [resetSignal, setResetSignal] = useState(0);
    const notificationTickRef = useRef<(delta: number) => void>(() => {});

    const handleTick = useCallback((delta: number) => {
        notificationTickRef.current(delta);
    }, []);

    const togglePause = () => {
        setIsPaused((previous) => !previous);
    };

    const clearTimer = () => {
        setIsPaused(true);
        setResetSignal((previous) => previous + 1);
    };

    return (
        <ThemedView style={styles.container}>
            <NotificationContainer
                tickHandlerRef={notificationTickRef}
                resetSignal={resetSignal}
            />
            <ThemedText type="title" style={styles.labelText}>
                Elapsed Time
            </ThemedText>

            <TimeText
                isPaused={isPaused}
                showMilliseconds={true}
                resetSignal={resetSignal}
                onTick={handleTick}
            />

            <ThemedView style={styles.buttonRow}>
                <Pressable
                    style={[
                        styles.button,
                        isPaused ? styles.buttonPaused : styles.buttonRunning,
                        styles.buttonMargin,
                    ]}
                    onPress={togglePause}
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

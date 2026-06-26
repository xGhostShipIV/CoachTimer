import { BackButton } from "@/components/timer-action-buttons";
import { BTCStyles, Color } from "@/styles/BTCIntervalTimer";
import { useCallback, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NotificationContainer from "../Notifications/notification-container";
import { TimeText } from "../Timer/time-text";

interface StopwatchViewProps {
    onBack?: () => void;
}

export function StopwatchView({ onBack }: StopwatchViewProps) {
    const insets = useSafeAreaInsets();
    const [isPaused, setIsPaused] = useState(true);
    const [resetSignal, setResetSignal] = useState(0);
    const notificationTickRef = useRef<(delta: number) => void>(() => { });

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
        <View style={styles.screen}>
            <View style={[BTCStyles.toolbar, { paddingLeft: 0 }]}>
                {onBack && <BackButton onPress={onBack} style={BTCStyles.toolBack} />}
            </View>

            <View style={{ paddingTop: 22 }}>
                <NotificationContainer
                    tickHandlerRef={notificationTickRef}
                    resetSignal={resetSignal}
                />
            </View>

            <View style={[styles.heroBlock, { flex: 1 }]}>
                <Text style={[BTCStyles.heroLabel, styles.heroLabel, { marginBottom: 8 }]}>ELAPSED TIME</Text>
                <View style={{ justifyContent: 'center', alignContent: 'center', flexGrow: 1 }}>
                    <TimeText
                        isPaused={isPaused}
                        showMilliseconds={true}
                        resetSignal={resetSignal}
                        onTick={handleTick}
                        style={[BTCStyles.hero, styles.heroValue, { fontSize: 60 }]}
                    />
                </View>
            </View>


            <View style={styles.actions}>
                <Pressable style={BTCStyles.start} onPress={togglePause}>
                    <Text style={BTCStyles.startText}>{isPaused ? "▸ START" : "‖ PAUSE"}</Text>
                </Pressable>

                <Pressable style={[BTCStyles.stop, styles.stopButton]} onPress={clearTimer}>
                    <Text style={[BTCStyles.stopGlyph, styles.stopColor]}>▪</Text>
                    <Text style={[BTCStyles.stopText, styles.stopColor]}>STOP / CLEAR</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Color.navy,
        paddingHorizontal: 18,
    },
    heroBlock: {
        marginTop: 28,
        marginBottom: 28,
    },
    heroLabel: {
        color: '#7e8cb6',
    },
    heroValue: {
        color: Color.white,
    },
    actions: {
        gap: 11,
        marginBottom: 18,
    },
    stopButton: {
        backgroundColor: '#16213f',
        borderColor: '#34406a',
    },
    stopColor: {
        color: '#cdd6ec',
    },
});

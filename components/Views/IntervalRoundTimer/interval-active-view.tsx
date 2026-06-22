import { TimeConfiguration } from "@/data/data-types";
import mainStyles from "@/styles/main-styles";
import { formatTimestamp } from "@/utils/time-utils";
import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "../../themed-text";
import { ThemedView } from "../../themed-view";
import ActiveIntervalStack from "./active-interval-stack";
import { useIntervalTimer } from "./use-interval-timer";

interface ActiveTimerProps {
    data: TimeConfiguration;
    onFinish?: () => void;
    onStop?: () => void;
}

export default function IntervalActiveTimer({ data, onStop }: ActiveTimerProps) {
    const { currentStage, currentRoundCount, timeRemainingMS, intervalPreview } = useIntervalTimer(data);

    return (
        <ThemedView style={mainStyles.screen}>
            <ThemedText>{`Round ${currentRoundCount} / ${data.numRounds}`}</ThemedText>

            <ActiveIntervalStack intervals={intervalPreview} />

            <ThemedText>{`Stage: ${currentStage}`}</ThemedText>
            <ThemedText style={styles.timerText}>{formatTimestamp(Math.ceil((timeRemainingMS ?? 0) / 1000) * 1000, false)}</ThemedText>

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

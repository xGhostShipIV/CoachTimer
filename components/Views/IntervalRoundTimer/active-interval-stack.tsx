import { StyleSheet } from "react-native";
import { ThemedView } from "../../themed-view";
import ActiveInterval from "./active-interval";
import { IntervalPreview } from "./use-interval-timer";

interface ActiveIntervalStackProps {
    intervals: IntervalPreview[];
}

// Masked stack showing the current interval's remaining on/off time, with
// the next interval peeking in below it.
export default function ActiveIntervalStack({ intervals }: ActiveIntervalStackProps) {
    return (
        <ThemedView style={styles.mask}>
            <ThemedView style={styles.stack}>
                {intervals.map((interval, index) => (
                    <ActiveInterval
                        key={index === 0 ? "current" : "next"}
                        on={interval.on}
                        off={interval.off}
                    />
                ))}
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    mask: {
        height: 112,
        overflow: "hidden",
        width: "100%",
    },
    stack: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        marginVertical: 12,
    },
});

import { BTCStyles, Font } from "@/styles/BTCIntervalTimer";
import { formatMinutesSeconds } from "@/utils/time-utils";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import IntervalBlock from "./active-interval";
import { IntervalPreview } from "./use-interval-timer";

interface ActiveIntervalStackProps {
    intervals: IntervalPreview[];
    // Which segment of the *current* interval is live; null when nothing is
    // running yet (round rest, previewing the next round's first interval).
    activePhase: "on" | "off" | null;
    // The screen's current stage background — the next-interval preview
    // fades into this color at its bottom edge.
    fadeToColor: string;
}

// The current interval's live two-tone block, with the next interval
// peeking in below it, masked and fading out toward the bottom.
export default function ActiveIntervalStack({ intervals, activePhase, fadeToColor }: ActiveIntervalStackProps) {
    const [current, next] = intervals;

    return (
        <View>
            {current && (
                <IntervalBlock
                    number={current.number}
                    onRemainingMs={current.on}
                    onTotalMs={current.onTotalMs}
                    offRemainingMs={current.off}
                    offTotalMs={current.offTotalMs}
                    activePhase={activePhase}
                />
            )}

            {next && (
                <View style={styles.nextMask}>
                    <View style={styles.nextRow}>
                        <Text style={styles.nextLabel}>{`INTERVAL ${next.number} · ON`}</Text>
                        <Text style={styles.nextValue}>{formatMinutesSeconds(next.onTotalMs)}</Text>
                    </View>

                    <LinearGradient pointerEvents="none" colors={["transparent", fadeToColor]} style={BTCStyles.fade} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    nextMask: {
        marginTop: 12,
        height: 64,
        overflow: "hidden",
    },
    nextRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingVertical: 14,
        opacity: 0.4,
    },
    nextLabel: {
        fontFamily: Font.barlowBold,
        fontSize: 13,
        letterSpacing: 2,
        color: "#8593bd",
    },
    nextValue: {
        fontFamily: Font.oswaldSemi,
        fontSize: 24,
        color: "#8593bd",
    },
});

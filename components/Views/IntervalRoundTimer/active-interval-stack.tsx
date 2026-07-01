import { Font } from "@/styles/BTCIntervalTimer";
import { ScrollView, StyleSheet, View } from "react-native";
import IntervalBlock from "./active-interval";
import { IntervalPreview } from "./use-interval-timer";

interface ActiveIntervalStackProps {
    intervals: IntervalPreview[];
    // Which segment of the *current* interval is live; null when nothing is
    // running yet (round rest, previewing the next round's first interval).
    activePhase: "on" | "off" | null;
    // The screen's current stage background — the upcoming list fades into
    // this color near the bottom of the screen.
    fadeToColor: string;
}

// The current interval's live two-tone block stays fixed up top, with every
// other interval left in the round queued up beneath it in its own
// scrollview, masked so entries scrolled toward the bottom of the screen
// dissolve into the background instead of cutting off hard.
export default function ActiveIntervalStack({ intervals, activePhase, fadeToColor }: ActiveIntervalStackProps) {
    const [current, ...upcoming] = intervals;

    return (
        <ScrollView contentContainerStyle={styles.upcomingContent} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
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

                {upcoming.length > 0 && (
                    <View style={{...styles.upcomingMask, opacity: 0.6 }}>
                        {upcoming.map((interval, i) => (
                            <IntervalBlock
                                key={i}
                                number={interval.number}
                                onRemainingMs={interval.on}
                                onTotalMs={interval.onTotalMs}
                                offRemainingMs={interval.off}
                                offTotalMs={interval.offTotalMs}
                                activePhase={null}
                                isPending
                            />
                        ))}

                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    upcomingMask: {
        flex: 1,
        marginTop: 12,
        overflow: "hidden",
        gap: 6
    },
    upcomingContent: {
        paddingBottom: 70,
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

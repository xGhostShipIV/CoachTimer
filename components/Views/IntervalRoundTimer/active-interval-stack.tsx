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
        <ScrollView contentContainerStyle={{ paddingBottom: 70 }} showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1 }}>
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
    upcomingMask: {
        flex: 1,
        marginTop: 12,
        overflow: "hidden",
        gap: 6
    }
});

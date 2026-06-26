import { useScreenBackground } from "@/components/screen-frame";
import { TimeConfiguration } from "@/data/data-types";
import { BTCStyles, Stage } from "@/styles/BTCIntervalTimer";
import { formatMinutesSeconds } from "@/utils/time-utils";
import { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActiveIntervalStack from "./active-interval-stack";
import { useIntervalTimer } from "./use-interval-timer";

interface ActiveTimerProps {
    data: TimeConfiguration;
    onFinish?: () => void;
    onStop?: () => void;
}

function pad2(value: number) {
    return String(value).padStart(2, "0");
}

// Engine stage -> BTCStyles palette key. "on" reads white-hot ("work"),
// "off" reads in the strike accent ("recover"); "finished"/undefined fall
// back to "work" since onFinish below unmounts this view almost immediately.
function paletteFor(stage: ReturnType<typeof useIntervalTimer>["currentStage"]) {
    if (stage === "off") return Stage.recover;
    if (stage === "roundRest") return Stage.roundRest;
    return Stage.work;
}

export default function IntervalActiveTimer({ data, onFinish, onStop }: ActiveTimerProps) {
    const insets = useSafeAreaInsets();
    const { currentStage, currentRoundCount, timeRemainingMS, intervalPreview } = useIntervalTimer(data);

    useEffect(() => {
        if (currentStage === "finished") {
            onFinish?.();
        }
    }, [currentStage, onFinish]);

    const palette = paletteFor(currentStage);
    const activePhase = currentStage === "on" ? "on" : currentStage === "off" ? "off" : null;
    const isRoundRest = currentStage === "roundRest";
    const noRest = activePhase === "on" && intervalPreview[0]?.offTotalMs === 0;
    const roundCount = currentRoundCount ?? 1;

    // The stage tint should cover the entire screen (including behind the
    // status bar), not just this view's own content box — ScreenFrame owns
    // that area, so hand the color up to it instead of only painting our
    // own root.
    useScreenBackground(palette.screen);

    return (
        <View style={[styles.screen, { backgroundColor: palette.screen, paddingHorizontal: 18 }]}>
            <View style={BTCStyles.roundRow}>
                <Text style={[BTCStyles.roundLabel, { color: palette.roundLabel }]}>ROUND</Text>
                <Text style={[BTCStyles.roundNum, { color: palette.roundNum }]}>{pad2(roundCount)}</Text>
                <Text style={[BTCStyles.roundSlash, { color: palette.roundSlash }]}>{`/ ${pad2(data.numRounds)}`}</Text>
            </View>

            <View style={styles.heroBlock}>
                <Text style={[BTCStyles.heroLabel, { color: palette.heroLabel }]}>
                    {isRoundRest ? "ROUND REST" : "ROUND REMAINING"}
                </Text>
                <Text style={[BTCStyles.hero, { color: palette.hero }]}>
                    {formatMinutesSeconds(timeRemainingMS ?? 0)}
                </Text>
            </View>

            <View style={[BTCStyles.phaseStrip, { backgroundColor: palette.stripBg }]}>
                <View style={[BTCStyles.phaseDot, { backgroundColor: palette.stripDot }]} />
                <Text style={[BTCStyles.phaseLabel, { color: palette.stripText }]}>
                    {isRoundRest ? "ROUND REST" : activePhase === "off" ? "RECOVER" : "WORK"}
                </Text>
                {noRest && <Text style={[BTCStyles.phaseTag, { color: palette.stripTagText }]}>NO REST</Text>}
            </View>

            {isRoundRest && (
                <View style={BTCStyles.upNextCard}>
                    <Text style={BTCStyles.upNextKicker}>UP NEXT</Text>
                    <View style={styles.upNextRow}>
                        <Text style={BTCStyles.upNextRound}>{`ROUND ${pad2(roundCount + 1)}`}</Text>
                        <Text style={BTCStyles.upNextSlash}>{`/ ${pad2(data.numRounds)}`}</Text>
                    </View>
                </View>
            )}

            <View style={{flex: 1}}>
                <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
                    <ActiveIntervalStack intervals={intervalPreview} activePhase={activePhase} fadeToColor={palette.screen} />
                </ScrollView>
            </View>

            <Pressable
                style={[
                    BTCStyles.stop,
                    styles.stopMargin,
                    { backgroundColor: palette.stopBg, borderColor: palette.stopBorder, marginBottom: Math.max(18, insets.bottom + 10) },
                ]}
                onPress={() => onStop?.()}
            >
                <Text style={[BTCStyles.stopGlyph, { color: palette.stopText }]}>▪</Text>
                <Text style={[BTCStyles.stopText, { color: palette.stopText }]}>STOP</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    scroll: {
        flex: 1,
        overflow: 'hidden'
    },
    body: {
        paddingTop: 18,
        paddingBottom: 12,
        gap: 18,
    },
    heroBlock: {
        marginTop: -4,
        marginBottom: 8
    },
    upNextRow: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 7,
    },
    stopMargin: {
        marginHorizontal: 18,
    },
});

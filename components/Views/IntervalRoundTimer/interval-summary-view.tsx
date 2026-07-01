import { TimeConfiguration } from "@/data/data-types";
import { BTCStyles, Color, Font } from "@/styles/BTCIntervalTimer";
import { calculateWorkoutSummary, formatMinutesSeconds } from "@/utils/time-utils";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface IntervalSummaryViewProps {
    configuration: TimeConfiguration;
    configName?: string;
    finishedAt: Date;
    onBackToSetup?: () => void;
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function pad2(value: number) {
    return String(value).padStart(2, "0");
}

function formatSessionStamp(date: Date): string {
    const hour24 = date.getHours();
    const hour12 = hour24 % 12 || 12;
    const meridiem = hour24 >= 12 ? "PM" : "AM";
    return `${MONTHS[date.getMonth()]} ${pad2(date.getDate())} · ${hour12}:${pad2(date.getMinutes())} ${meridiem}`;
}

export default function IntervalSummaryView({ configuration, configName, finishedAt, onBackToSetup }: IntervalSummaryViewProps) {
    const insets = useSafeAreaInsets();
    const summary = useMemo(() => calculateWorkoutSummary(configuration), [configuration]);

    return (
        <View style={styles.body}>
            <View style={styles.badgeRow}>
                <View style={styles.completeBadge}>
                    <Text style={styles.completeBadgeGlyph}>{"✓"}</Text>
                </View>
                <Text style={styles.completeLabel}>SESSION COMPLETE</Text>
                <Text style={styles.stamp}>{formatSessionStamp(finishedAt)}</Text>
            </View>

            <Text style={BTCStyles.workoutName}>{(configName ?? "New Workout").toUpperCase()}</Text>
            <View style={[BTCStyles.nameRule, styles.nameRuleSpacing]} />

            <View style={styles.card}>
                <Text style={styles.cardLabel}>TOTAL TIME WORKED OUT</Text>
                <Text style={styles.heroValue}>{formatMinutesSeconds(summary.totalTimeMs)}</Text>

                <View style={styles.hr} />

                <View style={styles.splitRow}>
                    <View>
                        <Text style={styles.cardLabel}>WORK</Text>
                        <Text style={styles.splitValue}>{formatMinutesSeconds(summary.workTimeMs)}</Text>
                    </View>
                    <View style={styles.splitDivider} />
                    <View>
                        <Text style={styles.cardLabel}>REST</Text>
                        <Text style={[styles.splitValue, styles.splitValueDim]}>{formatMinutesSeconds(summary.restTimeMs)}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.pairRow}>
                <View style={[styles.card, styles.pairCard]}>
                    <Text style={styles.cardLabel}>ROUNDS</Text>
                    <View style={styles.pairValueRow}>
                        <Text style={styles.pairValue}>{summary.rounds}</Text>
                        <Text style={styles.pairValueDim}>{` / ${summary.rounds}`}</Text>
                    </View>
                </View>
                <View style={[styles.card, styles.pairCard]}>
                    <Text style={styles.cardLabel}>INTERVALS</Text>
                    <Text style={styles.pairValue}>{summary.intervalsCompleted}</Text>
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.heroLabelRow}>
                    <View style={styles.heroDot} />
                    <Text style={styles.cardLabelOrange}>LONGEST ACTIVE PERIOD</Text>
                </View>
                <View style={styles.longestRow}>
                    <View>
                        <Text style={styles.longestSubLabel}>{`ROUND ${pad2(summary.longestActiveRound)}`}</Text>
                        <Text style={styles.longestSubLabel}>{`INTERVAL ${summary.longestActiveInterval}`}</Text>
                    </View>
                    <View style={styles.longestTimeBlock}>
                        <Text style={styles.longestValue}>{formatMinutesSeconds(summary.longestActiveMs)}</Text>
                        <View style={styles.longestRule} />
                    </View>
                </View>
            </View>

            <Pressable
                style={[BTCStyles.start, styles.backButton, { marginBottom: Math.max(18, insets.bottom + 10) }]}
                onPress={() => onBackToSetup?.()}
            >
                <Text style={BTCStyles.startText}>{"‹ BACK TO SETUP"}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    badgeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        marginBottom: 14,
    },
    completeBadge: {
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Color.orange,
        borderRadius: 6,
    },
    completeBadgeGlyph: {
        color: Color.white,
        fontFamily: Font.oswaldBold,
        fontSize: 13,
    },
    completeLabel: {
        fontFamily: Font.barlowBold,
        fontSize: 12,
        letterSpacing: 1.5,
        color: Color.orange,
    },
    stamp: {
        marginLeft: "auto",
        fontFamily: Font.mono,
        fontSize: 11,
        color: "#5d6a93",
    },
    nameRuleSpacing: {
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#0e1a38",
        borderWidth: 1,
        borderColor: "#2a3f74",
        borderRadius: 10,
        padding: 16,
        marginBottom: 14,
    },
    cardLabel: {
        fontFamily: Font.barlowBold,
        fontSize: 11,
        letterSpacing: 1.5,
        color: "#7e8cb6",
        marginBottom: 4,
    },
    cardLabelOrange: {
        fontFamily: Font.barlowBold,
        fontSize: 11,
        letterSpacing: 1.5,
        color: Color.orange,
    },
    heroValue: {
        fontFamily: Font.oswaldBold,
        fontSize: 52,
        color: Color.white,
        letterSpacing: 1,
    },
    hr: {
        height: 1,
        backgroundColor: "#21376a",
        marginVertical: 14,
    },
    splitRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 18,
    },
    splitDivider: {
        width: 1,
        alignSelf: "stretch",
        backgroundColor: "#21376a",
    },
    splitValue: {
        fontFamily: Font.oswaldBold,
        fontSize: 24,
        color: Color.white,
    },
    splitValueDim: {
        color: "#8593bd",
    },
    pairRow: {
        flexDirection: "row",
        gap: 12,
    },
    pairCard: {
        flex: 1,
        marginBottom: 14,
    },
    pairValueRow: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    pairValue: {
        fontFamily: Font.oswaldBold,
        fontSize: 30,
        color: Color.white,
    },
    pairValueDim: {
        fontFamily: Font.oswaldSemi,
        fontSize: 16,
        color: "#5d6a93",
    },
    heroLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 14,
    },
    heroDot: {
        width: 8,
        height: 8,
        borderRadius: 2,
        backgroundColor: Color.orange,
    },
    longestRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    longestSubLabel: {
        fontFamily: Font.barlowSemi,
        fontSize: 13,
        color: "#7e8cb6",
        marginBottom: 4,
    },
    longestTimeBlock: {
        alignItems: "flex-end",
    },
    longestValue: {
        fontFamily: Font.oswaldBold,
        fontSize: 46,
        color: Color.white,
        letterSpacing: 1,
    },
    longestRule: {
        height: 3,
        width: 46,
        backgroundColor: Color.orange,
        marginTop: 4,
    },
    backButton: {
        marginTop: "auto",
    },
});

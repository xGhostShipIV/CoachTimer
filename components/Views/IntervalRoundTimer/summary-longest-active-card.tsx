import { BTCStyles } from "@/styles/BTCIntervalTimer";
import { formatMinutesSeconds, WorkoutSummary } from "@/utils/time-utils";
import { Text, View } from "react-native";
import { SummaryCard } from "./summary-card";

function pad2(value: number) {
    return String(value).padStart(2, "0");
}

interface SummaryLongestActiveCardProps {
    summary: WorkoutSummary;
}

export function SummaryLongestActiveCard({ summary }: SummaryLongestActiveCardProps) {
    return (
        <SummaryCard>
            <View style={BTCStyles.summaryHeroLabelRow}>
                <View style={BTCStyles.summaryHeroDot} />
                <Text style={BTCStyles.summaryCardLabelOrange}>LONGEST ACTIVE PERIOD</Text>
            </View>
            <View style={BTCStyles.summaryLongestRow}>
                <View>
                    <Text style={BTCStyles.summaryLongestSubLabel}>{`ROUND ${pad2(summary.longestActiveRound)}`}</Text>
                    <Text style={BTCStyles.summaryLongestSubLabel}>{`INTERVAL ${summary.longestActiveInterval}`}</Text>
                </View>
                <View style={BTCStyles.summaryLongestTimeBlock}>
                    <Text style={BTCStyles.summaryLongestValue}>{formatMinutesSeconds(summary.longestActiveMs)}</Text>
                    <View style={BTCStyles.summaryLongestRule} />
                </View>
            </View>
        </SummaryCard>
    );
}

import { BTCStyles } from "@/styles/BTCIntervalTimer";
import { formatMinutesSeconds, WorkoutSummary } from "@/utils/time-utils";
import { Text, View } from "react-native";
import { SummaryCard } from "./summary-card";

interface SummaryTotalTimeCardProps {
    summary: WorkoutSummary;
}

export function SummaryTotalTimeCard({ summary }: SummaryTotalTimeCardProps) {
    return (
        <SummaryCard>
            <Text style={BTCStyles.summaryCardLabel}>TOTAL TIME WORKED OUT</Text>
            <Text style={BTCStyles.summaryHeroValue}>{formatMinutesSeconds(summary.totalTimeMs)}</Text>

            <View style={BTCStyles.summaryHr} />

            <View style={BTCStyles.summarySplitRow}>
                <View>
                    <Text style={BTCStyles.summaryCardLabel}>WORK</Text>
                    <Text style={BTCStyles.summarySplitValue}>{formatMinutesSeconds(summary.workTimeMs)}</Text>
                </View>
                <View style={BTCStyles.summarySplitDivider} />
                <View>
                    <Text style={BTCStyles.summaryCardLabel}>REST</Text>
                    <Text style={[BTCStyles.summarySplitValue, BTCStyles.summarySplitValueDim]}>{formatMinutesSeconds(summary.restTimeMs)}</Text>
                </View>
            </View>
        </SummaryCard>
    );
}

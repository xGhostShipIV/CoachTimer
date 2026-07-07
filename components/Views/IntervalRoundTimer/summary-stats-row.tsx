import { BTCStyles } from "@/styles/BTCIntervalTimer";
import { WorkoutSummary } from "@/utils/time-utils";
import { Text, View } from "react-native";
import { SummaryCard } from "./summary-card";

interface StatPairCardProps {
    label: string;
    value: number;
    suffix?: string;
}

function StatPairCard({ label, value, suffix }: StatPairCardProps) {
    return (
        <SummaryCard style={BTCStyles.summaryPairCard}>
            <Text style={BTCStyles.summaryCardLabel}>{label}</Text>
            <View style={BTCStyles.summaryPairValueRow}>
                <Text style={BTCStyles.summaryPairValue}>{value}</Text>
                {suffix && <Text style={BTCStyles.summaryPairValueDim}>{suffix}</Text>}
            </View>
        </SummaryCard>
    );
}

interface SummaryStatsRowProps {
    summary: WorkoutSummary;
}

export function SummaryStatsRow({ summary }: SummaryStatsRowProps) {
    return (
        <View style={BTCStyles.summaryPairRow}>
            <StatPairCard label="ROUNDS" value={summary.rounds} suffix={` / ${summary.rounds}`} />
            <StatPairCard label="INTERVALS" value={summary.intervalsCompleted} />
        </View>
    );
}

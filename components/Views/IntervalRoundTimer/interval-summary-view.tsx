import Concrete from "@/components/ui/ConcreteButton";
import { TimeConfiguration } from "@/data/data-types";
import { BTCStyles, Color } from "@/styles/BTCIntervalTimer";
import { calculateWorkoutSummary } from "@/utils/time-utils";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SummaryHeader } from "./summary-header";
import { SummaryLongestActiveCard } from "./summary-longest-active-card";
import { SummaryStatsRow } from "./summary-stats-row";
import { SummaryTotalTimeCard } from "./summary-total-time-card";

interface IntervalSummaryViewProps {
    configuration: TimeConfiguration;
    configName?: string;
    finishedAt: Date;
    onBackToSetup?: () => void;
}

export default function IntervalSummaryView({ configuration, configName, finishedAt, onBackToSetup }: IntervalSummaryViewProps) {
    const insets = useSafeAreaInsets();
    const summary = useMemo(() => calculateWorkoutSummary(configuration), [configuration]);

    return (
        <View style={BTCStyles.screenBody}>
            <SummaryHeader finishedAt={finishedAt} />

            <Text style={BTCStyles.workoutName}>{(configName ?? "New Workout").toUpperCase()}</Text>
            <View style={BTCStyles.nameRule} />

            <SummaryTotalTimeCard summary={summary} />
            <SummaryStatsRow summary={summary} />
            <SummaryLongestActiveCard summary={summary} />

            <View style={[BTCStyles.summaryBackButton, { marginBottom: Math.max(18, insets.bottom + 10) }]}>
                <Concrete ledge={Color.orangeLedge} onPress={() => onBackToSetup?.()}>
                    <View style={BTCStyles.start}>
                        <Text style={BTCStyles.startText}>{"‹ BACK TO SETUP"}</Text>
                    </View>
                </Concrete>
            </View>
        </View>
    );
}

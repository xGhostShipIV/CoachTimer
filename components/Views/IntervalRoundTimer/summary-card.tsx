import { BTCStyles } from "@/styles/BTCIntervalTimer";
import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

interface SummaryCardProps {
    style?: StyleProp<ViewStyle>;
    children: ReactNode;
}

// Shared box shape behind every stat block on the summary screen (total
// time, rounds/intervals pair, longest active period).
export function SummaryCard({ style, children }: SummaryCardProps) {
    return <View style={[BTCStyles.summaryCard, style]}>{children}</View>;
}

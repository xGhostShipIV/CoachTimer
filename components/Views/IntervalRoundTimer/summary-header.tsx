import { BTCStyles } from "@/styles/BTCIntervalTimer";
import { Text, View } from "react-native";

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

interface SummaryHeaderProps {
    finishedAt: Date;
}

export function SummaryHeader({ finishedAt }: SummaryHeaderProps) {
    return (
        <View style={BTCStyles.summaryBadgeRow}>
            <View style={BTCStyles.summaryCompleteBadge}>
                <Text style={BTCStyles.summaryCompleteBadgeGlyph}>{"✓"}</Text>
            </View>
            <Text style={BTCStyles.summaryCompleteLabel}>SESSION COMPLETE</Text>
            <Text style={BTCStyles.summaryStamp}>{formatSessionStamp(finishedAt)}</Text>
        </View>
    );
}

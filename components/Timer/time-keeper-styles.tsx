import { Color, Font } from "@/styles/BTCIntervalTimer";
import { StyleSheet } from "react-native";

// Default TimeText appearance, used only when a caller doesn't override
// `style` — every current screen supplies its own (see BTCStyles.hero).
export const styles = StyleSheet.create({
    timerText: {
        fontFamily: Font.mono,
        fontSize: 36,
        lineHeight: 48,
        textAlign: 'center',
        width: '100%',
        fontVariant: ['tabular-nums'],
        color: Color.white,
    },
});
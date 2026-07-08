import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";

// Advance width of the widest Oswald digit ('0': 0.550em in Bold, 0.543em in
// SemiBold), measured from the shipped TTFs. Oswald has no tabular-figures
// (tnum) feature — '1' is ~30% narrower than '0' — so fontVariant:
// ['tabular-nums'] is a no-op with it and slotting is the only way to keep
// ticking digits from reflowing.
const DIGIT_SLOT_EM = 0.55;

interface StableTimeTextProps {
    text: string;
    style?: StyleProp<TextStyle>;
}

// Drop-in replacement for a <Text> holding a ticking time string. Each digit
// renders centered in a fixed-width slot so the string's layout stays put as
// values change; separators (:) flow at natural width since they never
// change. letterSpacing/textAlign/width apply to the wrapping row instead of
// the per-character Texts.
export default function StableTimeText({ text, style }: StableTimeTextProps) {
    const { letterSpacing = 0, textAlign, width, ...charStyle } = StyleSheet.flatten(style) ?? {};
    const fontSize = charStyle.fontSize ?? 14;
    const justifyContent = textAlign === "center" ? "center" : textAlign === "right" ? "flex-end" : "flex-start";

    return (
        <View style={{ flexDirection: "row", justifyContent, columnGap: letterSpacing, width }}>
            {[...text].map((char, index) => (
                <Text
                    key={index}
                    style={[charStyle, char >= "0" && char <= "9" && { width: fontSize * DIGIT_SLOT_EM, textAlign: "center" }]}
                >
                    {char}
                </Text>
            ))}
        </View>
    );
}

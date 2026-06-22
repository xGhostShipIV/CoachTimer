import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";

interface BackButtonProps {
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
}

export function BackButton({ onPress, style }: BackButtonProps) {
    return (
        <Pressable style={[styles.button, style]} onPress={onPress} hitSlop={8}>
            <IconSymbol name="chevron.left" size={20} color="#FFFFFF" />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.35)",
    },
});

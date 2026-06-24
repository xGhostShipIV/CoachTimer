import { BTCStyles, Color, Font } from "@/styles/BTCIntervalTimer";
import { useState } from "react";
import { Modal, Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { WheelPicker } from "./wheel-picker";

function pad2(value: number) {
    return String(value).padStart(2, "0");
}

interface TimeWheelPickerProps {
    // Header shown above the two wheels in the modal, e.g. "TIME ON".
    label: string;
    valueMs: number;
    onChange: (ms: number) => void;
    maxMinutes?: number;
    triggerStyle?: StyleProp<ViewStyle>;
    triggerTextStyle?: StyleProp<TextStyle>;
    // Replaces the default Pressable+Text trigger entirely, mirroring
    // WheelPicker's renderTrigger escape hatch.
    renderTrigger?: (params: { displayValue: string; open: () => void }) => React.ReactNode;
}

const SECOND_OPTIONS = Array.from({ length: 60 }, (_, i) => i);

// A two-wheel mm:ss picker — same "closed trigger -> centered modal" shell as
// WheelPicker, but the modal holds two inline (hideOptionsWhenUnfocused=false)
// wheels side by side instead of one.
export function TimeWheelPicker({
    label,
    valueMs,
    onChange,
    maxMinutes = 59,
    triggerStyle,
    triggerTextStyle,
    renderTrigger,
}: TimeWheelPickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const totalSeconds = Math.max(0, Math.round(valueMs / 1000));
    const minutes = Math.min(maxMinutes, Math.floor(totalSeconds / 60));
    const seconds = totalSeconds % 60;
    const displayValue = `${pad2(minutes)}:${pad2(seconds)}`;

    const minuteOptions = Array.from({ length: maxMinutes + 1 }, (_, i) => i);

    const commit = (nextMinutes: number, nextSeconds: number) => {
        onChange((nextMinutes * 60 + nextSeconds) * 1000);
    };

    return (
        <>
            {renderTrigger ? (
                renderTrigger({ displayValue, open: () => setIsOpen(true) })
            ) : (
                <Pressable style={[styles.trigger, triggerStyle]} onPress={() => setIsOpen(true)}>
                    <Text style={[styles.triggerText, triggerTextStyle]}>{displayValue}</Text>
                </Pressable>
            )}

            {isOpen && (
                <Modal transparent visible animationType="fade" onRequestClose={() => setIsOpen(false)}>
                    <Pressable style={BTCStyles.scrim} onPress={() => setIsOpen(false)}>
                        <Pressable style={BTCStyles.pickerCard} onPress={(event) => event.stopPropagation()}>
                            <Text style={styles.header}>{label}</Text>
                            <View style={styles.headerRule} />

                            <View style={styles.wheelsRow}>
                                <View style={styles.wheelColumn}>
                                    <WheelPicker
                                        options={minuteOptions}
                                        value={minutes}
                                        onChange={(next) => commit(next, seconds)}
                                        hideOptionsWhenUnfocused={false}
                                        formatOption={pad2}
                                    />
                                </View>

                                <Text style={styles.colon}>:</Text>

                                <View style={styles.wheelColumn}>
                                    <WheelPicker
                                        options={SECOND_OPTIONS}
                                        value={seconds}
                                        onChange={(next) => commit(minutes, next)}
                                        hideOptionsWhenUnfocused={false}
                                        formatOption={pad2}
                                    />
                                </View>
                            </View>
                        </Pressable>
                    </Pressable>
                </Modal>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    trigger: {
        height: 40,
        width: 90,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
    },
    triggerText: {
        fontSize: 16,
        color: "#000000",
    },
    header: {
        fontFamily: Font.oswaldSemi,
        fontSize: 13,
        letterSpacing: 2,
        color: Color.orange,
        textAlign: "center",
    },
    headerRule: {
        height: 2,
        width: 40,
        backgroundColor: Color.orange,
        alignSelf: "center",
        marginTop: 6,
        marginBottom: 16,
    },
    wheelsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    wheelColumn: {
        width: 96,
    },
    colon: {
        fontFamily: Font.oswaldBold,
        fontSize: 26,
        color: Color.white,
    },
});

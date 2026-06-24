import { TimeWheelPicker } from "@/components/ui/time-wheel-picker";
import { WheelPicker } from "@/components/ui/wheel-picker";
import { BTCStyles } from "@/styles/BTCIntervalTimer";
import { Pressable, StyleSheet, Text, View } from "react-native";

const ROUNDS_OPTIONS = Array.from({ length: 30 }, (_, i) => i + 1);

interface LabeledValueFieldProps {
    label: string;
    displayValue: string;
    onPress: () => void;
}

// Tap target styled from BTCStyles.valueField: label on top, big value +
// tiny up/down arrows below — shared shape for the Rounds and Rest/Round
// fields, each backed by a different wheel picker.
function LabeledValueField({ label, displayValue, onPress }: LabeledValueFieldProps) {
    return (
        <Pressable style={[BTCStyles.valueField, styles.field]} onPress={onPress}>
            <Text style={BTCStyles.fieldLabel}>{label}</Text>
            <View style={styles.valueRow}>
                <Text style={BTCStyles.fieldValue}>{displayValue}</Text>
                <View style={styles.arrows}>
                    <Text style={BTCStyles.fieldArrow}>▲</Text>
                    <Text style={BTCStyles.fieldArrow}>▼</Text>
                </View>
            </View>
        </Pressable>
    );
}

interface RoundOptionsProps {
    numRounds: number;
    onRoundsChanged: (value: number) => void;
    // Milliseconds.
    roundRest: number;
    onRoundRestChanged: (valueMs: number) => void;
}

export default function RoundOptions({ numRounds, onRoundsChanged, roundRest, onRoundRestChanged }: RoundOptionsProps) {
    return (
        <View style={styles.row}>
            <WheelPicker
                options={ROUNDS_OPTIONS}
                value={numRounds}
                onChange={onRoundsChanged}
                renderTrigger={({ displayValue, open }) => (
                    <LabeledValueField label="ROUNDS" displayValue={displayValue} onPress={open} />
                )}
            />

            <TimeWheelPicker
                label="REST / ROUND"
                valueMs={roundRest}
                onChange={onRoundRestChanged}
                renderTrigger={({ displayValue, open }) => (
                    <LabeledValueField label="REST / ROUND" displayValue={displayValue} onPress={open} />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 14,
    },
    field: {
        flex: 1,
    },
    valueRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    arrows: {
        alignItems: "center",
    },
});

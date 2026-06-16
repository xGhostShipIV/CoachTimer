import { TextInput } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

interface RoundOptionsProps {
    numRounds: number;
    onRoundsChanged: (value: number) => void;
    roundRest: number;
    onRoundRestChanged: (value: number) => void;
}
export default function RoundOptions({ numRounds, onRoundsChanged, roundRest, onRoundRestChanged}: RoundOptionsProps) {
    return (
        <ThemedView style={{ width: '100%', flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <ThemedView style={{ flex: 1 }}>
                <ThemedText style={{ fontSize: 14, marginBottom: 6 }}>Rounds</ThemedText>
                <TextInput
                    style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, fontSize: 16 }}
                    value={String(numRounds)}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                        const v = parseInt(text, 10);
                        onRoundsChanged(Number.isNaN(v) ? 1 : Math.max(1, v));
                    }}
                />
            </ThemedView>

            <ThemedView style={{ flex: 1 }}>
                <ThemedText style={{ fontSize: 14, marginBottom: 6 }}>Round Rest (s)</ThemedText>
                <TextInput
                    style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, fontSize: 16 }}
                    value={String(roundRest)}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                        const v = parseInt(text, 10);
                        onRoundRestChanged(Number.isNaN(v) ? 0 : Math.max(0, v));
                    }}
                />
            </ThemedView>
        </ThemedView>
    )
}
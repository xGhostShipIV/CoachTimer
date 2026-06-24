import { TimeWheelPicker } from "@/components/ui/time-wheel-picker";
import { WheelPicker } from "@/components/ui/wheel-picker";
import { BTCStyles } from "@/styles/BTCIntervalTimer";
import { IntervalData, SoundOptions } from "@/data/data-types";
import { Pressable, StyleSheet, Text, View } from "react-native";
import SoundOptionsContainer from "../options/sound-options-container";

const REPEAT_OPTIONS = Array.from({ length: 20 }, (_, i) => i + 1);
const DEFAULT_INTERVAL_MS = 30000;

function MiniField({ label, displayValue, onPress }: { label: string; displayValue: string; onPress: () => void }) {
    return (
        <Pressable style={BTCStyles.miniField} onPress={onPress}>
            <Text style={BTCStyles.miniLabel}>{label}</Text>
            <Text style={BTCStyles.miniValue}>{displayValue}</Text>
        </Pressable>
    );
}

interface IntervalItemProps {
    index: number;
    data: IntervalData;
    onRemove: (index: number) => void;
    onUpdate: (index: number, updatedData: IntervalData) => void;
}

function IntervalItem({ index, data, onRemove, onUpdate }: IntervalItemProps) {
    const updateField = <K extends keyof IntervalData>(field: K, value: IntervalData[K]) => {
        onUpdate(index, { ...data, [field]: value });
    };

    return (
        <View style={BTCStyles.intervalCard}>
            <View style={BTCStyles.intervalCardHead}>
                <View style={BTCStyles.intervalBadge}>
                    <Text style={BTCStyles.intervalBadgeText}>{index + 1}</Text>
                </View>
                <Text style={BTCStyles.intervalCardTitle}>INTERVAL</Text>
                <Pressable style={BTCStyles.intervalClose} onPress={() => onRemove(index)} hitSlop={8}>
                    <Text style={BTCStyles.intervalCloseGlyph}>×</Text>
                </Pressable>
            </View>

            <View style={styles.fieldsRow}>
                <TimeWheelPicker
                    label="ON"
                    valueMs={data.on}
                    onChange={(ms) => updateField("on", ms)}
                    renderTrigger={({ displayValue, open }) => <MiniField label="ON" displayValue={displayValue} onPress={open} />}
                />

                <TimeWheelPicker
                    label="OFF"
                    valueMs={data.off}
                    onChange={(ms) => updateField("off", ms)}
                    renderTrigger={({ displayValue, open }) => <MiniField label="OFF" displayValue={displayValue} onPress={open} />}
                />

                <WheelPicker
                    options={REPEAT_OPTIONS}
                    value={data.repeats}
                    onChange={(repeats) => updateField("repeats", repeats)}
                    formatOption={(repeats) => `×${repeats}`}
                    renderTrigger={({ displayValue, open }) => <MiniField label="REPEAT" displayValue={displayValue} onPress={open} />}
                />
            </View>
        </View>
    );
}

interface IntervalContainerProps {
    data: IntervalData[];
    onChange?: (intervals: IntervalData[]) => void;
}

export default function IntervalContainer({ data, onChange }: IntervalContainerProps) {
    // Sound config is shared across every interval rather than set per-item,
    // so it's read from (and written to) all of them uniformly.
    const sharedSoundConfiguration = data[0]?.soundConfiguration ?? {};

    const handleAddInterval = () => {
        const nextIntervals = [
            ...data,
            { on: DEFAULT_INTERVAL_MS, off: DEFAULT_INTERVAL_MS, repeats: 1, soundConfiguration: sharedSoundConfiguration },
        ];
        onChange?.(nextIntervals);
    };

    const handleRemove = (index: number) => {
        const nextIntervals = data.filter((_, itemIndex) => itemIndex !== index);
        onChange?.(nextIntervals);
    };

    const handleUpdate = (index: number, updatedData: IntervalData) => {
        const nextIntervals = data.map((item, itemIndex) =>
            itemIndex === index ? updatedData : item
        );
        onChange?.(nextIntervals);
    };

    const handleSharedSoundConfigurationChange = (next: SoundOptions) => {
        const nextIntervals = data.map((item) => ({ ...item, soundConfiguration: next }));
        onChange?.(nextIntervals);
    };

    return (
        <View style={BTCStyles.intervalsBox}>
            <View style={BTCStyles.intervalsHead}>
                <Text style={BTCStyles.intervalsTitle}>INTERVALS</Text>
                <View style={BTCStyles.hr} />
                <Text style={BTCStyles.intervalsCount}>{data.length}</Text>
            </View>

            {data.map((interval, index) => (
                <IntervalItem
                    key={index}
                    index={index}
                    data={interval}
                    onRemove={handleRemove}
                    onUpdate={handleUpdate}
                />
            ))}

            <Pressable style={BTCStyles.addInterval} onPress={handleAddInterval}>
                <Text style={BTCStyles.addIntervalText}>+ ADD INTERVAL</Text>
            </Pressable>

            <SoundOptionsContainer
                title="Interval Sounds"
                options={sharedSoundConfiguration}
                onChange={handleSharedSoundConfigurationChange}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    fieldsRow: {
        flexDirection: "row",
        gap: 9,
    },
});

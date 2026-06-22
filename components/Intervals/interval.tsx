import { IntervalData, SoundOptions } from "@/data/data-types";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../Notifications/notification-styles";
import SoundOptionsContainer from "../options/sound-options-container";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

interface IntervalItemProps {
    index: number;
    data: IntervalData;
    onRemove: (index: number) => void;
    onUpdate: (index: number, updatedData: IntervalData) => void;
}

function IntervalItem({ index, data, onRemove, onUpdate }: IntervalItemProps) {
    const updateField = (field: keyof IntervalData, text: string) => {
        const parsed = parseInt(text, 10);
        const safe = Number.isNaN(parsed) ? 0 : parsed;

        // `on` and `off` are stored in milliseconds, but user edits in seconds.
        if (field === 'on' || field === 'off') {
            onUpdate(index, {
                ...data,
                [field]: safe * 1000,
            });
            return;
        }

        // repeats stays as a unitless number
        onUpdate(index, {
            ...data,
            [field]: safe,
        });
    };

    const updateSoundConfiguration = (next: SoundOptions) => {
        onUpdate(index, {
            ...data,
            soundConfiguration: next,
        });
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.row}>
                <ThemedView style={[styles.fieldGroup, styles.intervalGroup]}>
                    <ThemedText style={styles.label}>On</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={String(Math.round(data.on / 1000))}
                        keyboardType="numeric"
                        onChangeText={(text) => updateField("on", text)}
                        placeholder="30"
                    />
                </ThemedView>

                <ThemedView style={[styles.fieldGroup, styles.intervalGroup]}>
                    <ThemedText style={styles.label}>Off</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={String(Math.round(data.off / 1000))}
                        keyboardType="numeric"
                        onChangeText={(text) => updateField("off", text)}
                        placeholder="30"
                    />
                </ThemedView>

                <ThemedView style={[styles.fieldGroup, styles.intervalGroup]}>
                    <ThemedText style={styles.label}>Repeat</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={data.repeats.toString()}
                        keyboardType="numeric"
                        onChangeText={(text) => updateField("repeats", text)}
                        placeholder="1"
                    />
                </ThemedView>

                <TouchableOpacity
                    style={{
                        backgroundColor: "red",
                        borderRadius: 16,
                        width: 32,
                        height: 32,
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: 8,
                    }}
                    onPress={() => onRemove(index)}
                >
                    <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>×</Text>
                </TouchableOpacity>
            </ThemedView>

            <SoundOptionsContainer
                options={data.soundConfiguration ?? {}}
                onChange={updateSoundConfiguration}
            />
        </ThemedView>
    );
}

const DEFAULT_INTERVAL_SECONDS = '30';

interface IntervalContainerProps {
    data: IntervalData[];
    onChange?: (intervals: IntervalData[]) => void;
}

export default function IntervalContainer({ data, onChange }: IntervalContainerProps) {
    const handleAddInterval = () => {
        const defaultSeconds = parseInt(DEFAULT_INTERVAL_SECONDS, 10);
        const defaultMs = defaultSeconds * 1000;
        const nextIntervals = [...data, { on: defaultMs, off: defaultMs, repeats: 1 }];
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

    return (
        <View style={[styles.container, styles.emptyContainer]}>
            {data.map((interval, index) => (
                <IntervalItem
                    key={index}
                    index={index}
                    data={interval}
                    onRemove={handleRemove}
                    onUpdate={handleUpdate}
                />
            ))}

            <TouchableOpacity style={styles.promptButton} onPress={handleAddInterval}>
                <Text style={styles.promptButtonText}>Add an interval</Text>
            </TouchableOpacity>
        </View>
    );
}

import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../Notifications/notification-styles";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

export interface IntervalData {
    on: number;
    off: number;
    repeats: number;
}

interface IntervalItemProps {
    index: number;
    data: IntervalData;
    onRemove: (index: number) => void;
    onUpdate: (index: number, updatedData: IntervalData) => void;
}

function IntervalItem({ index, data, onRemove, onUpdate }: IntervalItemProps) {
    const updateField = (field: keyof IntervalData, text: string) => {
        const value = parseInt(text, 10);
        onUpdate(index, {
            ...data,
            [field]: Number.isNaN(value) ? 0 : value,
        });
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.row}>
                <ThemedView style={[styles.fieldGroup, styles.intervalGroup]}>
                    <ThemedText style={styles.label}>On</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={data.on.toString()}
                        keyboardType="numeric"
                        onChangeText={(text) => updateField("on", text)}
                        placeholder="30"
                    />
                </ThemedView>

                <ThemedView style={[styles.fieldGroup, styles.intervalGroup]}>
                    <ThemedText style={styles.label}>Off</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={data.off.toString()}
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
        const defaultValue = parseInt(DEFAULT_INTERVAL_SECONDS, 10);
        const nextIntervals = [...data, { on: defaultValue, off: defaultValue, repeats: 1 }];
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

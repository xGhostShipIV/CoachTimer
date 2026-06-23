import { deleteConfiguration, listSavedConfigurations, SavedConfiguration } from "@/utils/configuration-storage";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { Collapsible } from "./ui/collapsible";

interface SavedTimerListProps {
    onLoad: (entry: SavedConfiguration) => void;
    // Notified after a saved timer is deleted, so siblings reading the same
    // saved-configurations storage (e.g. SuggestedTimers) can refresh too.
    onDeleted?: () => void;
}

export default function SavedTimerList({ onLoad, onDeleted }: SavedTimerListProps) {
    const [saved, setSaved] = useState<SavedConfiguration[]>([]);

    const refresh = async () => {
        setSaved(await listSavedConfigurations());
    };

    useEffect(() => {
        refresh();
    }, []);

    const handleDelete = async (name: string) => {
        await deleteConfiguration(name);
        await refresh();
        onDeleted?.();
    };

    return (
        <Collapsible title="Load a Saved Timer">
            {saved.length === 0 ? (
                <ThemedText style={styles.emptyText}>No saved timers yet.</ThemedText>
            ) : (
                saved.map((entry) => (
                    <ThemedView key={entry.name} style={styles.row}>
                        <TouchableOpacity style={styles.nameButton} onPress={() => onLoad(entry)}>
                            <ThemedText style={styles.nameText}>{entry.name}</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(entry.name)}>
                            <Text style={styles.deleteButtonText}>×</Text>
                        </TouchableOpacity>
                    </ThemedView>
                ))
            )}
        </Collapsible>
    );
}

const styles = StyleSheet.create({
    emptyText: {
        fontSize: 14,
        opacity: 0.6,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    nameButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
    },
    nameText: {
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: "red",
        borderRadius: 16,
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },
    deleteButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});

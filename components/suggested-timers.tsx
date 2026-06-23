import { listSavedConfigurations, SavedConfiguration, seedSuggestionTestData } from "@/utils/configuration-storage";
import { suggestConfigurations } from "@/utils/timer-suggestions";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

interface SuggestedTimersProps {
    onSelect: (entry: SavedConfiguration) => void;
    // Bump this (e.g. from a sibling that just deleted a saved timer) to
    // force a re-fetch, since suggestions are computed from the same
    // saved-configurations storage but aren't otherwise notified of changes.
    refreshSignal?: number;
}

// Surfaces saved timers whose usage history clusters around the current time
// of day. Renders nothing when there's nothing worth suggesting (other than
// the dev-only seed button below), so it never takes up space on the home
// screen unless it has something useful to offer.
export default function SuggestedTimers({ onSelect, refreshSignal }: SuggestedTimersProps) {
    const [suggestions, setSuggestions] = useState<SavedConfiguration[]>([]);

    const refresh = async () => {
        const saved = await listSavedConfigurations();
        setSuggestions(suggestConfigurations(saved));
    };

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const saved = await listSavedConfigurations();
            if (!cancelled) {
                setSuggestions(suggestConfigurations(saved));
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [refreshSignal]);

    if (suggestions.length === 0 && !__DEV__) {
        return null;
    }

    return (
        <ThemedView style={styles.container}>
            {suggestions.length > 0 && (
                <>
                    <ThemedText style={styles.heading}>Suggested for Now</ThemedText>

                    {suggestions.map((entry) => (
                        <TouchableOpacity key={entry.name} style={styles.suggestion} onPress={() => onSelect(entry)}>
                            <ThemedText style={styles.suggestionText}>{entry.name}</ThemedText>
                        </TouchableOpacity>
                    ))}
                </>
            )}

            {__DEV__ && (
                <TouchableOpacity
                    style={styles.devSeedButton}
                    onPress={async () => {
                        await seedSuggestionTestData();
                        await refresh();
                    }}
                >
                    <ThemedText style={styles.devSeedButtonText}>Seed Test Data (dev)</ThemedText>
                </TouchableOpacity>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    heading: {
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 8,
        opacity: 0.8,
    },
    suggestion: {
        backgroundColor: "#0A84FF",
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    suggestionText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    devSeedButton: {
        backgroundColor: "#666666",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginTop: 4,
    },
    devSeedButtonText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center",
    },
});

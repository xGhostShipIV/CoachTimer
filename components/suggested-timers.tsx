import { Font } from "@/styles/BTCIntervalTimer";
import { landingStyles } from "@/styles/navyTheme";
import { listSavedConfigurations, SavedConfiguration, seedSuggestionTestData } from "@/utils/configuration-storage";
import { suggestConfigurations } from "@/utils/timer-suggestions";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface SuggestedTimersProps {
    onSelect: (entry: SavedConfiguration) => void;
    // Bump this (e.g. from a sibling that just deleted a saved timer) to
    // force a re-fetch, since suggestions are computed from the same
    // saved-configurations storage but aren't otherwise notified of changes.
    refreshSignal?: number;
    // Notified after the dev-only seed button writes test data, so siblings
    // reading the same saved-configurations storage (e.g. SavedTimerList)
    // can refresh too.
    onDataChanged?: () => void;
}

// Surfaces saved timers whose usage history clusters around the current time
// of day. Renders nothing when there's nothing worth suggesting (other than
// the dev-only seed button below), so it never takes up space on the home
// screen unless it has something useful to offer.
export default function SuggestedTimers({ onSelect, refreshSignal, onDataChanged }: SuggestedTimersProps) {
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
        <View style={landingStyles.recoBlock}>
            {suggestions.length > 0 && (
                <>
                    <Text style={landingStyles.recoKicker}>▸ RECOMMENDED</Text>

                    {suggestions.map((entry) => (
                        <Pressable key={entry.name} style={styles.card} onPress={() => onSelect(entry)}>
                            <View style={styles.cardTextBlock}>
                                <Text style={landingStyles.recoTitle}>{entry.name.toUpperCase()}</Text>
                                <Text style={landingStyles.recoMeta}>USED AROUND THIS TIME</Text>
                            </View>
                        </Pressable>
                    ))}
                </>
            )}

            {__DEV__ && (
                <Pressable
                    style={styles.devSeedButton}
                    onPress={async () => {
                        await seedSuggestionTestData();
                        await refresh();
                        onDataChanged?.();
                    }}
                >
                    <Text style={styles.devSeedButtonText}>Seed Test Data (dev)</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        ...landingStyles.recoCard,
        marginBottom: 8,
    },
    cardTextBlock: {
        flex: 1,
    },
    devSeedButton: {
        backgroundColor: "#15294f",
        borderWidth: 1,
        borderColor: "#3a4f80",
        borderRadius: 6,
        paddingVertical: 10,
        marginTop: 4,
    },
    devSeedButtonText: {
        fontFamily: Font.oswaldSemi,
        color: "#aeb9d6",
        fontSize: 13,
        letterSpacing: 1,
        textAlign: "center",
    },
});

import { WheelPicker } from "@/components/ui/wheel-picker";
import { Color, Font } from "@/styles/BTCIntervalTimer";
import { landingStyles } from "@/styles/navyTheme";
import { deleteConfiguration, listSavedConfigurations, SavedConfiguration } from "@/utils/configuration-storage";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface SavedTimerListProps {
    onLoad: (entry: SavedConfiguration) => void;
    // Notified after a saved timer is deleted, so siblings reading the same
    // saved-configurations storage (e.g. SuggestedTimers) can refresh too.
    onDeleted?: () => void;
    // Bump this (e.g. from a sibling that just seeded/changed saved
    // configurations) to force a re-fetch.
    refreshSignal?: number;
}

export default function SavedTimerList({ onLoad, onDeleted, refreshSignal }: SavedTimerListProps) {
    const [saved, setSaved] = useState<SavedConfiguration[]>([]);
    const [selectedName, setSelectedName] = useState<string | null>(null);

    const refresh = async () => {
        const list = await listSavedConfigurations();
        setSaved(list);
        setSelectedName((current) => (current && list.some((entry) => entry.name === current) ? current : list[0]?.name ?? null));
    };

    useEffect(() => {
        refresh();
    }, [refreshSignal]);

    const handleDelete = async (name: string) => {
        await deleteConfiguration(name);
        await refresh();
        onDeleted?.();
    };

    if (saved.length === 0 || selectedName === null) {
        return null;
    }

    return (
        <View style={landingStyles.presetBlock}>
            <Text style={landingStyles.presetLabel}>LOAD A PRESET</Text>

            <WheelPicker
                options={saved.map((entry) => entry.name)}
                value={selectedName}
                onChange={(name) => {
                    setSelectedName(name);
                    const entry = saved.find((candidate) => candidate.name === name);
                    if (entry) onLoad(entry);
                }}
                hideOptionsWhenUnfocused={false}
                onDeleteOption={handleDelete}
                formatOption={(name) => name.toUpperCase()}
                triggerStyle={styles.trigger}
                triggerTextStyle={styles.triggerText}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    trigger: {
        width: "100%",
        height: undefined,
        backgroundColor: "transparent",
        borderWidth: 0,
        borderRadius: 0,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: Color.orange,
        paddingVertical: 8,
    },
    triggerText: {
        fontFamily: Font.oswaldBold,
        fontSize: 22,
        letterSpacing: 1,
        color: Color.white,
    },
});

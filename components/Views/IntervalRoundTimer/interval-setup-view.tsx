import { BackButton, LoadTimerButton, SaveTimerButton } from "@/components/timer-action-buttons";
import { styles } from "@/components/Timer/time-keeper-styles";
import { DEFAULT_CONFIG } from "@/constants/data-constants";
import { TimeConfiguration } from "@/data/data-types";
import mainStyles from "@/styles/main-styles";
import { recordConfigurationUsage } from "@/utils/configuration-storage";
import { calculateTotalConfigurationTime, formatTimestamp } from "@/utils/time-utils";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import IntervalContainer from "../../Intervals/interval";
import RoundOptions from "../../Intervals/round-options";
import SoundOptionsContainer from "../../options/sound-options-container";
import { ThemedText } from "../../themed-text";
import { ThemedView } from "../../themed-view";

interface IntervalSetupProps {
    initialConfiguration?: TimeConfiguration;
    // Name of the saved config `initialConfiguration` came from, if any, so
    // starting the timer can credit that saved entry with a use.
    initialConfigName?: string;
    onStart?: (configuration: TimeConfiguration) => void;
    onConfigurationChange?: (configuration: TimeConfiguration) => void;
    onBack?: () => void;
}

export default function IntervalSetupView({ initialConfiguration, initialConfigName, onStart, onConfigurationChange, onBack }: IntervalSetupProps) {
    const [configuration, setConfiguration] = useState(initialConfiguration ?? DEFAULT_CONFIG);
    const [loadedConfigName, setLoadedConfigName] = useState(initialConfigName);

    useEffect(() => {
        setConfiguration(initialConfiguration ?? DEFAULT_CONFIG);
        setLoadedConfigName(initialConfigName);
    }, [initialConfiguration, initialConfigName]);

    return (
        <ThemedView style={mainStyles.container} >
            <ThemedView style={localStyles.headerRow}>
                {onBack ? <BackButton onPress={onBack} /> : <ThemedView />}
                <ThemedView style={localStyles.headerActions}>
                    <LoadTimerButton
                        onLoad={(entry) => {
                            setConfiguration(entry.configuration);
                            onConfigurationChange?.(entry.configuration);
                            setLoadedConfigName(entry.name);
                        }}
                    />
                    <SaveTimerButton configuration={configuration} />
                </ThemedView>
            </ThemedView>

            <ThemedView style={localStyles.formContent}>
                <RoundOptions
                    numRounds={configuration.numRounds}
                    onRoundsChanged={(value: number) => {
                        const next = { ...configuration, numRounds: value };
                        setConfiguration(next);
                        onConfigurationChange?.(next);
                    }}
                    roundRest={configuration.roundRest / 1000}
                    onRoundRestChanged={(value: number) => {
                        const next = { ...configuration, roundRest: value * 1000 };
                        setConfiguration(next);
                        onConfigurationChange?.(next);
                    }}
                />
                <SoundOptionsContainer
                    options={configuration.soundConfiguration ?? {}}
                    onChange={(next) => {
                        const nextConfig = { ...configuration, soundConfiguration: next };
                        setConfiguration(nextConfig);
                        onConfigurationChange?.(nextConfig);
                    }}
                />

                <IntervalContainer
                    data={configuration.intervals}
                    onChange={(next) => {
                        const nextConfig = { ...configuration, intervals: next };
                        setConfiguration(nextConfig);
                        onConfigurationChange?.(nextConfig);
                    }}
                />

                <ThemedText style={styles.timerText}>{
                    formatTimestamp(calculateTotalConfigurationTime(configuration), false)
                }</ThemedText>

                <ThemedView style={styles.buttonRow}>
                    <Pressable
                        style={[styles.button, styles.buttonClear]}
                        onPress={() => {
                            if (loadedConfigName) {
                                recordConfigurationUsage(loadedConfigName).catch(() => {});
                            }
                            onStart?.(configuration);
                        }}
                    >
                        <ThemedText style={styles.buttonText}>Start</ThemedText>
                    </Pressable>
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

const localStyles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    headerActions: {
        flexDirection: "row",
        gap: 8,
    },
    formContent: {
        flex: 1,
    },
});
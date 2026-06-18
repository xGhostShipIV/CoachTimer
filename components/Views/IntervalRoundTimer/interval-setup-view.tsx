import { styles } from "@/components/Timer/time-keeper-styles";
import { DEFAULT_CONFIG } from "@/constants/data-constants";
import { TimeConfiguration } from "@/data/data-types";
import mainStyles from "@/styles/main-styles";
import { formatTimestamp } from "@/utils/time-utils";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import IntervalContainer from "../../Intervals/interval";
import RoundOptions from "../../Intervals/round-options";
import SoundOptionsContainer from "../../options/sound-options-container";
import { ThemedText } from "../../themed-text";
import { ThemedView } from "../../themed-view";

function totalMilliseconds(configuration: TimeConfiguration): number {
    return configuration.intervals.reduce(
        (sum, item, idx) => {
            return (
                sum +
                item.on * item.repeats +
                item.off * (item.repeats - (idx === configuration.intervals.length - 1 ? 1 : 0))
            );
        },
        0
    ) * configuration.numRounds * 1000 +
        configuration.roundRest * (configuration.numRounds - 1);
};

interface IntervalSetupProps {
    initialConfiguration?: TimeConfiguration;
    onStart?: (configuration: TimeConfiguration) => void;
    onConfigurationChange?: (configuration: TimeConfiguration) => void;
}

export default function IntervalSetupView({ initialConfiguration, onStart, onConfigurationChange }: IntervalSetupProps) {
    const [configuration, setConfiguration] = useState(initialConfiguration ?? DEFAULT_CONFIG);

    useEffect(() => {
        setConfiguration(initialConfiguration ?? DEFAULT_CONFIG);
    }, [initialConfiguration]);

    return (
        <ThemedView style={mainStyles.container} >
            <RoundOptions
                numRounds={configuration.numRounds}
                onRoundsChanged={(value: number) => {
                    const next = { ...configuration, numRounds: value };
                    setConfiguration(next);
                    onConfigurationChange?.(next);
                }}
                roundRest={configuration.roundRest}
                onRoundRestChanged={(value: number) => {
                    const next = { ...configuration, roundRest: value };
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

            <ThemedText style={styles.timerText}>{formatTimestamp(totalMilliseconds(configuration), false)}</ThemedText>

            <ThemedView style={styles.buttonRow}>
                <Pressable style={[styles.button, styles.buttonClear]} onPress={() => onStart?.(configuration)}>
                    <ThemedText style={styles.buttonText}>Start</ThemedText>
                </Pressable>
            </ThemedView>
        </ThemedView>
    );
}
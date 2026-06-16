import { formatTimestamp } from "@/utils/time-utils";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import IntervalContainer, { IntervalData } from "../../Intervals/interval";
import RoundOptions from "../../Intervals/round-options";
import { ThemedText } from "../../themed-text";
import { ThemedView } from "../../themed-view";
import { styles } from "../../Timer/time-keeper-styles";

// Configuration struct for setting up a timer
// TODO: Move into own file
export interface TimeConfiguration {
    // How many times do we repeat our intervals?
    numRounds: number;
    // How long do we rest between rounds?
    roundRest: number;
    // Sounds.

    // This could probably go in its own file.
    soundConfiguration?: {
        // Which sound do we play on round start?
        roundStartSfx?: string;
        // Which sound do we play on round end?
        roundEndSfx?: string;
        // Which sound do we play on round warning?
        roundEndWarningSfx?: string;
        // How much time in round remaining before we play it?
        roundEndWarningMs?: number;
        // How much remaining rest time before we play it?
        restEndWarningMs?: number;
    }

    // Interval definitions
    intervals: IntervalData[];
}

export const DEFAULT_CONFIG: TimeConfiguration = {
    intervals: [
        {
            on: 60,
            off: 30,
            repeats: 1
        }
    ],
    numRounds: 3,
    roundRest: 30
};

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
        <ThemedView style={styles.container} >
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
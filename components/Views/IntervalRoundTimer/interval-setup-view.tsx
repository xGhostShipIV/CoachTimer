import { BackButton, LoadTimerButton, SaveTimerButton } from "@/components/timer-action-buttons";
import { DEFAULT_CONFIG } from "@/constants/data-constants";
import { TimeConfiguration } from "@/data/data-types";
import { BTCStyles, Color } from "@/styles/BTCIntervalTimer";
import { recordConfigurationUsage } from "@/utils/configuration-storage";
import { calculateTotalConfigurationTime, formatTimestamp } from "@/utils/time-utils";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import IntervalContainer from "../../Intervals/interval";
import RoundOptions from "../../Intervals/round-options";
import SoundOptionsContainer from "../../options/sound-options-container";

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

    const updateConfig = (partial: Partial<TimeConfiguration>) => {
        const next = { ...configuration, ...partial };
        setConfiguration(next);
        onConfigurationChange?.(next);
    };

    return (
        <View style={localStyles.screen}>
            <View style={BTCStyles.toolbar}>
                {onBack ? <BackButton onPress={onBack} style={BTCStyles.toolBack} /> : <View style={localStyles.backSpacer} />}

                <View style={localStyles.toolbarActions}>
                    <LoadTimerButton
                        onLoad={(entry) => {
                            setConfiguration(entry.configuration);
                            onConfigurationChange?.(entry.configuration);
                            setLoadedConfigName(entry.name);
                        }}
                        triggerStyle={BTCStyles.toolChip}
                        triggerTextStyle={BTCStyles.toolChipText}
                    />
                    <SaveTimerButton
                        configuration={configuration}
                        triggerStyle={BTCStyles.toolChip}
                        triggerTextStyle={BTCStyles.toolChipText}
                    />
                </View>
            </View>

            <View style={localStyles.body}>
                <Text style={BTCStyles.kicker}>INTERVAL TIMER · SETUP</Text>
                <Text style={BTCStyles.workoutName}>{(loadedConfigName ?? "New Workout").toUpperCase()}</Text>
                <View style={[BTCStyles.nameRule, localStyles.nameRuleSpacing]} />

                <View style={localStyles.section}>
                    <RoundOptions
                        numRounds={configuration.numRounds}
                        onRoundsChanged={(value) => updateConfig({ numRounds: value })}
                        roundRest={configuration.roundRest}
                        onRoundRestChanged={(valueMs) => updateConfig({ roundRest: valueMs })}
                    />
                </View>

                <View style={localStyles.section}>
                    <SoundOptionsContainer
                        options={configuration.soundConfiguration ?? {}}
                        onChange={(next) => updateConfig({ soundConfiguration: next })}
                    />
                </View>

                <View style={localStyles.section}>
                    <IntervalContainer
                        data={configuration.intervals}
                        onChange={(next) => updateConfig({ intervals: next })}
                    />
                </View>

                <View style={[BTCStyles.totalBox, localStyles.section]}>
                    <Text style={BTCStyles.totalLabel}>TOTAL{"\n"}TIME</Text>
                    <Text style={BTCStyles.totalValue}>{formatTimestamp(calculateTotalConfigurationTime(configuration), false)}</Text>
                </View>

                <Pressable
                    style={BTCStyles.start}
                    onPress={() => {
                        if (loadedConfigName) {
                            recordConfigurationUsage(loadedConfigName).catch(() => {});
                        }
                        onStart?.(configuration);
                    }}
                >
                    <Text style={BTCStyles.startText}>▸ START</Text>
                </Pressable>
            </View>
        </View>
    );
}

const localStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Color.navy,
    },
    backSpacer: {
        width: 42,
    },
    nameRuleSpacing: {
        marginBottom: 20,
    },
    toolbarActions: {
        flexDirection: "row",
        gap: 9,
        marginLeft: "auto",
    },
    body: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
    },
    section: {
        marginBottom: 16,
    },
});

import Concrete from "@/components/ui/ConcreteButton";
import { DEFAULT_CONFIG, DEFAULT_ROUND_SOUND_OPTIONS } from "@/constants/data-constants";
import { TimeConfiguration } from "@/data/data-types";
import { BTCStyles, Color } from "@/styles/BTCIntervalTimer";
import { recordConfigurationUsage } from "@/utils/configuration-storage";
import { calculateTotalConfigurationTime, formatTimestamp } from "@/utils/time-utils";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import IntervalContainer from "../../Intervals/interval";
import RoundOptions from "../../Intervals/round-options";
import SoundOptionsContainer from "../../options/sound-options-container";
import ToolbarHeaderView from "../ToolbarHeaderView";

interface IntervalSetupProps {
    initialConfiguration?: TimeConfiguration;
    // Name of the saved config `initialConfiguration` came from, if any, so
    // starting the timer can credit that saved entry with a use.
    initialConfigName?: string;
    onStart?: (configuration: TimeConfiguration, configName?: string) => void;
    onBack?: () => void;
}

export default function IntervalSetupView({ initialConfiguration, initialConfigName, onStart, onBack }: IntervalSetupProps) {
    const [configuration, setConfiguration] = useState(initialConfiguration ?? DEFAULT_CONFIG);
    const [loadedConfigName, setLoadedConfigName] = useState(initialConfigName);

    useEffect(() => {
        setConfiguration(initialConfiguration ?? DEFAULT_CONFIG);
        setLoadedConfigName(initialConfigName);
    }, [initialConfiguration, initialConfigName]);

    const updateConfig = (partial: Partial<TimeConfiguration>) => {
        const next = { ...configuration, ...partial };
        setConfiguration(next);
    };

    return (
        <>
            <ToolbarHeaderView
                onBack={onBack}
                onLoad={(entry) => {
                    setConfiguration(entry.configuration);
                    setLoadedConfigName(entry.name);
                }}
                onSave={(name) => setLoadedConfigName(name)}
                configuration={configuration}
                currentName={loadedConfigName}
            />

            <View style={[BTCStyles.screenBody, { paddingBottom: 24 }]}>
                <Text style={BTCStyles.kicker}>INTERVAL TIMER · SETUP</Text>
                <Text style={BTCStyles.workoutName}>{(loadedConfigName ?? "New Workout").toUpperCase()}</Text>
                <View style={BTCStyles.nameRule} />
                
                <View style={{ marginBottom: 0 }}>
                    <RoundOptions
                        numRounds={configuration.numRounds}
                        onRoundsChanged={(value) => updateConfig({ numRounds: value })}
                        roundRest={configuration.roundRest}
                        onRoundRestChanged={(valueMs) => updateConfig({ roundRest: valueMs })}
                    />
                </View>
                
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
                    <View style={localStyles.section}>
                        <SoundOptionsContainer
                            options={configuration.soundConfiguration ?? DEFAULT_ROUND_SOUND_OPTIONS}
                            onChange={(next) => updateConfig({ soundConfiguration: next })}
                        />
                    </View>

                    <View style={localStyles.section}>
                        <IntervalContainer
                            data={configuration.intervals}
                            onChange={(next) => updateConfig({ intervals: next })}
                        />
                    </View>
                </ScrollView>

                <View style={localStyles.footer}>
                    <View style={[BTCStyles.totalBox, localStyles.footerTotal]}>
                        <Text style={BTCStyles.totalLabel}>TOTAL TIME</Text>
                        <Text style={[BTCStyles.totalValue, localStyles.footerTotalValue]}>{formatTimestamp(calculateTotalConfigurationTime(configuration), false)}</Text>
                    </View>
                    <View style={localStyles.footerStart}>
                        <Concrete
                            ledge={Color.orangeLedge}
                            onPress={() => {
                                if (loadedConfigName) {
                                    recordConfigurationUsage(loadedConfigName).catch(() => { });
                                }
                                onStart?.(configuration, loadedConfigName);
                            }}
                        >
                            <View style={BTCStyles.start}>
                                <Text style={BTCStyles.startText}>▸ START</Text>
                            </View>
                        </Concrete>
                    </View>
                </View>
            </View>
        </>
    );
}

const localStyles = StyleSheet.create({
    section: {
        marginBottom: 16,
    },
    footer: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        marginTop: 8,
    },
    // Compact variant of totalBox: stacks label over value and matches the
    // START face height so the pair reads as one footer row.
    footerTotal: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        height: 62,
        paddingVertical: 0,
    },
    footerTotalValue: {
        fontSize: 26,
    },
    footerStart: {
        flex: 1,
    },
});

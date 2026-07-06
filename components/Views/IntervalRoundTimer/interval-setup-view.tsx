import Concrete from "@/components/ui/ConcreteButton";
import { DEFAULT_CONFIG } from "@/constants/data-constants";
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
                </ScrollView>
            </View>
        </>
    );
}

const localStyles = StyleSheet.create({
    section: {
        marginBottom: 16,
    },
});

import { TimeConfiguration } from "@/data/data-types";
import { Color } from "@/styles/BTCIntervalTimer";
import { SavedConfiguration } from "@/utils/configuration-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import IntervalActiveTimer from "./interval-active-view";
import IntervalSetupView from "./interval-setup-view";

interface IntervalViewProps {
    onBack?: () => void;
    initialEntryState?: SavedConfiguration;
    onActiveChange?: (isActive: boolean) => void;
}

export default function IntervalView({ onBack, initialEntryState, onActiveChange }: IntervalViewProps) {
    const [activeConfiguration, setActiveConfiguration] = useState<TimeConfiguration | null>(null);
    const [activeConfigName, setActiveConfigName] = useState<string | undefined>(undefined);

    const [setupConfiguration, setSetupConfiguration] = useState(initialEntryState?.configuration);
    const [setupConfigName, setSetupConfigName] = useState(initialEntryState?.name);

    useEffect(() => {
        onActiveChange?.(!!activeConfiguration);
    }, [activeConfiguration, onActiveChange]);

    return (
        <View style={styles.screen}>
            {activeConfiguration ?
                <IntervalActiveTimer
                    data={activeConfiguration}
                    onFinish={() => setActiveConfiguration(null)}
                    onStop={() => {
                        setSetupConfiguration(activeConfiguration);
                        setSetupConfigName(activeConfigName);
                        setActiveConfiguration(null);
                    }}
                /> :
                <IntervalSetupView
                    initialConfiguration={setupConfiguration}
                    initialConfigName={setupConfigName}
                    onStart={(cfg, name) => {
                        setActiveConfiguration(cfg);
                        setActiveConfigName(name);
                    }}
                    onBack={onBack}
                />}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Color.navy,
    },
});

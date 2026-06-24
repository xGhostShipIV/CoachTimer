import { DEFAULT_CONFIG } from "@/constants/data-constants";
import { TimeConfiguration } from "@/data/data-types";
import { Color } from "@/styles/BTCIntervalTimer";
import { SavedConfiguration } from "@/utils/configuration-storage";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import IntervalActiveTimer from "./interval-active-view";
import IntervalSetupView from "./interval-setup-view";

interface IntervalViewProps {
    onBack?: () => void;
    // A saved config selected on the home screen, used to seed the setup
    // form instead of starting from DEFAULT_CONFIG.
    initialEntry?: SavedConfiguration;
}

export default function IntervalView({ onBack, initialEntry }: IntervalViewProps) {
    const [configuration, setConfiguration] = useState<TimeConfiguration>(initialEntry?.configuration ?? DEFAULT_CONFIG);
    const [activeConfiguration, setActiveConfiguration] = useState<TimeConfiguration | null>(null);

    return (
        <View style={styles.screen}>
            {activeConfiguration ? (
                <IntervalActiveTimer
                    data={activeConfiguration}
                    onFinish={() => setActiveConfiguration(null)}
                    onStop={() => setActiveConfiguration(null)}
                />
            ) : (
                <IntervalSetupView
                    initialConfiguration={configuration}
                    initialConfigName={initialEntry?.name}
                    onConfigurationChange={setConfiguration}
                    onStart={(cfg) => setActiveConfiguration(cfg)}
                    onBack={onBack}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Color.navy,
    },
});

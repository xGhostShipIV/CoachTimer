import { TimeConfiguration } from "@/data/data-types";
import { Color } from "@/styles/BTCIntervalTimer";
import { SavedConfiguration } from "@/utils/configuration-storage";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import IntervalActiveTimer from "./interval-active-view";
import IntervalSetupView from "./interval-setup-view";
import IntervalSummaryView from "./interval-summary-view";

interface IntervalViewProps {
    onBack?: () => void;
    initialEntryState?: SavedConfiguration;
    onActiveChange?: (isActive: boolean) => void;
}

interface FinishedSession {
    configuration: TimeConfiguration;
    configName?: string;
    finishedAt: Date;
}

// Hold on the timer's final frame for a beat before cutting to the summary
// screen, so the completed state doesn't disappear the instant it appears.
const SUMMARY_TRANSITION_DELAY_MS = 3000;

export default function IntervalView({ onBack, initialEntryState, onActiveChange }: IntervalViewProps) {
    const [activeConfiguration, setActiveConfiguration] = useState<TimeConfiguration | null>(null);
    const [activeConfigName, setActiveConfigName] = useState<string | undefined>(undefined);
    const [finishedSession, setFinishedSession] = useState<FinishedSession | null>(null);

    const [setupConfiguration, setSetupConfiguration] = useState(initialEntryState?.configuration);
    const [setupConfigName, setSetupConfigName] = useState(initialEntryState?.name);

    const summaryTransitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        onActiveChange?.(!!activeConfiguration);
    }, [activeConfiguration, onActiveChange]);

    useEffect(() => {
        return () => {
            if (summaryTransitionRef.current) clearTimeout(summaryTransitionRef.current);
        };
    }, []);

    let content;
    if (activeConfiguration) {
        content = (
            <IntervalActiveTimer
                data={activeConfiguration}
                onFinish={() => {
                    summaryTransitionRef.current = setTimeout(() => {
                        setFinishedSession({
                            configuration: activeConfiguration,
                            configName: activeConfigName,
                            finishedAt: new Date(),
                        });
                        setActiveConfiguration(null);
                    }, SUMMARY_TRANSITION_DELAY_MS);
                }}
                onStop={() => {
                    if (summaryTransitionRef.current) clearTimeout(summaryTransitionRef.current);
                    setSetupConfiguration(activeConfiguration);
                    setSetupConfigName(activeConfigName);
                    setActiveConfiguration(null);
                }}
            />
        );
    } else if (finishedSession) {
        content = (
            <IntervalSummaryView
                configuration={finishedSession.configuration}
                configName={finishedSession.configName}
                finishedAt={finishedSession.finishedAt}
                onBackToSetup={() => {
                    setSetupConfiguration(finishedSession.configuration);
                    setSetupConfigName(finishedSession.configName);
                    setFinishedSession(null);
                }}
            />
        );
    } else {
        content = (
            <IntervalSetupView
                initialConfiguration={setupConfiguration}
                initialConfigName={setupConfigName}
                onStart={(cfg, name) => {
                    setActiveConfiguration(cfg);
                    setActiveConfigName(name);
                }}
                onBack={onBack}
            />
        );
    }

    return <View style={styles.screen}>{content}</View>;
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Color.navy,
    },
});

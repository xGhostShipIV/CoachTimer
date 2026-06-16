import React, { useState } from "react";
import { ThemedView } from "../../themed-view";
import IntervalActiveTimer from "./interval-active-view";
import IntervalSetupView, { DEFAULT_CONFIG, TimeConfiguration } from "./interval-setup-view";

export default function IntervalView() {
    const [configuration, setConfiguration] = useState<TimeConfiguration>(DEFAULT_CONFIG);
    const [activeConfiguration, setActiveConfiguration] = useState<TimeConfiguration | null>(null);

    return (
        <ThemedView>
            {activeConfiguration ? (
                <IntervalActiveTimer
                    data={activeConfiguration}
                    onFinish={() => setActiveConfiguration(null)}
                    onStop={() => setActiveConfiguration(null)}
                />
            ) : (
                <IntervalSetupView
                    initialConfiguration={configuration}
                    onConfigurationChange={setConfiguration}
                    onStart={(cfg) => setActiveConfiguration(cfg)}
                />
            )}
        </ThemedView>
    );
}

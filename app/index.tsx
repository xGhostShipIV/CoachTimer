import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import IntervalView from '@/components/Views/IntervalRoundTimer/interval-view';
import LandingScreen from '@/components/Views/LandingScreen/LandingScreenView';
import { StopwatchView } from '@/components/Views/StopWatchView';
import { Color } from '@/styles/BTCIntervalTimer';
import { SavedConfiguration } from '@/utils/configuration-storage';

export type ActiveView = 'interval' | 'stopwatch';

export default function HomeScreen() {
    const insets = useSafeAreaInsets();

    const [activeView, setActiveView] = useState<ActiveView | undefined>(undefined);
    const [loadedPreset, setLoadedPreset] = useState<SavedConfiguration | undefined>(undefined);

    let content = <LandingScreen
        setActiveView={setActiveView}
        loadedPreset={loadedPreset}
        setLoadedPreset={setLoadedPreset}
    />;

    if (activeView == 'interval') {
        content = <IntervalView
            onBack={() => setActiveView(undefined)}
            initialEntryState={loadedPreset}
        />;
    } else if (activeView == 'stopwatch') {
        content = <StopwatchView 
            onBack={() => setActiveView(undefined)}
        />
    }

    return (
        <View style={{ ...styles.fullScreen, paddingTop: insets.top }}>
            {/* Content */}
            <View style={{ flexGrow: 1, backgroundColor: Color.navy }}>
                {content}
            </View>

            {/* Footer */}
            <View style={{ height: 0, backgroundColor: Color.orange }}>
                {
                    /* 
                       Here goes our ad controller 
                       must be able to affect height of parent container.
                       State driven?
                    */
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: Color.navy,
    },
    scrollContent: {
        flexGrow: 1,
    },
});

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeBannerAd from '@/components/ads/home-banner-ad';
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
    const [isTimerActive, setIsTimerActive] = useState(false);

    let content = <LandingScreen
        setActiveView={setActiveView}
        loadedPreset={loadedPreset}
        setLoadedPreset={setLoadedPreset}
    />;

    if (activeView === 'interval') {
        content = <IntervalView
            onBack={() => setActiveView(undefined)}
            initialEntryState={loadedPreset}
            onActiveChange={setIsTimerActive}
        />;
    } else if (activeView === 'stopwatch') {
        content = <StopwatchView onBack={() => setActiveView(undefined)} />;
    }

    const showAd = activeView !== 'interval' || !isTimerActive;

    return (
        <View style={[styles.screen, { paddingTop: insets.top }]}>
            <View style={styles.content}>{content}</View>
            {showAd && <HomeBannerAd />}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Color.navy,
    },
    content: {
        flexGrow: 1,
        backgroundColor: Color.navy,
    },
});

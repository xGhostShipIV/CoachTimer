import { useState } from 'react';
import { LayoutAnimation, StyleSheet, View } from 'react-native';
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

    const handleTimerActiveChange = (active: boolean) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsTimerActive(active);
    };

    let content = <LandingScreen
        setActiveView={setActiveView}
        loadedPreset={loadedPreset}
        setLoadedPreset={setLoadedPreset}
    />;

    if (activeView == 'interval') {
        content = <IntervalView
            onBack={() => setActiveView(undefined)}
            initialEntryState={loadedPreset}
            onActiveChange={handleTimerActiveChange}
        />;
    } else if (activeView == 'stopwatch') {
        content = <StopwatchView
            onBack={() => setActiveView(undefined)}
        />
    }

    const showAd = activeView !== 'interval' || !isTimerActive;

    return (
        <View style={{ ...styles.fullScreen, paddingTop: insets.top }}>
            {/* Content */}
            <View style={{ flexGrow: 1, backgroundColor: Color.navy }}>
                {content}
            </View>

            {/* Footer */}
            <View style={{ height: 'auto', overflow: 'hidden' }}>
                {showAd && <HomeBannerAd />}
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

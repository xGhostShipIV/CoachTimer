import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ScreenFrame } from '@/components/screen-frame';
import SavedTimerList from '@/components/saved-timer-list';
import SuggestedTimers from '@/components/suggested-timers';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import IntervalView from '@/components/Views/IntervalRoundTimer/interval-view';
import { StopwatchView } from '@/components/Views/StopWatchView';
import mainStyles, { MAIN_COLORS } from '@/styles/main-styles';
import { SavedConfiguration } from '@/utils/configuration-storage';

type ActiveView = 'interval' | 'stopwatch';

export default function HomeScreen() {
  const [activeView, setActiveView] = useState<ActiveView | null>(null);
  const [pendingEntry, setPendingEntry] = useState<SavedConfiguration | undefined>(undefined);
  const [savedListVersion, setSavedListVersion] = useState(0);

  if (activeView === 'interval') {
    return (
      <ScreenFrame>
        <IntervalView onBack={() => setActiveView(null)} initialEntry={pendingEntry} />
      </ScreenFrame>
    );
  }

  if (activeView === 'stopwatch') {
    return (
      <ScreenFrame>
        <StopwatchView onBack={() => setActiveView(null)} />
      </ScreenFrame>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: MAIN_COLORS.primaryOrange, dark: MAIN_COLORS.primaryBlue }}
      headerImage={
        <Image
          source={require('@/assets/images/btc-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={mainStyles.container}>
        <ThemedView style={mainStyles.card}>
          <ThemedText type="title" style={styles.landingTitle}>
            Choose a Timer
          </ThemedText>

          <SuggestedTimers
            onSelect={(entry) => {
              setPendingEntry(entry);
              setActiveView('interval');
            }}
            refreshSignal={savedListVersion}
          />

          <Pressable
            style={[mainStyles.buttonPrimary, styles.landingButton]}
            onPress={() => {
              setPendingEntry(undefined);
              setActiveView('interval');
            }}>
            <ThemedText style={mainStyles.buttonPrimaryText}>Interval Timer</ThemedText>
          </Pressable>

          <Pressable
            style={[mainStyles.buttonPrimary, styles.landingButton]}
            onPress={() => setActiveView('stopwatch')}>
            <ThemedText style={mainStyles.buttonPrimaryText}>Stopwatch</ThemedText>
          </Pressable>

          <SavedTimerList
            onLoad={(entry) => {
              setPendingEntry(entry);
              setActiveView('interval');
            }}
            onDeleted={() => setSavedListVersion((version) => version + 1)}
          />
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 290,
    height: 178,
    backgroundColor: 'transparent',
    transform: [{ translateX: -145 }],
  },
  landingTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  landingButton: {
    width: '100%',
    paddingVertical: 18,
    marginBottom: 16,
    alignItems: 'center',
  },
});

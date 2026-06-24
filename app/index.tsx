import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenFrame } from '@/components/screen-frame';
import SavedTimerList from '@/components/saved-timer-list';
import SuggestedTimers from '@/components/suggested-timers';
import Concrete from '@/components/ui/ConcreteButton';

import IntervalView from '@/components/Views/IntervalRoundTimer/interval-view';
import { StopwatchView } from '@/components/Views/StopWatchView';
import { Color } from '@/styles/BTCIntervalTimer';
import { landingStyles } from '@/styles/navyTheme';
import { SavedConfiguration } from '@/utils/configuration-storage';

type ActiveView = 'interval' | 'stopwatch';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
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
    <View style={styles.fullScreen}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
        ]}
      >
        <View style={landingStyles.logoWrap}>
          <Image source={require('@/assets/images/btc-logo.png')} style={landingStyles.logo} />
        </View>

        <SuggestedTimers
          onSelect={(entry) => {
            setPendingEntry(entry);
            setActiveView('interval');
          }}
          refreshSignal={savedListVersion}
          onDataChanged={() => setSavedListVersion((version) => version + 1)}
        />

        <View style={landingStyles.ctaGroup}>
          <Concrete
            ledge={Color.orangeLedge}
            onPress={() => {
              setPendingEntry(undefined);
              setActiveView('interval');
            }}
          >
            <View style={landingStyles.ctaPrimary}>
              <Text style={landingStyles.ctaPrimaryText}>▸ INTERVAL TIMER</Text>
            </View>
          </Concrete>

          <Pressable style={landingStyles.ctaSecondary} onPress={() => setActiveView('stopwatch')}>
            <Text style={landingStyles.ctaSecondaryText}>⏱ STOPWATCH</Text>
          </Pressable>
        </View>

        <SavedTimerList
          onLoad={(entry) => {
            setPendingEntry(entry);
            setActiveView('interval');
          }}
          onDeleted={() => setSavedListVersion((version) => version + 1)}
          refreshSignal={savedListVersion}
        />

        <View style={landingStyles.footer}>
          <Text style={landingStyles.footerUrl}>burlingtontrainingcentre.com</Text>
        </View>
      </ScrollView>
    </View>
  );
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

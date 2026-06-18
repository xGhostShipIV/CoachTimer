import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedView } from '@/components/themed-view';

import IntervalView from '@/components/Views/IntervalRoundTimer/interval-view';
import mainStyles, { MAIN_COLORS } from '@/styles/main-styles';

export default function HomeScreen() {
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
          <IntervalView />
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 290,
    height: 178,
    backgroundColor: 'transparent',
    transform: [{ translateX: -145 }],
  },
});

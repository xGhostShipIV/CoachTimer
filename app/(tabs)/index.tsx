import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { TimeKeeper } from '@/components/Timer/time-keeper';
import { useEffect, useReducer, useRef } from 'react';

export function useAnimationFrame() {
  // A simple force-update reducer that increments a counter to trigger a re-render
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const loop = () => {
      forceUpdate(); // Force React to queue a frame render
      requestRef.current = requestAnimationFrame(loop);
    };

    // Start the animation loop
    requestRef.current = requestAnimationFrame(loop);

    // Clean up the loop immediately when the component unmounts
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []); // Empty dependency array ensures the loop sets up exactly once
}

let startTime = 0;
export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <TimeKeeper />
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
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

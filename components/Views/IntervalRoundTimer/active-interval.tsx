import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface IntervalData {
  on: number;
  off: number;
}

interface ActiveIntervalProps {
  on: number;
  off: number;
}

const ActiveInterval: React.FC<ActiveIntervalProps> = ({ on, off }) => {
  return (
    <View style={styles.container}>
      <View style={styles.onSection}>
        <Text style={styles.onText}>{Math.ceil(on / 1000)}s</Text>
      </View>
      <View style={styles.offSection}>
        <Text style={styles.offText}>{Math.ceil(off / 1000)}s</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 180,
    height: 56,
    borderRadius: 14,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  onSection: {
    flex: 2,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offSection: {
    flex: 1,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  offText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ActiveInterval;

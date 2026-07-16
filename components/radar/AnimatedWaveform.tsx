import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { Colors } from '../../constants/theme';

const BAR_COUNT = 24;

function WaveBar({ index, active, color }: { index: number; active: boolean; color: string }) {
  const h = useSharedValue(3);

  useEffect(() => {
    if (active) {
      // Active: full-height animated bars (handled below)
      // Sine-wave based heights for natural look — deterministic, no randomness
      const phase = (index / BAR_COUNT) * Math.PI * 4;
      const peakA = 6 + Math.abs(Math.sin(phase)) * 20;
      const peakB = 4 + Math.abs(Math.sin(phase + 1.1)) * 16;
      const durationA = 160 + (index % 5) * 55;
      const durationB = 140 + (index % 7) * 45;
      const delay = (index % 8) * 30;

      h.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(peakA, { duration: durationA }),
            withTiming(peakB, { duration: durationB }),
            withTiming(3 + Math.abs(Math.sin(phase + 2)) * 8, { duration: durationA }),
          ),
          -1,
          true
        )
      );
    } else {
      // Standby: gentle low-amplitude idle pulse so it never looks dead
      const idlePhase = (index / BAR_COUNT) * Math.PI * 2;
      const idlePeak = 3 + Math.abs(Math.sin(idlePhase)) * 4;
      h.value = withRepeat(
        withSequence(
          withTiming(idlePeak, { duration: 800 + (index % 4) * 120 }),
          withTiming(2, { duration: 800 + (index % 4) * 120 }),
        ),
        -1, true
      );
    }
  }, [active, index]);

  const style = useAnimatedStyle(() => ({ height: h.value }));

  return <Animated.View style={[styles.bar, style, { backgroundColor: color }]} />;
}

type Props = {
  active: boolean;
  color?: string;
  barCount?: number;
  height?: number;
};

export default function AnimatedWaveform({ active, color = Colors.green, height = 32 }: Props) {
  return (
    <View style={[styles.container, { height }]}>
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <WaveBar key={i} index={i} active={active} color={color} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    overflow: 'hidden',
  },
  bar: {
    flex: 1,
    borderRadius: 1.5,
    opacity: 0.85,
  },
});

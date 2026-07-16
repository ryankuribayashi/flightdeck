import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Font } from '../../constants/theme';

const STEPS = [
  'INITIALIZING AVIONICS...',
  'LOADING APPROACH CHARTS...',
  'SYNCING SQUAWK CODES...',
  'ESTABLISHING ATC LINK...',
  'SYSTEMS NOMINAL ✓',
];

type Props = { onComplete: () => void };

export default function SplashAnimation({ onComplete }: Props) {
  const logoScale = useSharedValue(0.7);
  const logoOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const lineWidth = useSharedValue(0);
  const containerOpacity = useSharedValue(1);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Logo entrance
    logoOpacity.value = withTiming(1, { duration: 600 });
    logoScale.value = withTiming(1, { duration: 600 });
    glowOpacity.value = withDelay(400, withRepeat(
      withSequence(withTiming(0.6, { duration: 900 }), withTiming(0.2, { duration: 900 })),
      -1, true
    ));
    lineWidth.value = withDelay(500, withTiming(1, { duration: 800 }));

    // Step through loading messages
    STEPS.forEach((_, i) => {
      setTimeout(() => setStepIndex(i), 600 + i * 360);
    });

    // Fade out and complete
    setTimeout(() => {
      containerOpacity.value = withTiming(0, { duration: 500 }, (finished) => {
        if (finished) runOnJS(onComplete)();
      });
    }, 600 + STEPS.length * 360 + 400);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: lineWidth.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <LinearGradient colors={[Colors.bg, '#0C1020', Colors.bg]} style={StyleSheet.absoluteFill} />

      {/* Amber glow halo */}
      <Animated.View style={[styles.glow, glowStyle]} />

      {/* Logo block */}
      <Animated.View style={[styles.logoBlock, logoStyle]}>
        <MaterialCommunityIcons name="airplane" size={52} color={Colors.amber} />
        <Text style={styles.logoText}>FLIGHTDECK</Text>
        <Animated.View style={[styles.logoLine, lineStyle]} />
        <Text style={styles.logoSub}>AVIATION SOCIAL PLATFORM</Text>
      </Animated.View>

      {/* Loading steps */}
      <View style={styles.stepsBlock}>
        {STEPS.map((step, i) => (
          <Text
            key={step}
            style={[
              styles.stepText,
              i === stepIndex && styles.stepActive,
              i < stepIndex && styles.stepDone,
            ]}
          >
            {i < stepIndex ? '✓ ' : i === stepIndex ? '› ' : '  '}{step}
          </Text>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg,
    zIndex: 999,
  },
  glow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.amber,
    opacity: 0.08,
  },
  logoBlock: {
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    fontFamily: Font.mono,
    fontSize: 32,
    color: Colors.amber,
    letterSpacing: 6,
    fontWeight: '700',
  },
  logoLine: {
    width: 200,
    height: 1,
    backgroundColor: Colors.amber,
    opacity: 0.5,
    transformOrigin: 'left',
  } as any,
  logoSub: {
    fontFamily: Font.mono,
    fontSize: 9,
    color: Colors.textMuted,
    letterSpacing: 3,
  },
  stepsBlock: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 5,
  },
  stepText: {
    fontFamily: Font.mono,
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  stepActive: {
    color: Colors.amber,
  },
  stepDone: {
    color: Colors.textMuted,
    opacity: 0.5,
  },
});

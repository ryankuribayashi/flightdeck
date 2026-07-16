import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Font } from '../../constants/theme';

type Props = {
  flightCount: number;
  onPress: () => void;
};

export default function FloatingWidget({ flightCount, onPress }: Props) {
  const pulse = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200 }),
        withTiming(0, { duration: 1200 })
      ),
      -1,
      false
    );
  }, []);

  const pulseRingStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.6, 0]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.7]) }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.9, { duration: 80 }),
      withSpring(1, { damping: 12 })
    );
    onPress();
  };

  const formatted =
    flightCount >= 1000
      ? `${(flightCount / 1000).toFixed(1)}K`
      : `${flightCount}`;

  return (
    <View style={styles.container}>
      {/* Pulse ring */}
      <Animated.View style={[styles.pulseRing, pulseRingStyle]} />

      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <Animated.View style={buttonStyle}>
          <LinearGradient
            colors={['#1E2838', '#0E1520']}
            style={styles.button}
          >
            <MaterialCommunityIcons name="airplane" size={18} color={Colors.amber} />
            <Text style={styles.count}>{formatted}</Text>
            <Text style={styles.label}>LIVE</Text>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: Colors.amber,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.borderAmber,
    shadowColor: Colors.amber,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    shadowOpacity: 0.5,
    elevation: 8,
    gap: 0,
  },
  count: {
    fontFamily: Font.mono,
    fontSize: 10,
    color: Colors.amber,
    fontWeight: '700',
    lineHeight: 12,
  },
  label: {
    fontFamily: Font.mono,
    fontSize: 7,
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
});

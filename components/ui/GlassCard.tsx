import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius } from '../../constants/theme';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  noPadding?: boolean;
};

export default function GlassCard({ children, style, glowColor, noPadding }: Props) {
  return (
    <View style={[styles.outer, glowColor && { shadowColor: glowColor, shadowOpacity: 0.2 }, style]}>
      <LinearGradient
        colors={['rgba(30,40,60,0.5)', 'rgba(10,14,22,0.85)']}
        style={[styles.card, noPadding && styles.noPad]}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: Radius.lg,
    shadowColor: Colors.amber,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 12,
    shadowOpacity: 0,
    elevation: 4,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    overflow: 'hidden',
  },
  noPad: {
    padding: 0,
  },
});

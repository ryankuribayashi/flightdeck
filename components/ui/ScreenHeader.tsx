import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Colors, Font, Space } from '../../constants/theme';
import { isSupabaseConfigured } from '../../lib/supabase';

type Props = {
  subtitle: string;
  rightElement?: React.ReactNode;
  onNotifPress?: () => void;
};

export default function ScreenHeader({ subtitle, rightElement, onNotifPress }: Props) {
  return (
    <BlurView intensity={40} tint="dark" style={styles.blur}>
      <LinearGradient
        colors={['rgba(8,11,16,0.95)', 'rgba(8,11,16,0.6)']}
        style={styles.container}
      >
        <View style={styles.left}>
          <Text style={styles.logo}>✈ FLIGHTDECK</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.right}>
          {rightElement}
          <TouchableOpacity onPress={onNotifPress} style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={20} color={Colors.textSecondary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <LinearGradient
        colors={['transparent', Colors.amberDim, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.bottomLine}
      />
      {!isSupabaseConfigured && (
        <View style={styles.demoBanner}>
          <View style={styles.demoDot} />
          <Text style={styles.demoText}>DEMO MODE — LIVE DATA DISABLED</Text>
        </View>
      )}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blur: {
    zIndex: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space.md,
    paddingVertical: 10,
  },
  left: {
    gap: 1,
  },
  logo: {
    fontFamily: Font.mono,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.amber,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontFamily: Font.mono,
    fontSize: 9,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.red,
    borderWidth: 1,
    borderColor: Colors.bg,
  },
  bottomLine: {
    height: 1,
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 3,
    backgroundColor: 'rgba(0,212,255,0.06)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,212,255,0.12)',
  },
  demoDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.cyan,
  },
  demoText: {
    fontFamily: Font.mono,
    fontSize: 7,
    color: Colors.textMuted,
    letterSpacing: 1.5,
  },
});

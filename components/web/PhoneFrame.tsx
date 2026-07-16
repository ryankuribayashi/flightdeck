import React from 'react';
import { Platform, View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Font } from '../../constants/theme';

const PHONE_W = 393;
const PHONE_H = 852;

const INFO_ITEMS = [
  '◈  Global Flight Radar',
  '◈  AR Sky Scanner',
  '◈  Live ATC Audio',
  '◈  Approach Sequences',
  '◈  Tail Watchlist',
  '◈  Squadrons & Chat',
  '◈  Pilot Dossier',
  '◈  Daily Dispatch',
];

export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 900;

  if (!isDesktop) return <>{children}</>;

  // Scale phone to fit viewport height with some padding
  const scale = Math.min(1, (height - 80) / PHONE_H);
  const scaledW = PHONE_W * scale;
  const scaledH = PHONE_H * scale;

  return (
    <View style={styles.viewport}>
      <LinearGradient colors={['#040609', '#080C14', '#040609']} style={styles.bg}>
        {/* Subtle radial glow behind phone */}
        <View style={[styles.glow, { width: scaledW * 1.4, height: scaledH * 0.6, top: height * 0.2, left: width / 2 - scaledW * 0.7 }]} />

        <View style={styles.row}>
          {/* Left info panel */}
          <View style={[styles.sidePanel, styles.leftPanel, { opacity: width > 1100 ? 1 : 0 }]}>
            <Text style={styles.sidePanelTitle}>✈ FLIGHTDECK</Text>
            <Text style={styles.sidePanelSub}>Aviation Social Platform</Text>
            <View style={styles.sideDivider} />
            {INFO_ITEMS.slice(0, 4).map((item) => (
              <Text key={item} style={styles.sideItem}>{item}</Text>
            ))}
          </View>

          {/* Phone */}
          <View style={[styles.phoneContainer, { width: scaledW, height: scaledH }]}>
            {/* Volume buttons (left side) */}
            <View style={[styles.sideBtn, styles.volUp, { height: 28 * scale, top: scaledH * 0.22 }]} />
            <View style={[styles.sideBtn, styles.volDown, { height: 28 * scale, top: scaledH * 0.30 }]} />
            <View style={[styles.sideBtn, styles.volDown, { height: 28 * scale, top: scaledH * 0.37 }]} />

            {/* Power button (right side) */}
            <View style={[styles.sideBtn, styles.powerBtn, { height: 48 * scale, top: scaledH * 0.28 }]} />

            {/* Main bezel */}
            <LinearGradient
              colors={['#1A1C22', '#0E1018', '#0A0C12']}
              style={[styles.bezel, { borderRadius: 44 * scale }]}
            >
              {/* Top notch row */}
              <View style={[styles.topBar, { height: 50 * scale }]}>
                <View style={[styles.island, { width: 120 * scale, height: 32 * scale, borderRadius: 16 * scale }]} />
              </View>

              {/* Screen */}
              <View style={[styles.screen, { borderRadius: 12 * scale }]}>
                {children}
              </View>

              {/* Home indicator */}
              <View style={[styles.bottomBar, { height: 32 * scale }]}>
                <View style={[styles.homeBar, { width: 120 * scale, borderRadius: 2 * scale }]} />
              </View>
            </LinearGradient>

            {/* Reflection sheen */}
            <LinearGradient
              colors={['rgba(255,255,255,0.04)', 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={[styles.sheen, { borderRadius: 44 * scale }]}
              pointerEvents="none"
            />
          </View>

          {/* Right info panel */}
          <View style={[styles.sidePanel, styles.rightPanel, { opacity: width > 1100 ? 1 : 0 }]}>
            <View style={styles.demoTag}>
              <View style={styles.demoTagDot} />
              <Text style={styles.demoTagText}>DEMO MODE</Text>
            </View>
            <View style={styles.sideDivider} />
            {INFO_ITEMS.slice(4).map((item) => (
              <Text key={item} style={styles.sideItem}>{item}</Text>
            ))}
            <View style={styles.sideDivider} />
            <Text style={styles.versionText}>React Native + Expo</Text>
            <Text style={styles.versionText}>Supabase · Reanimated v4</Text>
          </View>
        </View>

        {/* Bottom label */}
        <View style={styles.bottomLabel}>
          <View style={styles.bottomLine} />
          <Text style={styles.bottomText}>FLIGHTDECK · Aviation Social Platform · v1.0</Text>
          <View style={styles.bottomLine} />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
    // @ts-ignore — web-only
    height: '100vh',
    width: '100%',
  } as any,
  bg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 16,
  },
  glow: {
    position: 'absolute',
    backgroundColor: Colors.amber,
    opacity: 0.03,
    borderRadius: 9999,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  sidePanel: {
    width: 180,
    gap: 7,
  },
  leftPanel: { alignItems: 'flex-end' },
  rightPanel: { alignItems: 'flex-start' },
  sidePanelTitle: {
    fontFamily: Font.mono,
    fontSize: 15,
    color: Colors.amber,
    fontWeight: '700',
    letterSpacing: 2,
  },
  sidePanelSub: {
    fontFamily: Font.mono,
    fontSize: 9,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  sideDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  sideItem: {
    fontFamily: Font.mono,
    fontSize: 10,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  demoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.green + '50',
    backgroundColor: Colors.greenGlow,
    alignSelf: 'flex-start',
  },
  demoTagDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.green,
  },
  demoTagText: {
    fontFamily: Font.mono,
    fontSize: 8,
    color: Colors.green,
    letterSpacing: 1,
  },
  versionText: {
    fontFamily: Font.mono,
    fontSize: 9,
    color: Colors.textMuted,
  },
  phoneContainer: {
    position: 'relative',
  },
  sideBtn: {
    position: 'absolute',
    width: 3,
    borderRadius: 2,
    backgroundColor: '#2A2E38',
  },
  volUp: { left: -3 },
  volDown: { left: -3 },
  powerBtn: { right: -3 },
  bezel: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2A2E3A',
    overflow: 'hidden',
    backgroundColor: '#080B10',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 60,
    shadowOpacity: 0.8,
    elevation: 24,
  },
  topBar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg,
  },
  island: {
    backgroundColor: '#0A0A0A',
    borderWidth: 0.5,
    borderColor: '#333',
  },
  screen: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: Colors.bg,
  },
  bottomBar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg,
  },
  homeBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  sheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    pointerEvents: 'none',
  } as any,
  bottomLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  bottomLine: {
    flex: 1,
    maxWidth: 120,
    height: 1,
    backgroundColor: Colors.border,
  },
  bottomText: {
    fontFamily: Font.mono,
    fontSize: 9,
    color: Colors.textMuted,
    letterSpacing: 1.5,
  },
});

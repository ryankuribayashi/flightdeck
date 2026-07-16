import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, ScrollView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Font, Radius, Space } from '../../constants/theme';

const { width: W, height: H } = Dimensions.get('window');

type ARTarget = {
  id: string;
  reg: string;
  type: string;
  icao: string;
  airline: string;
  flight: string;
  origin: string;
  destination: string;
  altitude: string;
  speed: string;
  heading: number;
  dist: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
};

const AR_TARGETS: ARTarget[] = [
  {
    id: '1', reg: 'A6-EUH', type: 'Airbus A380-800', icao: 'A388',
    airline: 'Emirates', flight: 'EK001', origin: 'OMDB', destination: 'EGLL',
    altitude: 'FL390', speed: '492kt', heading: 315, dist: '28.4km',
    startX: 0.15, startY: 0.25, endX: 0.75, endY: 0.20, duration: 18000,
  },
  {
    id: '2', reg: 'JA8963', type: 'Boeing 787-9', icao: 'B789',
    airline: 'ANA', flight: 'NH106', origin: 'RJAA', destination: 'KLAX',
    altitude: 'FL410', speed: '476kt', heading: 65, dist: '41.2km',
    startX: 0.60, startY: 0.35, endX: 0.10, endY: 0.40, duration: 22000,
  },
  {
    id: '3', reg: 'G-VIIO', type: 'Boeing 777-200ER', icao: 'B772',
    airline: 'British Airways', flight: 'BA8', origin: 'EGLL', destination: 'RJAA',
    altitude: 'FL380', speed: '486kt', heading: 42, dist: '15.7km',
    startX: 0.80, startY: 0.55, endX: 0.30, endY: 0.30, duration: 14000,
  },
  {
    id: '4', reg: 'JL8119', type: 'Boeing 777-300ER', icao: 'B77W',
    airline: 'JAL', flight: 'JL716', origin: 'RJTT', destination: 'KLAX',
    altitude: 'FL350', speed: '487kt', heading: 55, dist: '8.3km',
    startX: 0.40, startY: 0.60, endX: 0.85, endY: 0.45, duration: 16000,
  },
];

function ARBlip({ target, onSelect, selected }: {
  target: ARTarget;
  onSelect: (t: ARTarget) => void;
  selected: boolean;
}) {
  const x = useSharedValue(target.startX * W);
  const y = useSharedValue(target.startY * (H * 0.65));
  const pulse = useSharedValue(0);
  const selectScale = useSharedValue(1);

  useEffect(() => {
    x.value = withRepeat(
      withSequence(
        withTiming(target.endX * W, { duration: target.duration }),
        withTiming(target.startX * W, { duration: target.duration }),
      ),
      -1,
      false
    );
    y.value = withRepeat(
      withSequence(
        withTiming(target.endY * (H * 0.65), { duration: target.duration }),
        withTiming(target.startY * (H * 0.65), { duration: target.duration }),
      ),
      -1,
      false
    );
    pulse.value = withRepeat(
      withSequence(withTiming(1, { duration: 900 }), withTiming(0, { duration: 900 })),
      -1
    );
  }, []);

  useEffect(() => {
    selectScale.value = withSpring(selected ? 1.3 : 1, { damping: 12 });
  }, [selected]);

  const posStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: x.value - 30,
    top: y.value - 30,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.7, 0]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 2.2]) }],
  }));

  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: selectScale.value }],
  }));

  return (
    <Animated.View style={posStyle}>
      <TouchableOpacity onPress={() => onSelect(target)} activeOpacity={0.8}>
        <Animated.View style={innerStyle}>
          <Animated.View style={[styles.blipPulse, pulseStyle, selected && styles.blipPulseSelected]} />
          <View style={[styles.blipCore, selected && styles.blipCoreSelected]}>
            <MaterialCommunityIcons
              name="airplane"
              size={14}
              color={selected ? '#000' : Colors.amber}
              style={{ transform: [{ rotate: `${target.heading}deg` }] }}
            />
          </View>
          <View style={styles.blipLabel}>
            <Text style={[styles.blipReg, selected && styles.blipRegSelected]}>{target.reg}</Text>
            <Text style={styles.blipDist}>{target.icao} · {target.dist}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function CompassBar({ heading }: { heading: number }) {
  const ticks = ['N', '045', 'NE', '135', 'S', '225', 'SW', '315', 'N'];
  return (
    <View style={styles.compass}>
      <Text style={styles.compassHdg}>HDG {heading.toString().padStart(3, '0')}°</Text>
      <View style={styles.compassTape}>
        {ticks.map((t, i) => (
          <Text key={i} style={[styles.compassTick, t.length === 1 && styles.compassCardinal]}>{t}</Text>
        ))}
      </View>
      <View style={styles.compassCursor} />
    </View>
  );
}

type DetailPanelProps = { target: ARTarget; onClose: () => void; onWatchlist: () => void; onPost: () => void };

function DetailPanel({ target, onClose, onWatchlist, onPost }: DetailPanelProps) {
  const slide = useSharedValue(200);

  useEffect(() => {
    slide.value = withSpring(0, { damping: 18, stiffness: 200 });
  }, []);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slide.value }],
  }));

  return (
    <Animated.View style={[styles.detailPanel, panelStyle]}>
      <LinearGradient colors={['rgba(10,13,22,0.98)', Colors.bg]} style={styles.detailInner}>
        {/* Header */}
        <View style={styles.detailHeader}>
          <View style={styles.detailLockRow}>
            <View style={styles.lockDot} />
            <Text style={styles.lockText}>LOCKED ON: {target.reg}</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Aircraft data */}
        <View style={styles.detailBody}>
          <View style={styles.detailLeft}>
            <Text style={styles.detailType}>{target.icao}</Text>
            <Text style={styles.detailFull}>{target.type}</Text>
          </View>
          <View style={styles.detailRight}>
            <Text style={styles.detailAirline}>{target.airline}</Text>
            <Text style={styles.detailFlight}>{target.flight}</Text>
          </View>
        </View>

        <View style={styles.detailDivider} />

        <View style={styles.detailStats}>
          <DetailStat label="ROUTE" value={`${target.origin} → ${target.destination}`} color={Colors.textPrimary} />
          <DetailStat label="ALT" value={target.altitude} color={Colors.cyan} />
          <DetailStat label="SPD" value={target.speed} color={Colors.green} />
          <DetailStat label="HDG" value={`${target.heading}°`} color={Colors.amber} />
          <DetailStat label="DIST" value={target.dist} color={Colors.textSecondary} />
        </View>

        {/* Action buttons */}
        <View style={styles.detailActions}>
          <TouchableOpacity onPress={onWatchlist} style={styles.detailBtn}>
            <MaterialCommunityIcons name="eye-plus" size={16} color={Colors.amber} />
            <Text style={styles.detailBtnText}>WATCHLIST</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailBtn}>
            <MaterialCommunityIcons name="radar" size={16} color={Colors.cyan} />
            <Text style={[styles.detailBtnText, { color: Colors.cyan }]}>TRACK</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPost} style={[styles.detailBtn, styles.detailBtnPost]}>
            <MaterialCommunityIcons name="camera" size={16} color="#000" />
            <Text style={[styles.detailBtnText, { color: '#000' }]}>POST</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

function DetailStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={detailStatStyles.wrap}>
      <Text style={detailStatStyles.label}>{label}</Text>
      <Text style={[detailStatStyles.value, { color }]}>{value}</Text>
    </View>
  );
}

const detailStatStyles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center' },
  label: { fontFamily: Font.mono, fontSize: 7, color: Colors.textMuted, letterSpacing: 1 },
  value: { fontFamily: Font.mono, fontSize: 10, fontWeight: '700' },
});

export default function ARScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [selectedTarget, setSelectedTarget] = useState<ARTarget | null>(null);
  const [heading] = useState(270);
  const [signalStrength] = useState(4);
  const scanPulse = useSharedValue(0);

  useEffect(() => {
    scanPulse.value = withRepeat(
      withSequence(withTiming(1, { duration: 1500 }), withTiming(0, { duration: 500 })),
      -1
    );
  }, []);

  const scanStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scanPulse.value, [0, 0.5, 1], [0.3, 0.8, 0.3]),
  }));

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permContainer}>
        <MaterialCommunityIcons name="camera-off" size={48} color={Colors.textMuted} />
        <Text style={styles.permTitle}>CAMERA ACCESS REQUIRED</Text>
        <Text style={styles.permSub}>FlightDeck AR Scanner needs camera access to identify aircraft in the sky.</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>GRANT ACCESS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.permSkip} onPress={() => router.back()}>
          <Text style={styles.permSkipText}>← GO BACK</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera */}
      <CameraView style={StyleSheet.absoluteFill} facing="back" />

      {/* Dark vignette overlay */}
      <LinearGradient
        colors={['rgba(8,11,16,0.7)', 'transparent', 'transparent', 'rgba(8,11,16,0.85)']}
        locations={[0, 0.2, 0.7, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Scan grid */}
      <View style={styles.scanGrid} pointerEvents="none">
        {/* Horizontal lines */}
        {[0.25, 0.5, 0.75].map((pos) => (
          <View key={pos} style={[styles.gridLineH, { top: `${pos * 100}%` }]} />
        ))}
        {/* Vertical lines */}
        {[0.25, 0.5, 0.75].map((pos) => (
          <View key={pos} style={[styles.gridLineV, { left: `${pos * 100}%` }]} />
        ))}
        {/* Center reticle */}
        <View style={styles.reticle}>
          <View style={styles.reticleCorner} />
        </View>
      </View>

      {/* Aircraft blips */}
      <View style={styles.blipsLayer} pointerEvents="box-none">
        {AR_TARGETS.map((t) => (
          <ARBlip
            key={t.id}
            target={t}
            selected={selectedTarget?.id === t.id}
            onSelect={(target) => setSelectedTarget(target)}
          />
        ))}
      </View>

      {/* TOP HUD */}
      <SafeAreaView style={styles.topHUD} pointerEvents="box-none">
        {/* Header bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.topBarCenter}>
            <Animated.View style={[styles.activeDot, scanStyle]} />
            <Text style={styles.topBarTitle}>AR SCANNER</Text>
          </View>
          <View style={styles.sigStrength}>
            {Array.from({ length: 5 }).map((_, i) => (
              <View key={i} style={[styles.sigBar, { height: 4 + i * 3 }, i < signalStrength && styles.sigBarActive]} />
            ))}
          </View>
        </View>

        {/* Compass */}
        <CompassBar heading={heading} />

        {/* Stats row */}
        <View style={styles.statsBar} pointerEvents="none">
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>TARGETS</Text>
            <Text style={styles.statValue}>{AR_TARGETS.length}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>ALT</Text>
            <Text style={styles.statValue}>3m AGL</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>MODE</Text>
            <Text style={[styles.statValue, { color: Colors.green }]}>ACTIVE</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>RANGE</Text>
            <Text style={styles.statValue}>50km</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Bottom scan bar */}
      {!selectedTarget && (
        <View style={styles.scanPrompt} pointerEvents="none">
          <Animated.Text style={[styles.scanPromptText, scanStyle]}>
            ◈ SCANNING AIRSPACE — TAP TARGET TO IDENTIFY ◈
          </Animated.Text>
        </View>
      )}

      {/* Detail panel */}
      {selectedTarget && (
        <DetailPanel
          target={selectedTarget}
          onClose={() => setSelectedTarget(null)}
          onWatchlist={() => Alert.alert('Watchlist', `${selectedTarget.reg} added to your tail watchlist.`)}
          onPost={() => Alert.alert('Post', `Opening camera to post ${selectedTarget.reg}...`)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  permContainer: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center', padding: Space.xl, gap: 12 },
  permTitle: { fontFamily: Font.mono, fontSize: 14, color: Colors.textPrimary, letterSpacing: 1.5 },
  permSub: { fontFamily: Font.mono, fontSize: 10, color: Colors.textSecondary, textAlign: 'center', lineHeight: 16 },
  permBtn: { marginTop: 8, paddingHorizontal: 20, paddingVertical: 12, borderRadius: Radius.md, backgroundColor: Colors.amber },
  permBtnText: { fontFamily: Font.mono, fontSize: 11, color: '#000', letterSpacing: 1 },
  permSkip: { marginTop: 4 },
  permSkipText: { fontFamily: Font.mono, fontSize: 10, color: Colors.textMuted },

  scanGrid: { ...StyleSheet.absoluteFill, pointerEvents: 'none' },
  gridLineH: { position: 'absolute', left: 0, right: 0, height: 0.5, backgroundColor: 'rgba(240,160,32,0.08)' },
  gridLineV: { position: 'absolute', top: 0, bottom: 0, width: 0.5, backgroundColor: 'rgba(240,160,32,0.08)' },
  reticle: { position: 'absolute', top: '50%', left: '50%', marginTop: -20, marginLeft: -20, width: 40, height: 40, borderWidth: 1, borderColor: 'rgba(240,160,32,0.4)', borderRadius: 2 },
  reticleCorner: { position: 'absolute', top: -1, left: -1, right: -1, bottom: -1, borderWidth: 1, borderColor: 'rgba(240,160,32,0.2)', borderRadius: 4 },

  blipsLayer: { ...StyleSheet.absoluteFill, top: 100, bottom: 200 },

  blipPulse: {
    position: 'absolute', top: 10, left: 10, width: 40, height: 40,
    borderRadius: 20, borderWidth: 1.5, borderColor: Colors.amber,
  },
  blipPulseSelected: { borderColor: Colors.amberBright },
  blipCore: {
    width: 28, height: 28, borderRadius: 14, borderWidth: 1.5,
    borderColor: Colors.amber, backgroundColor: 'rgba(240,160,32,0.15)',
    alignItems: 'center', justifyContent: 'center',
    margin: 8,
  },
  blipCoreSelected: { backgroundColor: Colors.amber, borderColor: Colors.amber },
  blipLabel: { alignItems: 'center', marginTop: 2 },
  blipReg: { fontFamily: Font.mono, fontSize: 9, color: Colors.amber, fontWeight: '700' },
  blipRegSelected: { color: Colors.amberBright },
  blipDist: { fontFamily: Font.mono, fontSize: 7, color: Colors.textSecondary },

  topHUD: { position: 'absolute', top: 0, left: 0, right: 0 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'rgba(8,11,16,0.85)' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  topBarCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  activeDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.red },
  topBarTitle: { fontFamily: Font.mono, fontSize: 11, color: Colors.textPrimary, letterSpacing: 2 },
  sigStrength: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  sigBar: { width: 3, borderRadius: 1, backgroundColor: Colors.bgElevated },
  sigBarActive: { backgroundColor: Colors.green },

  compass: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(8,11,16,0.7)', paddingHorizontal: 16, paddingVertical: 5, gap: 8 },
  compassHdg: { fontFamily: Font.mono, fontSize: 10, color: Colors.amber, minWidth: 55 },
  compassTape: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  compassTick: { fontFamily: Font.mono, fontSize: 8, color: Colors.textMuted },
  compassCardinal: { color: Colors.textSecondary, fontWeight: '700' },
  compassCursor: { position: 'absolute', bottom: 0, left: '50%', width: 1, height: 8, backgroundColor: Colors.amber, marginLeft: 55 },

  statsBar: { flexDirection: 'row', backgroundColor: 'rgba(8,11,16,0.6)', paddingVertical: 6, paddingHorizontal: 16 },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { fontFamily: Font.mono, fontSize: 6, color: Colors.textMuted, letterSpacing: 1 },
  statValue: { fontFamily: Font.mono, fontSize: 10, color: Colors.textPrimary, fontWeight: '700' },
  statDivider: { width: 1, backgroundColor: Colors.border, marginVertical: 2 },

  scanPrompt: { position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center' },
  scanPromptText: { fontFamily: Font.mono, fontSize: 9, color: Colors.amber, letterSpacing: 1.5 },

  detailPanel: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  detailInner: { borderTopWidth: 1, borderTopColor: Colors.borderAmber, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: Space.md },
  detailHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Space.sm },
  detailLockRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lockDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.red, shadowColor: Colors.red, shadowOpacity: 0.9, shadowRadius: 4 },
  lockText: { fontFamily: Font.mono, fontSize: 9, color: Colors.red, letterSpacing: 1 },
  detailBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Space.sm },
  detailLeft: { gap: 2 },
  detailRight: { alignItems: 'flex-end', gap: 2 },
  detailType: { fontFamily: Font.mono, fontSize: 22, color: Colors.amber, fontWeight: '700' },
  detailFull: { fontFamily: Font.mono, fontSize: 9, color: Colors.textSecondary },
  detailAirline: { fontFamily: Font.mono, fontSize: 16, color: Colors.textPrimary, fontWeight: '600' },
  detailFlight: { fontFamily: Font.mono, fontSize: 9, color: Colors.textSecondary },
  detailDivider: { height: 1, backgroundColor: Colors.border, opacity: 0.5, marginBottom: Space.sm },
  detailStats: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: Space.md },
  detailActions: { flexDirection: 'row', gap: 8 },
  detailBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    paddingVertical: 10, borderRadius: Radius.md, borderWidth: 1,
    borderColor: Colors.borderAmber, backgroundColor: Colors.amberDim,
  },
  detailBtnText: { fontFamily: Font.mono, fontSize: 9, color: Colors.amber, letterSpacing: 0.5 },
  detailBtnPost: { backgroundColor: Colors.amber, borderColor: Colors.amber },
});

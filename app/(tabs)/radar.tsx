import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, Linking, Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ScreenHeader from '../../components/ui/ScreenHeader';
import ScreenFade from '../../components/ui/ScreenFade';
import GlassCard from '../../components/ui/GlassCard';
import AnimatedWaveform from '../../components/radar/AnimatedWaveform';
import { Colors, Font, Space, Radius } from '../../constants/theme';
import { TAIL_WATCHLIST } from '../../constants/mockData';

const NEARBY_FLIGHTS = [
  { flight: 'JL716', type: 'B77W', alt: 'FL350', spd: '487kt', dist: '12nm', status: 'airborne' },
  { flight: 'NH106', type: 'B789', alt: 'FL410', spd: '476kt', dist: '28nm', status: 'airborne' },
  { flight: 'EK001', type: 'A388', alt: 'FL390', spd: '492kt', dist: '41nm', status: 'airborne' },
  { flight: 'UA837', type: 'B789', alt: 'FL380', spd: '468kt', dist: '55nm', status: 'airborne' },
];

const ATC_AIRPORTS = ['RJTT', 'KLAX', 'EGLL', 'OMDB', 'KJFK', 'YSSY', 'LFPG', 'EDDF'];

export default function RadarScreen() {
  const [tab, setTab] = useState<'map' | 'nearby' | 'watchlist' | 'atc'>('map');
  const [radarError, setRadarError] = useState(false);
  const [atcAirport, setAtcAirport] = useState('RJTT');
  const [atcPlaying, setAtcPlaying] = useState(false);

  return (
    <ScreenFade>
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        subtitle="GLOBAL FLIGHT RADAR"
        rightElement={
          <TouchableOpacity
            style={styles.arBtn}
            onPress={() => router.push('/(modals)/ar-scanner')}
          >
            <MaterialCommunityIcons name="augmented-reality" size={16} color={Colors.cyan} />
            <Text style={styles.arText}>AR</Text>
          </TouchableOpacity>
        }
      />

      {/* Tab selector */}
      <View style={styles.tabRow}>
        {(['map', 'nearby', 'watchlist', 'atc'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t.toUpperCase()}
            </Text>
            {tab === t && (
              <LinearGradient
                colors={['transparent', Colors.amber, 'transparent']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.tabLine}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'map' && (
        <View style={styles.mapContainer}>
          {radarError || Platform.OS === 'web' ? (
            <View style={styles.radarFallback}>
              <MaterialCommunityIcons name="radar" size={56} color={Colors.amber} style={{ opacity: 0.7 }} />
              <Text style={styles.radarFallbackTitle}>GLOBAL FLIGHT RADAR</Text>
              <Text style={styles.radarFallbackSub}>
                Embedded radar is available in the native mobile app.{'\n'}
                Open FlightRadar24 directly to view live air traffic.
              </Text>
              <TouchableOpacity
                style={styles.radarOpenBtn}
                onPress={() => Linking.openURL('https://www.flightradar24.com')}
              >
                <LinearGradient colors={['#C08010', Colors.amber]} style={styles.radarOpenGrad}>
                  <MaterialCommunityIcons name="open-in-new" size={14} color="#000" />
                  <Text style={styles.radarOpenText}>OPEN FLIGHTRADAR24</Text>
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.radarNote}>
                ◈ Full embedded radar active in iOS & Android builds
              </Text>
            </View>
          ) : (
            <>
              <WebView
                source={{ uri: 'https://www.flightradar24.com/' }}
                style={styles.webview}
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState
                onError={() => setRadarError(true)}
                onHttpError={() => setRadarError(true)}
                renderLoading={() => (
                  <View style={styles.loadingOverlay}>
                    <MaterialCommunityIcons name="radar" size={40} color={Colors.amber} />
                    <Text style={styles.loadingText}>ACQUIRING SIGNAL...</Text>
                  </View>
                )}
              />
              <LinearGradient
                colors={['rgba(8,11,16,0.8)', 'transparent']}
                style={styles.mapTopFade}
                pointerEvents="none"
              />
            </>
          )}
        </View>
      )}

      {tab === 'nearby' && (
        <ScrollView style={styles.listScroll} contentContainerStyle={styles.listContent}>
          <Text style={styles.sectionTitle}>◈ NEARBY AIRCRAFT</Text>
          {NEARBY_FLIGHTS.map((f) => (
            <GlassCard key={f.flight} style={styles.flightCard}>
              <View style={styles.flightRow}>
                <View style={styles.flightLeft}>
                  <Text style={styles.flightNum}>{f.flight}</Text>
                  <Text style={styles.flightType}>{f.type}</Text>
                </View>
                <View style={styles.flightStats}>
                  <StatPill label="ALT" value={f.alt} color={Colors.cyan} />
                  <StatPill label="SPD" value={f.spd} color={Colors.green} />
                  <StatPill label="DIST" value={f.dist} color={Colors.amber} />
                </View>
                <TouchableOpacity style={styles.trackBtn} onPress={() => Alert.alert('Tracking', f.flight)}>
                  <MaterialCommunityIcons name="radar" size={18} color={Colors.amber} />
                </TouchableOpacity>
              </View>
            </GlassCard>
          ))}
        </ScrollView>
      )}

      {tab === 'watchlist' && (
        <ScrollView style={styles.listScroll} contentContainerStyle={styles.listContent}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>◈ TAIL WATCHLIST</Text>
            <TouchableOpacity onPress={() => Alert.alert('Add Registration', 'Enter a tail number to track')}>
              <Text style={styles.addLink}>+ ADD REG</Text>
            </TouchableOpacity>
          </View>
          {TAIL_WATCHLIST.map((t) => (
            <GlassCard key={t.id} style={styles.tailCard} glowColor={t.alert ? Colors.amber : undefined}>
              <View style={styles.tailRow}>
                <View style={styles.tailLeft}>
                  <View style={styles.tailRegRow}>
                    <Text style={styles.tailReg}>{t.reg}</Text>
                    {t.alert && <View style={styles.alertDot} />}
                  </View>
                  <Text style={styles.tailType}>{t.type}</Text>
                  <Text style={styles.tailAirline}>{t.airline}</Text>
                </View>
                <View style={styles.tailRight}>
                  <View style={[
                    styles.statusBadge,
                    t.status === 'AIRBORNE' ? styles.statusGreen :
                    t.status === 'MUSEUM' || t.status === 'PRESERVED' || t.status === 'STATIC' ? styles.statusMuted : styles.statusAmber,
                  ]}>
                    <Text style={styles.statusText}>{t.status}</Text>
                  </View>
                  <Text style={styles.tailLocation} numberOfLines={2}>{t.location}</Text>
                </View>
              </View>
            </GlassCard>
          ))}
        </ScrollView>
      )}

      {tab === 'atc' && (
        <ScrollView style={styles.listScroll} contentContainerStyle={styles.listContent}>
          <Text style={styles.sectionTitle}>◈ ATC AUDIO — LIVEATC</Text>

          <GlassCard style={styles.atcPlayer} glowColor={atcPlaying ? Colors.green : undefined}>
            <View style={styles.atcNowPlaying}>
              <View style={styles.atcInfo}>
                <Text style={styles.atcAirportLabel}>NOW MONITORING</Text>
                <Text style={styles.atcAirportCode}>{atcAirport}</Text>
                <Text style={styles.atcStatus}>
                  {atcPlaying ? '● LIVE FEED ACTIVE' : '○ FEED STOPPED'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setAtcPlaying((v) => !v);
                  if (!atcPlaying) Alert.alert('ATC Audio', `Connecting to ${atcAirport} tower feed...`);
                }}
                style={[styles.atcPlayBtn, atcPlaying && styles.atcPlayBtnActive]}
              >
                <Ionicons name={atcPlaying ? 'stop' : 'play'} size={24} color={atcPlaying ? Colors.bg : Colors.green} />
              </TouchableOpacity>
            </View>
            <View style={styles.atcWaveform}>
              <AnimatedWaveform active={atcPlaying} color={Colors.green} height={32} />
            </View>
          </GlassCard>

          <Text style={styles.subTitle}>SELECT AIRPORT</Text>
          <View style={styles.airportGrid}>
            {ATC_AIRPORTS.map((a) => (
              <TouchableOpacity
                key={a}
                onPress={() => { setAtcAirport(a); setAtcPlaying(false); }}
                style={[styles.airportChip, atcAirport === a && styles.airportChipActive]}
              >
                <Text style={[styles.airportChipText, atcAirport === a && styles.airportChipTextActive]}>
                  {a}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
    </ScreenFade>
  );
}

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[pillStyles.pill, { borderColor: color + '40' }]}>
      <Text style={[pillStyles.label, { color: color + '99' }]}>{label}</Text>
      <Text style={[pillStyles.value, { color }]}>{value}</Text>
    </View>
  );
}

const pillStyles = StyleSheet.create({
  pill: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  label: { fontFamily: Font.mono, fontSize: 6, letterSpacing: 0.5 },
  value: { fontFamily: Font.mono, fontSize: 9, fontWeight: '700' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bgPanel,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  tabBtnActive: {},
  tabText: {
    fontFamily: Font.mono,
    fontSize: 9,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  tabTextActive: { color: Colors.amber },
  tabLine: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2 },
  mapContainer: { flex: 1, position: 'relative' },
  webview: { flex: 1, backgroundColor: Colors.bg },
  mapTopFade: { position: 'absolute', top: 0, left: 0, right: 0, height: 40 },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: { fontFamily: Font.mono, fontSize: 12, color: Colors.textAmber, letterSpacing: 2 },
  radarFallback: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: 32, gap: 12,
  },
  radarFallbackTitle: { fontFamily: Font.mono, fontSize: 16, color: Colors.textPrimary, letterSpacing: 2, fontWeight: '700' },
  radarFallbackSub: { fontFamily: Font.mono, fontSize: 10, color: Colors.textSecondary, textAlign: 'center', lineHeight: 17 },
  radarOpenBtn: { marginTop: 8, borderRadius: Radius.md, overflow: 'hidden' },
  radarOpenGrad: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 12 },
  radarOpenText: { fontFamily: Font.mono, fontSize: 11, color: '#000', fontWeight: '700', letterSpacing: 1 },
  radarNote: { fontFamily: Font.mono, fontSize: 9, color: Colors.textMuted, textAlign: 'center', marginTop: 8 },
  listScroll: { flex: 1 },
  listContent: { padding: Space.md, gap: 10, paddingBottom: 40 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  sectionTitle: { fontFamily: Font.mono, fontSize: 10, color: Colors.textAmber, letterSpacing: 2, marginBottom: 12 },
  addLink: { fontFamily: Font.mono, fontSize: 10, color: Colors.cyan },
  flightCard: {},
  flightRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  flightLeft: { width: 60 },
  flightNum: { fontFamily: Font.mono, fontSize: 13, color: Colors.textPrimary, fontWeight: '700' },
  flightType: { fontFamily: Font.mono, fontSize: 9, color: Colors.textMuted },
  flightStats: { flex: 1, flexDirection: 'row', gap: 6 },
  trackBtn: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 1, borderColor: Colors.borderAmber,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.amberDim,
  },
  tailCard: { marginBottom: 4 },
  tailRow: { flexDirection: 'row', gap: 12 },
  tailLeft: { flex: 1 },
  tailRegRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tailReg: { fontFamily: Font.mono, fontSize: 15, color: Colors.textPrimary, fontWeight: '700' },
  alertDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.red, shadowColor: Colors.red, shadowOpacity: 0.8, shadowRadius: 4 },
  tailType: { fontFamily: Font.mono, fontSize: 10, color: Colors.textSecondary, marginTop: 1 },
  tailAirline: { fontFamily: Font.mono, fontSize: 9, color: Colors.textMuted, marginTop: 1 },
  tailRight: { alignItems: 'flex-end', gap: 4, maxWidth: 120 },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, borderWidth: 1 },
  statusGreen: { backgroundColor: Colors.greenGlow, borderColor: Colors.green + '60' },
  statusAmber: { backgroundColor: Colors.amberDim, borderColor: Colors.borderAmber },
  statusMuted: { backgroundColor: Colors.bgElevated, borderColor: Colors.border },
  statusText: { fontFamily: Font.mono, fontSize: 8, color: Colors.textPrimary, letterSpacing: 0.5 },
  tailLocation: { fontFamily: Font.mono, fontSize: 9, color: Colors.textMuted, textAlign: 'right' },
  arBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.cyanDim, paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.borderCyan,
  },
  arText: { fontFamily: Font.mono, fontSize: 10, color: Colors.cyan, letterSpacing: 1 },
  atcPlayer: {},
  atcNowPlaying: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  atcInfo: { gap: 2 },
  atcAirportLabel: { fontFamily: Font.mono, fontSize: 8, color: Colors.textMuted, letterSpacing: 1 },
  atcAirportCode: { fontFamily: Font.mono, fontSize: 28, color: Colors.textPrimary, fontWeight: '700' },
  atcStatus: { fontFamily: Font.mono, fontSize: 9, color: Colors.green },
  atcPlayBtn: {
    width: 52, height: 52, borderRadius: 26,
    borderWidth: 1.5, borderColor: Colors.green + '60',
    backgroundColor: Colors.greenGlow,
    alignItems: 'center', justifyContent: 'center',
  },
  atcPlayBtnActive: { backgroundColor: Colors.green, borderColor: Colors.green },
  atcWaveform: { marginTop: 12 },
  subTitle: { fontFamily: Font.mono, fontSize: 9, color: Colors.textMuted, letterSpacing: 1.5, marginTop: 16, marginBottom: 8 },
  airportGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  airportChip: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 6,
    borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
  },
  airportChipActive: { borderColor: Colors.borderAmber, backgroundColor: Colors.amberDim },
  airportChipText: { fontFamily: Font.mono, fontSize: 11, color: Colors.textSecondary },
  airportChipTextActive: { color: Colors.amber },
});

import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, Image, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import GlassCard from '../../components/ui/GlassCard';
import ActionSheet from '../../components/ui/ActionSheet';
import ScreenFade from '../../components/ui/ScreenFade';
import { Colors, Font, Space, Radius } from '../../constants/theme';
import { AIRCRAFT_LOG, POSTS } from '../../constants/mockData';
import { useStore } from '../../store';

const { width } = Dimensions.get('window');
const GRID_SIZE = (width - 32 - 8) / 3;

const RANKS = [
  { label: 'CADET', min: 0, color: Colors.textMuted },
  { label: 'OBSERVER', min: 20, color: Colors.blue },
  { label: 'SPOTTER', min: 50, color: Colors.cyan },
  { label: 'SR. SPOTTER', min: 100, color: Colors.amber },
  { label: 'ACE', min: 200, color: Colors.purple },
  { label: 'LEGEND', min: 500, color: Colors.red },
];

function getRank(spotted: number) {
  const r = [...RANKS].reverse().find((r) => spotted >= r.min) ?? RANKS[0];
  return r;
}

type CollectionTab = 'aircraft' | 'airlines' | 'airports';

type SheetState = { visible: boolean; title: string; subtitle?: string; actions: Parameters<typeof ActionSheet>[0]['actions'] };
const SHEET_CLOSED: SheetState = { visible: false, title: '', actions: [] };

export default function DossierScreen() {
  const user = useStore((s) => s.user);
  const [colTab, setColTab] = useState<CollectionTab>('aircraft');
  const [sheet, setSheet] = useState<SheetState>(SHEET_CLOSED);
  const close = () => setSheet(SHEET_CLOSED);
  const rank = getRank(user.spotted);

  const formatNm = (nm: number) => {
    if (nm >= 1000) return `${(nm / 1000).toFixed(0)}K`;
    return `${nm}`;
  };

  return (
    <ScreenFade>
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
        {/* Sticky header */}
        <BlurView intensity={40} tint="dark" style={styles.stickyHeader}>
          <LinearGradient colors={['rgba(8,11,16,0.95)', 'rgba(8,11,16,0.6)']} style={styles.headerInner}>
            <Text style={styles.headerLogo}>✈ FLIGHTDECK</Text>
            <TouchableOpacity style={styles.settingsBtn} onPress={() => setSheet({
              visible: true, title: 'SETTINGS',
              actions: [
                { label: 'Edit Profile', sublabel: 'Change callsign, bio, home base', icon: 'account-edit', color: Colors.amber, onPress: close },
                { label: 'Notifications', sublabel: 'Manage alert preferences', icon: 'bell-outline', color: Colors.cyan, onPress: close },
                { label: 'Privacy', sublabel: 'Location and visibility settings', icon: 'shield-outline', color: Colors.green, onPress: close },
                { label: 'Sign Out', sublabel: 'Log out of FlightDeck', icon: 'logout', color: Colors.red, destructive: true, onPress: close },
              ],
            })}>
              <Ionicons name="settings-outline" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            colors={['transparent', Colors.amberDim, 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ height: 1 }}
          />
        </BlurView>

        {/* Pilot card */}
        <LinearGradient
          colors={['rgba(240,160,32,0.12)', 'rgba(8,11,16,0)', Colors.bg]}
          style={styles.cardBackground}
        >
          <View style={styles.pilotCard}>
            {/* Avatar with instrument ring */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatarRingOuter}>
                <LinearGradient
                  colors={[Colors.amber, Colors.amberBright, Colors.amber]}
                  style={styles.avatarRing}
                >
                  <View style={styles.avatarInner}>
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                  </View>
                </LinearGradient>
              </View>
              {/* Rank badge */}
              <View style={[styles.rankBadge, { borderColor: rank.color + '60', backgroundColor: rank.color + '20' }]}>
                <Text style={[styles.rankText, { color: rank.color }]}>{rank.label}</Text>
              </View>
            </View>

            {/* Identity */}
            <View style={styles.identityBlock}>
              <View style={styles.callsignRow}>
                <Text style={styles.callsign}>{user.callsign}</Text>
                <View style={styles.verifiedBadge}>
                  <MaterialCommunityIcons name="check-decagram" size={14} color={Colors.cyan} />
                </View>
              </View>
              <Text style={styles.displayName}>{user.displayName}</Text>
              <View style={styles.homeRow}>
                <MaterialCommunityIcons name="airport" size={12} color={Colors.textMuted} />
                <Text style={styles.homeAirport}>BASE: {user.homeAirport}</Text>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>ONLINE</Text>
              </View>

              <TouchableOpacity style={styles.editBtn} onPress={() => setSheet({
                visible: true, title: 'EDIT DOSSIER',
                subtitle: 'Update your pilot profile',
                actions: [
                  { label: 'Change Callsign', sublabel: 'Update your pilot handle', icon: 'pencil', color: Colors.amber, onPress: close },
                  { label: 'Upload Avatar', sublabel: 'Pick a new profile photo', icon: 'camera', color: Colors.cyan, onPress: close },
                  { label: 'Update Home Base', sublabel: 'Change your primary airport', icon: 'airport', color: Colors.green, onPress: close },
                ],
              })}>
                <Text style={styles.editText}>EDIT DOSSIER</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <StatBox value={`${user.spotted}`} label="SPOTTED" color={Colors.amber} />
            <View style={styles.statDivider} />
            <StatBox value={`${user.airports}`} label="AIRPORTS" color={Colors.cyan} />
            <View style={styles.statDivider} />
            <StatBox value={formatNm(user.nmLogged)} label="NM LOGGED" color={Colors.green} />
            <View style={styles.statDivider} />
            <StatBox value={`${user.airlines}`} label="AIRLINES" color={Colors.purple} />
          </View>
        </LinearGradient>

        {/* Flight log preview */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>◈ FLIGHT LOG</Text>
            <TouchableOpacity onPress={() => setSheet({
              visible: true, title: 'FLIGHT LOG',
              subtitle: 'Your personal travel record',
              actions: [
                { label: 'Full Flight History', sublabel: 'Browse all logged flights', icon: 'airplane-clock', color: Colors.amber, onPress: close },
                { label: 'Log a Flight', sublabel: 'Add a new entry manually', icon: 'plus-circle', color: Colors.cyan, onPress: close },
                { label: 'Export Log', sublabel: 'Download as CSV', icon: 'download', color: Colors.green, onPress: close },
              ],
            })}>
              <Text style={styles.sectionLink}>VIEW ALL →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.flightLogScroll}>
            {[
              { from: 'RJTT', to: 'KLAX', airline: 'JAL', date: '28 JUN', class: 'J' },
              { from: 'KLAX', to: 'EGLL', airline: 'BA', date: '20 JUN', class: 'Y' },
              { from: 'EGLL', to: 'OMDB', airline: 'EK', date: '14 JUN', class: 'F' },
              { from: 'OMDB', to: 'RJTT', airline: 'EK', date: '08 JUN', class: 'J' },
            ].map((f, i) => (
              <GlassCard key={i} style={styles.logCard}>
                <Text style={styles.logRoute}>{f.from} → {f.to}</Text>
                <Text style={styles.logAirline}>{f.airline}</Text>
                <View style={[styles.classBadge, f.class === 'F' ? styles.classF : f.class === 'J' ? styles.classJ : styles.classY]}>
                  <Text style={styles.classText}>{f.class}</Text>
                </View>
                <Text style={styles.logDate}>{f.date}</Text>
              </GlassCard>
            ))}
          </ScrollView>
        </View>

        {/* Collection */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>◈ COLLECTION</Text>
          </View>
          {/* Collection tabs */}
          <View style={styles.colTabs}>
            {(['aircraft', 'airlines', 'airports'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setColTab(t)}
                style={[styles.colTab, colTab === t && styles.colTabActive]}
              >
                <Text style={[styles.colTabText, colTab === t && styles.colTabTextActive]}>
                  {t.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {colTab === 'aircraft' && (
            <View style={styles.aircraftGrid}>
              {AIRCRAFT_LOG.map((a) => (
                <TouchableOpacity key={a.id} style={styles.aircraftCell} onPress={() => setSheet({
                  visible: true,
                  title: a.type,
                  subtitle: `${a.icao} · Spotted ${a.count} times`,
                  actions: [
                    { label: 'Track This Aircraft', sublabel: 'Watch for it on radar', icon: 'radar', color: Colors.amber, onPress: close },
                    { label: 'View All Spots', sublabel: 'See your photos of this type', icon: 'image-multiple', color: Colors.cyan, onPress: close },
                    { label: 'Add to Watchlist', sublabel: 'Get notified when nearby', icon: 'bell-plus', color: Colors.green, onPress: close },
                  ],
                })}>
                  <Image source={{ uri: a.image }} style={styles.aircraftThumb} />
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.aircraftOverlay}>
                    <Text style={styles.aircraftType}>{a.icao}</Text>
                    <Text style={styles.aircraftCount}>×{a.count}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.aircraftAddCell}>
                <Ionicons name="add" size={24} color={Colors.textMuted} />
                <Text style={styles.addText}>143 more</Text>
              </TouchableOpacity>
            </View>
          )}

          {colTab === 'airlines' && (
            <View style={styles.airlineList}>
              {['Japan Airlines', 'ANA', 'Emirates', 'British Airways', 'Singapore Airlines', 'Cathay Pacific'].map((a, i) => (
                <View key={i} style={styles.airlineRow}>
                  <View style={styles.airlineDot} />
                  <Text style={styles.airlineName}>{a}</Text>
                  <Text style={styles.airlineCount}>{Math.floor(Math.random() * 30) + 1} spots</Text>
                </View>
              ))}
            </View>
          )}

          {colTab === 'airports' && (
            <View style={styles.airlineList}>
              {['RJTT — Tokyo Narita', 'KLAX — Los Angeles', 'EGLL — London Heathrow', 'OMDB — Dubai', 'YSSY — Sydney', 'KJFK — New York JFK'].map((a, i) => (
                <View key={i} style={styles.airlineRow}>
                  <MaterialCommunityIcons name="airport" size={12} color={Colors.cyan} />
                  <Text style={styles.airlineName}>{a}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Posted photos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>◈ POSTED</Text>
          <View style={styles.photoGrid}>
            {POSTS.map((p) => (
              <TouchableOpacity key={p.id} style={styles.photoCell} onPress={() => setSheet({
                visible: true,
                title: p.icaoType,
                subtitle: p.caption,
                actions: [
                  { label: 'View Full Post', sublabel: 'Open in feed', icon: 'eye', color: Colors.amber, onPress: close },
                  { label: 'Share Photo', sublabel: 'Send to your crew', icon: 'share-variant', color: Colors.cyan, onPress: close },
                  { label: 'Delete Post', sublabel: 'Remove from your profile', icon: 'delete', color: Colors.red, destructive: true, onPress: close },
                ],
              })}>
                <Image source={{ uri: p.image }} style={styles.photoThumb} />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.photoOverlay}>
                  <Text style={styles.photoType}>{p.icaoType}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <ActionSheet
        visible={sheet.visible}
        onClose={close}
        title={sheet.title}
        subtitle={sheet.subtitle}
        actions={sheet.actions}
      />
    </SafeAreaView>
    </ScreenFade>
  );
}

function StatBox({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View style={statStyles.box}>
      <Text style={[statStyles.value, { color }]}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center', gap: 2 },
  value: { fontFamily: Font.mono, fontSize: 18, fontWeight: '700' },
  label: { fontFamily: Font.mono, fontSize: 7, color: Colors.textMuted, letterSpacing: 0.5 },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  stickyHeader: { zIndex: 10 },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Space.md, paddingVertical: 10 },
  headerLogo: { fontFamily: Font.mono, fontSize: 14, fontWeight: '700', color: Colors.amber, letterSpacing: 1.5 },
  settingsBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  cardBackground: { paddingTop: Space.md, paddingBottom: Space.sm },
  pilotCard: { flexDirection: 'row', paddingHorizontal: Space.md, gap: Space.md, marginBottom: Space.md },
  avatarContainer: { alignItems: 'center', gap: 6 },
  avatarRingOuter: { shadowColor: Colors.amber, shadowOffset: { width: 0, height: 0 }, shadowRadius: 14, shadowOpacity: 0.5, elevation: 8 },
  avatarRing: { width: 82, height: 82, borderRadius: 41, padding: 2.5, alignItems: 'center', justifyContent: 'center' },
  avatarInner: { width: '100%', height: '100%', borderRadius: 38, backgroundColor: Colors.bg, padding: 2, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 68, height: 68, borderRadius: 34 },
  rankBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 3, borderWidth: 1 },
  rankText: { fontFamily: Font.mono, fontSize: 7, letterSpacing: 1 },
  identityBlock: { flex: 1, gap: 4, justifyContent: 'center' },
  callsignRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  callsign: { fontFamily: Font.mono, fontSize: 20, color: Colors.textPrimary, fontWeight: '700', letterSpacing: 1 },
  verifiedBadge: {},
  displayName: { fontFamily: Font.mono, fontSize: 12, color: Colors.textSecondary },
  homeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  homeAirport: { fontFamily: Font.mono, fontSize: 10, color: Colors.textMuted },
  onlineDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.green, shadowColor: Colors.green, shadowOpacity: 0.8, shadowRadius: 3, marginLeft: 4 },
  onlineText: { fontFamily: Font.mono, fontSize: 8, color: Colors.green },
  editBtn: { marginTop: 2, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bgElevated },
  editText: { fontFamily: Font.mono, fontSize: 9, color: Colors.textSecondary, letterSpacing: 1 },
  statsRow: { flexDirection: 'row', paddingHorizontal: Space.md, paddingVertical: 12, borderTopWidth: 1, borderTopColor: Colors.border, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: Colors.border, marginVertical: 4 },
  section: { paddingHorizontal: Space.md, paddingTop: Space.md },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Space.sm },
  sectionTitle: { fontFamily: Font.mono, fontSize: 10, color: Colors.textAmber, letterSpacing: 2, marginBottom: Space.sm },
  sectionLink: { fontFamily: Font.mono, fontSize: 9, color: Colors.cyan },
  flightLogScroll: { gap: 8, paddingBottom: 4 },
  logCard: { width: 110, gap: 3 },
  logRoute: { fontFamily: Font.mono, fontSize: 11, color: Colors.textPrimary },
  logAirline: { fontFamily: Font.mono, fontSize: 10, color: Colors.textSecondary },
  classBadge: { alignSelf: 'flex-start', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 3, borderWidth: 1, marginTop: 2 },
  classF: { backgroundColor: 'rgba(139,92,246,0.2)', borderColor: '#8B5CF660' },
  classJ: { backgroundColor: Colors.amberDim, borderColor: Colors.borderAmber },
  classY: { backgroundColor: Colors.bgElevated, borderColor: Colors.border },
  classText: { fontFamily: Font.mono, fontSize: 9, color: Colors.textPrimary },
  logDate: { fontFamily: Font.mono, fontSize: 8, color: Colors.textMuted, marginTop: 2 },
  colTabs: { flexDirection: 'row', gap: 0, marginBottom: Space.sm, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, overflow: 'hidden' },
  colTab: { flex: 1, paddingVertical: 7, alignItems: 'center', backgroundColor: Colors.bgCard },
  colTabActive: { backgroundColor: Colors.amberDim },
  colTabText: { fontFamily: Font.mono, fontSize: 9, color: Colors.textMuted, letterSpacing: 0.5 },
  colTabTextActive: { color: Colors.amber },
  aircraftGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  aircraftCell: { width: GRID_SIZE, height: GRID_SIZE * 0.7, borderRadius: Radius.sm, overflow: 'hidden', backgroundColor: Colors.bgElevated },
  aircraftThumb: { width: '100%', height: '100%' },
  aircraftOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 4 },
  aircraftType: { fontFamily: Font.mono, fontSize: 9, color: Colors.amber },
  aircraftCount: { fontFamily: Font.mono, fontSize: 8, color: Colors.textSecondary },
  aircraftAddCell: { width: GRID_SIZE, height: GRID_SIZE * 0.7, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bgCard, gap: 2 },
  addText: { fontFamily: Font.mono, fontSize: 8, color: Colors.textMuted },
  airlineList: { gap: 1 },
  airlineRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  airlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.amber },
  airlineName: { fontFamily: Font.mono, fontSize: 11, color: Colors.textSecondary, flex: 1 },
  airlineCount: { fontFamily: Font.mono, fontSize: 9, color: Colors.textMuted },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  photoCell: { width: GRID_SIZE, height: GRID_SIZE, borderRadius: Radius.sm, overflow: 'hidden', backgroundColor: Colors.bgElevated },
  photoThumb: { width: '100%', height: '100%' },
  photoOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 4 },
  photoType: { fontFamily: Font.mono, fontSize: 9, color: Colors.amber },
});

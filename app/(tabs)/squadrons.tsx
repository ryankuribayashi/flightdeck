import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ui/ScreenHeader';
import GlassCard from '../../components/ui/GlassCard';
import ActionSheet from '../../components/ui/ActionSheet';
import ScreenFade from '../../components/ui/ScreenFade';
import { Colors, Font, Space, Radius } from '../../constants/theme';
import { SQUADRONS, type Squadron } from '../../constants/mockData';

const DISCOVER = [
  { name: 'EGLL SPOTTERS', tag: 'LHR', color: Colors.blue },
  { name: '747 CHASERS', tag: 'B74S', color: Colors.amber },
  { name: 'CARGO CREW', tag: 'CGO', color: Colors.green },
  { name: 'RETRO LIVERY', tag: 'RETRO', color: Colors.purple },
  { name: 'OMDB WATCHERS', tag: 'DXB', color: Colors.cyan },
  { name: 'NIGHT OPS', tag: 'NGHT', color: Colors.red },
];

function SquadronCard({ squad, onPress }: { squad: Squadron; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <GlassCard style={styles.squadCard} noPadding>
        {/* Color accent left bar */}
        <View style={[styles.accentBar, { backgroundColor: squad.color }]} />
        <View style={styles.squadContent}>
          <View style={styles.squadHeader}>
            <Image source={{ uri: squad.image }} style={styles.squadThumb} />
            <View style={styles.squadInfo}>
              <View style={styles.squadNameRow}>
                <Text style={styles.squadName}>{squad.name}</Text>
                {squad.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{squad.unread}</Text>
                  </View>
                )}
              </View>
              <View style={styles.squadMeta}>
                <View style={[styles.tailCodeBadge, { borderColor: squad.color + '60' }]}>
                  <Text style={[styles.tailCode, { color: squad.color }]}>{squad.tailCode}</Text>
                </View>
                <Text style={styles.memberCount}>{squad.members} members</Text>
              </View>
            </View>
          </View>
          <View style={styles.lastMessage}>
            <Text style={styles.lastUser}>{squad.lastUser}: </Text>
            <Text style={styles.lastText} numberOfLines={1}>{squad.lastMessage}</Text>
            <Text style={styles.lastTime}>{squad.timeAgo}</Text>
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

type SheetState = { visible: boolean; title: string; subtitle?: string; actions: Parameters<typeof ActionSheet>[0]['actions'] };
const SHEET_CLOSED: SheetState = { visible: false, title: '', actions: [] };

export default function SquadronsScreen() {
  const [sheet, setSheet] = useState<SheetState>(SHEET_CLOSED);
  const close = () => setSheet(SHEET_CLOSED);

  return (
    <ScreenFade>
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        subtitle="SQUADRONS"
        rightElement={
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => setSheet({
              visible: true,
              title: 'CREATE SQUADRON',
              subtitle: 'Start a new crew for your spotting hub',
              actions: [
                { label: 'Name & Tail Code', sublabel: 'Choose callsign and ICAO code', icon: 'pencil', color: Colors.amber, onPress: close },
                { label: 'Pick Color', sublabel: 'Set your squadron accent color', icon: 'palette', color: Colors.purple, onPress: close },
                { label: 'Invite Members', sublabel: 'Add spotters from your network', icon: 'account-multiple-plus', color: Colors.cyan, onPress: close },
              ],
            })}
          >
            <Ionicons name="add" size={14} color={Colors.amber} />
            <Text style={styles.createText}>CREATE</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Active challenge banner */}
        <LinearGradient
          colors={[Colors.amberDim, 'transparent']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.challengeBanner}
        >
          <MaterialCommunityIcons name="trophy" size={16} color={Colors.amber} />
          <Text style={styles.challengeText}>Weekly Challenge: First to 10 widebody spots wins 500 XP</Text>
          <MaterialCommunityIcons name="chevron-right" size={14} color={Colors.amber} />
        </LinearGradient>

        {/* My Squadrons */}
        <Text style={styles.sectionTitle}>◈ MY SQUADRONS</Text>
        {SQUADRONS.map((s) => (
          <SquadronCard
            key={s.id}
            squad={s}
            onPress={() => setSheet({
              visible: true,
              title: s.name,
              subtitle: `${s.members} members · ${s.tailCode}`,
              actions: [
                { label: 'Open Chat', sublabel: 'View group messages', icon: 'chat', color: Colors.amber, onPress: close },
                { label: 'View Members', sublabel: 'See who is in this squadron', icon: 'account-group', color: Colors.cyan, onPress: close },
                { label: 'Squadron Board', sublabel: 'Leaderboard and challenges', icon: 'trophy', color: Colors.purple, onPress: close },
                { label: 'Leave Squadron', sublabel: 'Remove yourself from the squad', icon: 'exit-run', color: Colors.red, destructive: true, onPress: close },
              ],
            })}
          />
        ))}

        {/* Discover */}
        <Text style={[styles.sectionTitle, { marginTop: Space.lg }]}>◈ DISCOVER</Text>
        <View style={styles.discoverGrid}>
          {DISCOVER.map((d) => (
            <TouchableOpacity
              key={d.name}
              style={[styles.discoverChip, { borderColor: d.color + '50' }]}
              onPress={() => setSheet({
                visible: true,
                title: d.name,
                subtitle: `Tag: ${d.tag} · Open squadron`,
                actions: [
                  { label: 'Join Squadron', sublabel: 'Request to join this crew', icon: 'account-plus', color: d.color, onPress: close },
                  { label: 'Preview Members', sublabel: 'See who is already in', icon: 'account-group', color: Colors.cyan, onPress: close },
                ],
              })}
            >
              <View style={[styles.discoverDot, { backgroundColor: d.color }]} />
              <View>
                <Text style={styles.discoverName}>{d.name}</Text>
                <Text style={[styles.discoverTag, { color: d.color }]}>{d.tag}</Text>
              </View>
              <Ionicons name="add-circle-outline" size={18} color={d.color} style={styles.joinIcon} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Nearby Spotters */}
        <Text style={[styles.sectionTitle, { marginTop: Space.lg }]}>◈ AT YOUR AIRPORT NOW</Text>
        <GlassCard style={styles.nearbyCard}>
          <View style={styles.nearbyRow}>
            <MaterialCommunityIcons name="map-marker-radius" size={14} color={Colors.cyan} />
            <Text style={styles.nearbyAirport}>RJTT — Tokyo Narita</Text>
            <Text style={styles.nearbyCount}>4 spotters</Text>
          </View>
          <View style={styles.nearbyAvatars}>
            {['https://i.pravatar.cc/100?img=3', 'https://i.pravatar.cc/100?img=7', 'https://i.pravatar.cc/100?img=12', 'https://i.pravatar.cc/100?img=20'].map((url, i) => (
              <Image key={i} source={{ uri: url }} style={[styles.nearbyAvatar, { marginLeft: i > 0 ? -10 : 0 }]} />
            ))}
            <TouchableOpacity
              style={styles.nearbyJoin}
              onPress={() => setSheet({
                visible: true,
                title: 'CHECK IN AT RJTT',
                subtitle: 'Tokyo Narita · 4 spotters active',
                actions: [
                  { label: 'Check In Here', sublabel: 'Let nearby spotters see you', icon: 'map-marker-check', color: Colors.green, onPress: close },
                  { label: 'Go Incognito', sublabel: 'Check in without showing location', icon: 'incognito', color: Colors.textMuted, onPress: close },
                ],
              })}
            >
              <Text style={styles.nearbyJoinText}>CHECK IN</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        <View style={{ height: 40 }} />
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Space.md, paddingBottom: 100 },
  createBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.amberDim, paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.borderAmber,
  },
  createText: { fontFamily: Font.mono, fontSize: 9, color: Colors.amber, letterSpacing: 1 },
  challengeBanner: {
    flexDirection: 'row', alignItems: 'center', padding: 10,
    borderRadius: Radius.md, marginBottom: Space.md, gap: 8,
    borderWidth: 1, borderColor: Colors.borderAmber,
  },
  challengeText: { fontFamily: Font.mono, fontSize: 10, color: Colors.textSecondary, flex: 1 },
  sectionTitle: { fontFamily: Font.mono, fontSize: 10, color: Colors.textAmber, letterSpacing: 2, marginBottom: Space.sm },
  squadCard: { marginBottom: 8, overflow: 'hidden', flexDirection: 'row' },
  accentBar: { width: 3, borderRadius: 0 },
  squadContent: { flex: 1, padding: 12 },
  squadHeader: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  squadThumb: { width: 44, height: 44, borderRadius: Radius.sm, backgroundColor: Colors.bgElevated },
  squadInfo: { flex: 1, gap: 4 },
  squadNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  squadName: { fontFamily: Font.mono, fontSize: 12, color: Colors.textPrimary, fontWeight: '700', flex: 1 },
  unreadBadge: {
    minWidth: 18, height: 18, borderRadius: 9, backgroundColor: Colors.amber,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  unreadText: { fontFamily: Font.mono, fontSize: 9, color: '#000', fontWeight: '700' },
  squadMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tailCodeBadge: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 3, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.03)' },
  tailCode: { fontFamily: Font.mono, fontSize: 9, fontWeight: '700' },
  memberCount: { fontFamily: Font.mono, fontSize: 9, color: Colors.textMuted },
  lastMessage: { flexDirection: 'row', alignItems: 'center' },
  lastUser: { fontFamily: Font.mono, fontSize: 10, color: Colors.amber },
  lastText: { fontFamily: Font.mono, fontSize: 10, color: Colors.textSecondary, flex: 1 },
  lastTime: { fontFamily: Font.mono, fontSize: 9, color: Colors.textMuted, marginLeft: 4 },
  discoverGrid: { gap: 8 },
  discoverChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.bgCard, borderWidth: 1,
    padding: 10, borderRadius: Radius.md,
  },
  discoverDot: { width: 8, height: 8, borderRadius: 4 },
  discoverName: { fontFamily: Font.mono, fontSize: 11, color: Colors.textPrimary },
  discoverTag: { fontFamily: Font.mono, fontSize: 8, letterSpacing: 1 },
  joinIcon: { marginLeft: 'auto' },
  nearbyCard: {},
  nearbyRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  nearbyAirport: { fontFamily: Font.mono, fontSize: 11, color: Colors.textPrimary, flex: 1 },
  nearbyCount: { fontFamily: Font.mono, fontSize: 10, color: Colors.cyan },
  nearbyAvatars: { flexDirection: 'row', alignItems: 'center' },
  nearbyAvatar: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, borderColor: Colors.bg },
  nearbyJoin: {
    marginLeft: 12, paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.borderCyan,
    backgroundColor: Colors.cyanDim,
  },
  nearbyJoinText: { fontFamily: Font.mono, fontSize: 9, color: Colors.cyan, letterSpacing: 1 },
});

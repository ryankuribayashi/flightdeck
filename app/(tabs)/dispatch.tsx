import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ui/ScreenHeader';
import GlassCard from '../../components/ui/GlassCard';
import ActionSheet from '../../components/ui/ActionSheet';
import ScreenFade from '../../components/ui/ScreenFade';
import { Colors, Font, Space, Radius } from '../../constants/theme';
import { NEWS, HUB_WEATHER, HISTORY_TODAY, CHALLENGES } from '../../constants/mockData';

function WeatherBadge({ icao, city, temp, icon }: { icao: string; city: string; temp: string; icon: string }) {
  return (
    <View style={weatherStyles.badge}>
      <Text style={weatherStyles.icon}>{icon}</Text>
      <Text style={weatherStyles.icao}>{icao}</Text>
      <Text style={weatherStyles.temp}>{temp}</Text>
    </View>
  );
}

const weatherStyles = StyleSheet.create({
  badge: { alignItems: 'center', gap: 2, minWidth: 52 },
  icon: { fontSize: 18 },
  icao: { fontFamily: Font.mono, fontSize: 9, color: Colors.textAmber, letterSpacing: 0.5 },
  temp: { fontFamily: Font.mono, fontSize: 10, color: Colors.textPrimary },
});

type SheetState = { visible: boolean; title: string; subtitle?: string; actions: Parameters<typeof ActionSheet>[0]['actions'] };
const SHEET_CLOSED: SheetState = { visible: false, title: '', actions: [] };

export default function DispatchScreen() {
  const [sheet, setSheet] = useState<SheetState>(SHEET_CLOSED);
  const close = () => setSheet(SHEET_CLOSED);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <ScreenFade>
    <SafeAreaView style={styles.safe}>
      <ScreenHeader subtitle="DAILY DISPATCH" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Briefing header */}
        <LinearGradient
          colors={['rgba(240,160,32,0.08)', 'transparent']}
          style={styles.briefingHeader}
        >
          <View style={styles.briefingTitleRow}>
            <MaterialCommunityIcons name="broadcast" size={16} color={Colors.amber} />
            <Text style={styles.briefingTitle}>MORNING BRIEFING</Text>
            <View style={styles.briefingDateRight}>
              <Text style={styles.briefingDate}>{dateStr}</Text>
              <Text style={styles.briefingTime}>{timeStr}Z</Text>
            </View>
          </View>
          <Text style={styles.briefingSubtitle}>All times UTC · Data sources: AviationStack, ch-aviation, Simple Flying</Text>
        </LinearGradient>

        {/* Hub weather */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>◈ HUB WEATHER</Text>
          <Text style={styles.metar}>METAR/TAF</Text>
        </View>
        <GlassCard noPadding style={styles.weatherCard}>
          <LinearGradient colors={['rgba(0,212,255,0.05)', 'transparent']} style={styles.weatherInner}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weatherScroll}>
              {HUB_WEATHER.map((w) => (
                <WeatherBadge key={w.icao} icao={w.icao} city={w.city} temp={w.temp} icon={w.icon} />
              ))}
            </ScrollView>
          </LinearGradient>
        </GlassCard>

        {/* Weekly challenges */}
        <Text style={styles.sectionTitle}>◈ WEEKLY CHALLENGES</Text>
        {CHALLENGES.map((c) => (
          <TouchableOpacity key={c.id} onPress={() => setSheet({
            visible: true,
            title: c.title,
            subtitle: c.desc,
            actions: [
              { label: 'View Progress', sublabel: `${c.progress}/${c.total} completed`, icon: 'chart-line', color: Colors.amber, onPress: close },
              { label: 'Share Challenge', sublabel: 'Post to your squadron feed', icon: 'share-variant', color: Colors.cyan, onPress: close },
            ],
          })}>
            <GlassCard style={styles.challengeCard}>
              <View style={styles.challengeRow}>
                <Text style={styles.challengeBadge}>{c.badge}</Text>
                <View style={styles.challengeInfo}>
                  <View style={styles.challengeTitleRow}>
                    <Text style={styles.challengeTitle}>{c.title}</Text>
                    <Text style={styles.challengeXP}>+{c.xp}XP</Text>
                  </View>
                  <Text style={styles.challengeDesc}>{c.desc}</Text>
                  {/* Progress bar */}
                  <View style={styles.progressRow}>
                    <View style={styles.progressBg}>
                      <LinearGradient
                        colors={[Colors.amber, Colors.amberBright]}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={[styles.progressFill, { width: `${(c.progress / c.total) * 100}%` as any }]}
                      />
                    </View>
                    <Text style={styles.progressText}>{c.progress}/{c.total}</Text>
                  </View>
                </View>
                <View style={styles.challengeTimer}>
                  <Ionicons name="time-outline" size={10} color={Colors.textMuted} />
                  <Text style={styles.timerText}>{c.expires}</Text>
                </View>
              </View>
            </GlassCard>
          </TouchableOpacity>
        ))}

        {/* Top News */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>◈ TOP STORIES</Text>
          <TouchableOpacity><Text style={styles.viewAll}>VIEW ALL</Text></TouchableOpacity>
        </View>

        {NEWS.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => setSheet({
            visible: true,
            title: item.headline,
            subtitle: `${item.source} · ${item.timeAgo}`,
            actions: [
              { label: 'Read Full Story', sublabel: 'Open in browser', icon: 'open-in-new', color: Colors.amber, onPress: close },
              { label: 'Share Story', sublabel: 'Post to your feed', icon: 'share-variant', color: Colors.cyan, onPress: close },
              { label: 'Save Offline', sublabel: 'Add to your reading list', icon: 'bookmark-plus', color: Colors.green, onPress: close },
            ],
          })} activeOpacity={0.8}>
            <GlassCard noPadding style={styles.newsCard}>
              <Image source={{ uri: item.image }} style={styles.newsImage} />
              <LinearGradient
                colors={['transparent', 'rgba(8,11,16,0.95)']}
                style={styles.newsGradient}
              />
              <View style={styles.newsContent}>
                <View style={styles.newsTagRow}>
                  <View style={styles.newsTag}>
                    <Text style={styles.newsTagText}>{item.tag}</Text>
                  </View>
                  <Text style={styles.newsSource}>{item.source}</Text>
                  <Text style={styles.newsTime}>{item.timeAgo}</Text>
                </View>
                <Text style={styles.newsHeadline} numberOfLines={2}>{item.headline}</Text>
                <Text style={styles.newsSummary} numberOfLines={2}>{item.summary}</Text>
              </View>
            </GlassCard>
          </TouchableOpacity>
        ))}

        {/* On This Day */}
        <GlassCard style={styles.historyCard} glowColor={Colors.purple}>
          <View style={styles.historyHeader}>
            <MaterialCommunityIcons name="history" size={14} color={Colors.purple} />
            <Text style={styles.historyTitle}>ON THIS DAY — {HISTORY_TODAY.date.toUpperCase()}</Text>
          </View>
          {HISTORY_TODAY.events.map((e, i) => (
            <View key={i} style={[styles.historyEvent, i > 0 && styles.historyEventBorder]}>
              <Text style={styles.historyYear}>{e.year}</Text>
              <Text style={styles.historyText}>{e.event}</Text>
            </View>
          ))}
        </GlassCard>

        <View style={{ height: 60 }} />
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
  briefingHeader: {
    padding: 12, borderRadius: Radius.md, marginBottom: Space.md,
    borderWidth: 1, borderColor: Colors.borderAmber,
  },
  briefingTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  briefingTitle: { fontFamily: Font.mono, fontSize: 13, color: Colors.amber, fontWeight: '700', flex: 1 },
  briefingDateRight: { alignItems: 'flex-end' },
  briefingDate: { fontFamily: Font.mono, fontSize: 9, color: Colors.textSecondary },
  briefingTime: { fontFamily: Font.mono, fontSize: 10, color: Colors.textAmber },
  briefingSubtitle: { fontFamily: Font.mono, fontSize: 8, color: Colors.textMuted, lineHeight: 12 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Space.sm },
  sectionTitle: { fontFamily: Font.mono, fontSize: 10, color: Colors.textAmber, letterSpacing: 2, marginBottom: Space.sm },
  metar: { fontFamily: Font.mono, fontSize: 9, color: Colors.cyan },
  viewAll: { fontFamily: Font.mono, fontSize: 9, color: Colors.cyan },
  weatherCard: { marginBottom: Space.md },
  weatherInner: { padding: 14 },
  weatherScroll: { gap: 16, paddingVertical: 4 },
  challengeCard: { marginBottom: 8 },
  challengeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  challengeBadge: { fontSize: 22, lineHeight: 28 },
  challengeInfo: { flex: 1, gap: 3 },
  challengeTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  challengeTitle: { fontFamily: Font.mono, fontSize: 11, color: Colors.textPrimary, fontWeight: '700', flex: 1 },
  challengeXP: { fontFamily: Font.mono, fontSize: 9, color: Colors.green },
  challengeDesc: { fontFamily: Font.mono, fontSize: 9, color: Colors.textSecondary },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  progressBg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.bgElevated, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  progressText: { fontFamily: Font.mono, fontSize: 9, color: Colors.textMuted },
  challengeTimer: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 },
  timerText: { fontFamily: Font.mono, fontSize: 8, color: Colors.textMuted },
  newsCard: { marginBottom: 10, overflow: 'hidden' },
  newsImage: { width: '100%', height: 160, backgroundColor: Colors.bgElevated },
  newsGradient: { position: 'absolute', top: 80, left: 0, right: 0, height: 80 },
  newsContent: { padding: 12, gap: 5 },
  newsTagRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  newsTag: {
    backgroundColor: Colors.amberDim, paddingHorizontal: 5, paddingVertical: 1,
    borderRadius: 3, borderWidth: 1, borderColor: Colors.borderAmber,
  },
  newsTagText: { fontFamily: Font.mono, fontSize: 7, color: Colors.amber, letterSpacing: 0.5 },
  newsSource: { fontFamily: Font.mono, fontSize: 9, color: Colors.textMuted, flex: 1 },
  newsTime: { fontFamily: Font.mono, fontSize: 9, color: Colors.textMuted },
  newsHeadline: { fontFamily: Font.mono, fontSize: 13, color: Colors.textPrimary, lineHeight: 18 },
  newsSummary: { fontFamily: Font.mono, fontSize: 10, color: Colors.textSecondary, lineHeight: 15 },
  historyCard: { marginTop: 8 },
  historyHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  historyTitle: { fontFamily: Font.mono, fontSize: 9, color: Colors.purple, letterSpacing: 1.5 },
  historyEvent: { gap: 2, paddingVertical: 8 },
  historyEventBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
  historyYear: { fontFamily: Font.mono, fontSize: 13, color: Colors.amber, fontWeight: '700' },
  historyText: { fontFamily: Font.mono, fontSize: 10, color: Colors.textSecondary, lineHeight: 15 },
});

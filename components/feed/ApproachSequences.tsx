import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Font, Space, Radius } from '../../constants/theme';
import type { Story } from '../../constants/mockData';

type Props = {
  stories: Story[];
  onAddPress: () => void;
  onStoryPress: (story: Story) => void;
};

function StoryBubble({ story, onPress }: { story: Story; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.storyTouch}>
      <View style={styles.storyOuter}>
        {/* Glow ring */}
        <LinearGradient
          colors={
            story.live
              ? [Colors.red, Colors.amber]
              : story.seen
              ? ['#1E2838', '#1E2838']
              : [Colors.amber, Colors.cyan]
          }
          style={styles.ring}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.ringInner}>
            <Image source={{ uri: story.avatar }} style={styles.avatar} />
            {story.live && (
              <View style={styles.liveBadge}>
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </View>
      <Text style={styles.airportCode}>{story.airport}</Text>
      <Text style={styles.username} numberOfLines={1}>{story.callsign}</Text>
    </TouchableOpacity>
  );
}

export default function ApproachSequences({ stories, onAddPress, onStoryPress }: Props) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLine} />
        <Text style={styles.headerText}>APPROACH SEQUENCES</Text>
        <View style={styles.headerLine} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Add story button */}
        <TouchableOpacity onPress={onAddPress} style={styles.storyTouch}>
          <View style={[styles.addRing]}>
            <LinearGradient
              colors={[Colors.bgCard, Colors.bgElevated]}
              style={styles.addInner}
            >
              <Ionicons name="add" size={22} color={Colors.amber} />
            </LinearGradient>
          </View>
          <Text style={styles.airportCode}>ADD</Text>
          <Text style={styles.username}>instant</Text>
        </TouchableOpacity>

        {stories.map((s) => (
          <StoryBubble key={s.id} story={s} onPress={() => onStoryPress(s)} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Space.sm,
    paddingBottom: Space.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Space.md,
    marginBottom: 10,
    gap: 8,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderAmber,
    opacity: 0.4,
  },
  headerText: {
    fontFamily: Font.mono,
    fontSize: 9,
    color: Colors.textAmber,
    letterSpacing: 2,
  },
  scroll: {
    paddingHorizontal: Space.md,
    gap: 12,
  },
  storyTouch: {
    alignItems: 'center',
    width: 64,
  },
  storyOuter: {
    marginBottom: 4,
  },
  ring: {
    width: 62,
    height: 62,
    borderRadius: 31,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    backgroundColor: Colors.bg,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  liveBadge: {
    position: 'absolute',
    bottom: -2,
    backgroundColor: Colors.red,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.bg,
  },
  liveText: {
    fontFamily: Font.mono,
    fontSize: 6,
    color: '#fff',
    letterSpacing: 0.5,
  },
  addRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1.5,
    borderColor: Colors.borderAmber,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    overflow: 'hidden',
  },
  addInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 31,
  },
  airportCode: {
    fontFamily: Font.mono,
    fontSize: 9,
    color: Colors.textAmber,
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  username: {
    fontFamily: Font.mono,
    fontSize: 8,
    color: Colors.textMuted,
    maxWidth: 60,
    textAlign: 'center',
  },
});

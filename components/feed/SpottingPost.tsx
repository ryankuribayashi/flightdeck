import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Font, Space, Radius } from '../../constants/theme';
import type { Post } from '../../constants/mockData';

const { width } = Dimensions.get('window');
const IMAGE_H = width * 0.58;

type Props = {
  post: Post;
  onLike?: () => void;
  onTrack?: () => void;
  onCollect?: () => void;
};

export default function SpottingPost({ post, onLike, onTrack, onCollect }: Props) {
  const [liked, setLiked] = useState(false);
  const [collected, setCollected] = useState(false);
  const heartScale = useSharedValue(1);
  const collectScale = useSharedValue(1);

  const heartStyle = useAnimatedStyle(() => ({ transform: [{ scale: heartScale.value }] }));
  const collectStyle = useAnimatedStyle(() => ({ transform: [{ scale: collectScale.value }] }));

  const handleLike = () => {
    setLiked((v) => !v);
    heartScale.value = withSequence(
      withSpring(1.3, { damping: 8 }),
      withSpring(1, { damping: 12 })
    );
    onLike?.();
  };

  const handleCollect = () => {
    setCollected((v) => !v);
    collectScale.value = withSequence(
      withSpring(1.3, { damping: 8 }),
      withSpring(1, { damping: 12 })
    );
    onCollect?.();
  };

  return (
    <View style={styles.card}>
      {/* Post header */}
      <View style={styles.header}>
        <Image source={{ uri: post.avatar }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.callsign}>{post.callsign}</Text>
          <Text style={styles.username}>@{post.username}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.airportBadge}>
            <MaterialCommunityIcons name="airport" size={10} color={Colors.cyan} />
            <Text style={styles.airportText}>{post.airport}</Text>
          </View>
          <Text style={styles.time}>{post.timeAgo}</Text>
        </View>
      </View>

      {/* Image with HUD overlay */}
      <View style={styles.imageWrap}>
        <Image source={{ uri: post.image }} style={styles.image} resizeMode="cover" />

        {/* Badges */}
        <View style={styles.badgeRow}>
          {post.isLive && (
            <View style={[styles.badge, styles.liveBadge]}>
              <View style={styles.liveDot} />
              <Text style={styles.badgeText}>LIVE</Text>
            </View>
          )}
          {post.isInstant && (
            <View style={[styles.badge, styles.instantBadge]}>
              <MaterialCommunityIcons name="camera-burst" size={9} color={Colors.cyan} />
              <Text style={[styles.badgeText, { color: Colors.cyan }]}>INSTANT</Text>
            </View>
          )}
        </View>

        {/* HUD data overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          style={styles.hudGradient}
        >
          <View style={styles.hud}>
            <View style={styles.hudTop}>
              <View style={styles.hudLeft}>
                <Text style={styles.hudType}>{post.icaoType}</Text>
                <Text style={styles.hudAircraft}>{post.aircraft}</Text>
              </View>
              <View style={styles.hudRight}>
                <Text style={styles.hudAirline}>{post.airline}</Text>
                <Text style={styles.hudFlight}>{post.flightNum}</Text>
              </View>
            </View>
            <View style={styles.hudDivider} />
            <View style={styles.hudBottom}>
              <View style={styles.hudStat}>
                <Text style={styles.hudStatLabel}>ROUTE</Text>
                <Text style={styles.hudStatValue}>{post.origin} → {post.destination}</Text>
              </View>
              <View style={styles.hudStat}>
                <Text style={styles.hudStatLabel}>ALT</Text>
                <Text style={styles.hudStatValue}>{post.altitude}</Text>
              </View>
              <View style={styles.hudStat}>
                <Text style={styles.hudStatLabel}>SPD</Text>
                <Text style={styles.hudStatValue}>{post.speed}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Caption */}
      {post.caption && (
        <Text style={styles.caption} numberOfLines={2}>{post.caption}</Text>
      )}

      {/* Action bar */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike} style={styles.action}>
          <Animated.View style={heartStyle}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={20}
              color={liked ? Colors.red : Colors.textSecondary}
            />
          </Animated.View>
          <Text style={styles.actionCount}>{liked ? post.likes + 1 : post.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onTrack} style={styles.action}>
          <MaterialCommunityIcons name="radar" size={20} color={Colors.textSecondary} />
          <Text style={styles.actionLabel}>TRACK</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCollect} style={styles.action}>
          <Animated.View style={collectStyle}>
            <MaterialCommunityIcons
              name={collected ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={collected ? Colors.amber : Colors.textSecondary}
            />
          </Animated.View>
          <Text style={styles.actionLabel}>COLLECT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <Ionicons name="share-outline" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.action, styles.actionRight]}>
          <Ionicons name="ellipsis-horizontal" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginBottom: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Space.md,
    paddingBottom: 10,
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: Colors.borderAmber,
  },
  headerInfo: {
    flex: 1,
    gap: 1,
  },
  callsign: {
    fontFamily: Font.mono,
    fontSize: 12,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  username: {
    fontFamily: Font.mono,
    fontSize: 10,
    color: Colors.textMuted,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  airportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cyanDim,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.borderCyan,
    gap: 3,
  },
  airportText: {
    fontFamily: Font.mono,
    fontSize: 9,
    color: Colors.cyan,
    letterSpacing: 0.5,
  },
  time: {
    fontFamily: Font.mono,
    fontSize: 9,
    color: Colors.textMuted,
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: IMAGE_H,
    backgroundColor: Colors.bgElevated,
  },
  badgeRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    gap: 3,
  },
  liveBadge: {
    backgroundColor: 'rgba(255,68,68,0.85)',
    borderWidth: 1,
    borderColor: Colors.red,
  },
  instantBadge: {
    backgroundColor: 'rgba(0,212,255,0.15)',
    borderWidth: 1,
    borderColor: Colors.cyan,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#fff',
  },
  badgeText: {
    fontFamily: Font.mono,
    fontSize: 8,
    color: '#fff',
    letterSpacing: 0.5,
  },
  hudGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 40,
  },
  hud: {
    padding: 10,
  },
  hudTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  hudLeft: {
    gap: 1,
  },
  hudRight: {
    alignItems: 'flex-end',
    gap: 1,
  },
  hudType: {
    fontFamily: Font.mono,
    fontSize: 16,
    color: Colors.amber,
    fontWeight: '700',
    letterSpacing: 1,
  },
  hudAircraft: {
    fontFamily: Font.mono,
    fontSize: 9,
    color: Colors.textSecondary,
  },
  hudAirline: {
    fontFamily: Font.mono,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  hudFlight: {
    fontFamily: Font.mono,
    fontSize: 9,
    color: Colors.textSecondary,
  },
  hudDivider: {
    height: 0.5,
    backgroundColor: Colors.borderAmber,
    opacity: 0.4,
    marginVertical: 5,
  },
  hudBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hudStat: {
    gap: 1,
  },
  hudStatLabel: {
    fontFamily: Font.mono,
    fontSize: 7,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  hudStatValue: {
    fontFamily: Font.mono,
    fontSize: 10,
    color: Colors.cyan,
  },
  caption: {
    fontFamily: Font.mono,
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
    padding: Space.md,
    paddingTop: 8,
    paddingBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Space.md,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 16,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionRight: {
    marginLeft: 'auto',
  },
  actionCount: {
    fontFamily: Font.mono,
    fontSize: 10,
    color: Colors.textSecondary,
  },
  actionLabel: {
    fontFamily: Font.mono,
    fontSize: 9,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
});

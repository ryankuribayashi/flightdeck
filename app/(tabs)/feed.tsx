import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ScreenHeader from '../../components/ui/ScreenHeader';
import ApproachSequences from '../../components/feed/ApproachSequences';
import SpottingPost from '../../components/feed/SpottingPost';
import FloatingWidget from '../../components/ui/FloatingWidget';
import ActionSheet from '../../components/ui/ActionSheet';
import ScreenFade from '../../components/ui/ScreenFade';
import { Colors, Font, Space } from '../../constants/theme';
import { STORIES } from '../../constants/mockData';
import { useStore } from '../../store';
import { usePosts } from '../../lib/hooks/usePosts';

export default function FeedScreen() {
  const liveFlightCount = useStore((s) => s.liveFlightCount);
  const { posts } = usePosts();
  const [cameraSheet, setCameraSheet] = useState(false);

  return (
    <ScreenFade>
      <SafeAreaView style={styles.safe}>
        <ScreenHeader subtitle="LIVE SPOTTING FEED" />

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <ApproachSequences
            stories={STORIES}
            onAddPress={() => setCameraSheet(true)}
            onStoryPress={() => setCameraSheet(true)}
          />

          {posts.map((post) => (
            <SpottingPost
              key={post.id}
              post={post}
              onTrack={() => router.push('/(tabs)/radar')}
            />
          ))}

          <View style={styles.endSpacer}>
            <Text style={styles.endText}>◈ END OF FEED ◈</Text>
          </View>
        </ScrollView>

        {/* Floating live flight counter */}
        <View style={styles.fab}>
          <FloatingWidget flightCount={liveFlightCount} onPress={() => setCameraSheet(true)} />
        </View>

        {/* Instant camera FAB */}
        <TouchableOpacity style={styles.cameraFab} onPress={() => setCameraSheet(true)} activeOpacity={0.85}>
          <LinearGradient colors={[Colors.amber, '#C07818']} style={styles.cameraGrad}>
            <MaterialCommunityIcons name="camera-burst" size={22} color="#000" />
          </LinearGradient>
        </TouchableOpacity>

        <ActionSheet
          visible={cameraSheet}
          onClose={() => setCameraSheet(false)}
          title="POST A SPOTTING SHOT"
          subtitle="Choose how you want to capture this moment"
          actions={[
            {
              label: 'Instant — Front + Rear',
              sublabel: 'BeReal-style dual camera snap',
              icon: 'camera-burst',
              color: Colors.amber,
              onPress: () => router.push('/(modals)/ar-scanner'),
            },
            {
              label: 'Photo from Gallery',
              sublabel: 'Upload an existing shot',
              icon: 'image-multiple',
              color: Colors.cyan,
              onPress: () => {},
            },
            {
              label: 'AR Sky Scanner',
              sublabel: 'Identify and post aircraft overhead',
              icon: 'augmented-reality',
              color: Colors.green,
              onPress: () => router.push('/(modals)/ar-scanner'),
            },
            {
              label: 'Live Story',
              sublabel: 'Add to your Approach Sequence',
              icon: 'broadcast',
              color: Colors.purple,
              onPress: () => {},
            },
          ]}
        />
      </SafeAreaView>
    </ScreenFade>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingBottom: 120 },
  endSpacer: { padding: Space.xl, alignItems: 'center' },
  endText: { fontFamily: Font.mono, fontSize: 9, color: Colors.textMuted, letterSpacing: 2 },
  fab: { position: 'absolute', bottom: 110, right: 16 },
  cameraFab: {
    position: 'absolute', bottom: 110, left: '50%', marginLeft: -26,
    shadowColor: Colors.amber, shadowOffset: { width: 0, height: 0 },
    shadowRadius: 14, shadowOpacity: 0.6, elevation: 10,
  },
  cameraGrad: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
});

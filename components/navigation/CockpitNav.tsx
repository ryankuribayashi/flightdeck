import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors, Font } from '../../constants/theme';

type TabConfig = {
  name: string;
  label: string;
  McIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  IoIcon?: keyof typeof Ionicons.glyphMap;
  IoIconActive?: keyof typeof Ionicons.glyphMap;
};

const TABS: TabConfig[] = [
  { name: 'feed', label: 'FEED', McIcon: 'airplane' },
  { name: 'radar', label: 'RADAR', McIcon: 'radar' },
  { name: 'squadrons', label: 'SQUAD', IoIcon: 'people-outline', IoIconActive: 'people' },
  { name: 'dispatch', label: 'DISP', McIcon: 'broadcast' },
  { name: 'dossier', label: 'ME', McIcon: 'account' },
];

function CockpitButton({ config, active, onPress }: { config: TabConfig; active: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);
  const glow = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    glow.value = withTiming(active ? 1 : 0, { duration: 250 });
  }, [active]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const ledStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0, 1], [0.18, 1]),
    shadowOpacity: interpolate(glow.value, [0, 1], [0, 0.9]),
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.86, { duration: 70 }),
      withSpring(1, { damping: 14, stiffness: 350 })
    );
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const iconColor = active ? Colors.amber : Colors.textMuted;
  const iconSize = 21;

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1} style={styles.touch}>
      <Animated.View style={[styles.buttonWrap, containerStyle]}>
        {/* LED dot */}
        <Animated.View style={[styles.led, ledStyle, active && styles.ledOn]} />

        {/* Button face */}
        <LinearGradient
          colors={active ? ['#1C2638', '#111C2C'] : ['#0F1520', '#0A1018']}
          style={[styles.face, active && styles.faceActive]}
        >
          {config.McIcon ? (
            <MaterialCommunityIcons name={config.McIcon} size={iconSize} color={iconColor} />
          ) : (
            <Ionicons name={active ? config.IoIconActive! : config.IoIcon!} size={iconSize} color={iconColor} />
          )}
          <Text style={[styles.label, active && styles.labelOn]}>{config.label}</Text>
        </LinearGradient>

        {/* Active accent bar */}
        {active && (
          <LinearGradient
            colors={['transparent', Colors.amber, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bar}
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function CockpitNav({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.outer, { paddingBottom: insets.bottom }]}>
      {/* Top amber glow line */}
      <LinearGradient
        colors={['transparent', Colors.amberGlow, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topLine}
      />

      <LinearGradient colors={['#0C1018', '#070A10']} style={styles.panel}>
        {/* Panel corner screws */}
        <View style={styles.screwRow}>
          <View style={styles.screw} />
          <View style={styles.screw} />
        </View>

        <View style={styles.buttonsRow}>
          {state.routes.map((route: { key: string; name: string }, index: number) => {
            const config = TABS.find((t) => t.name === route.name);
            if (!config) return null;
            const active = state.index === index;
            return (
              <CockpitButton
                key={route.key}
                config={config}
                active={active}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!active && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                }}
              />
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: '#070A10',
  },
  topLine: {
    height: 1,
  },
  panel: {
    paddingTop: 6,
    paddingHorizontal: 6,
    paddingBottom: 6,
  },
  screwRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginBottom: 4,
  },
  screw: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#1C2638',
    borderWidth: 0.5,
    borderColor: '#2A3850',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  touch: {
    flex: 1,
    alignItems: 'center',
  },
  buttonWrap: {
    alignItems: 'center',
    width: '92%',
  },
  led: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.amber,
    marginBottom: 3,
    shadowColor: Colors.amber,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    elevation: 4,
  },
  ledOn: {
    backgroundColor: Colors.amberBright,
    shadowColor: Colors.amberBright,
  },
  face: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 2,
    borderRadius: 6,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 2,
  },
  faceActive: {
    borderColor: Colors.borderAmber,
  },
  label: {
    fontFamily: Font.mono,
    fontSize: 8,
    letterSpacing: 0.8,
    color: Colors.textMuted,
  },
  labelOn: {
    color: Colors.amber,
  },
  bar: {
    height: 2,
    width: '75%',
    borderRadius: 1,
    marginTop: 2,
  },
});

import React, { useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
  TouchableWithoutFeedback, ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Font, Radius, Space } from '../../constants/theme';

export type ActionItem = {
  label: string;
  sublabel?: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color?: string;
  onPress: () => void;
  destructive?: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  actions: ActionItem[];
};

export default function ActionSheet({ visible, onClose, title, subtitle, actions }: Props) {
  const translateY = useSharedValue(400);
  const bgOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      bgOpacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 250 });
    } else {
      bgOpacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(400, { duration: 220 });
    }
  }, [visible]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Dimmed overlay */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.overlay, overlayStyle]} />
        </TouchableWithoutFeedback>

        {/* Sheet */}
        <Animated.View style={[styles.sheet, sheetStyle]}>
          <LinearGradient colors={['#16202E', Colors.bgPanel]} style={styles.sheetInner}>
            {/* Handle */}
            <View style={styles.handle} />

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>

            <View style={styles.divider} />

            {/* Actions */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {actions.map((action, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => { onClose(); action.onPress(); }}
                  style={[styles.action, i > 0 && styles.actionBorder]}
                  activeOpacity={0.75}
                >
                  <View style={[
                    styles.iconWrap,
                    { borderColor: (action.color ?? Colors.amber) + '40', backgroundColor: (action.color ?? Colors.amber) + '15' }
                  ]}>
                    <MaterialCommunityIcons
                      name={action.icon}
                      size={18}
                      color={action.destructive ? Colors.red : (action.color ?? Colors.amber)}
                    />
                  </View>
                  <View style={styles.actionText}>
                    <Text style={[styles.actionLabel, action.destructive && { color: Colors.red }]}>
                      {action.label}
                    </Text>
                    {action.sublabel && <Text style={styles.actionSublabel}>{action.sublabel}</Text>}
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={16} color={Colors.textMuted} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Cancel */}
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn} activeOpacity={0.8}>
              <Text style={styles.cancelText}>CANCEL</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 20,
    shadowOpacity: 0.5,
    elevation: 20,
  },
  sheetInner: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderAmber,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: 10, marginBottom: 6,
  },
  header: { paddingHorizontal: Space.md, paddingVertical: Space.sm },
  title: { fontFamily: Font.mono, fontSize: 14, color: Colors.textPrimary, fontWeight: '700', letterSpacing: 0.5 },
  subtitle: { fontFamily: Font.mono, fontSize: 10, color: Colors.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.border },
  action: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Space.md, paddingVertical: 14, gap: 12 },
  actionBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
  iconWrap: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  actionText: { flex: 1 },
  actionLabel: { fontFamily: Font.mono, fontSize: 12, color: Colors.textPrimary },
  actionSublabel: { fontFamily: Font.mono, fontSize: 9, color: Colors.textSecondary, marginTop: 1 },
  cancelBtn: {
    margin: Space.md, marginTop: Space.sm, paddingVertical: 14,
    borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.bgCard, alignItems: 'center',
  },
  cancelText: { fontFamily: Font.mono, fontSize: 12, color: Colors.textSecondary, letterSpacing: 1 },
});

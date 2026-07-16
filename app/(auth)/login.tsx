import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Font, Space, Radius } from '../../constants/theme';
import { useAuth } from '../../lib/hooks/useAuth';
import { isSupabaseConfigured } from '../../lib/supabase';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('AUTHENTICATION FAILED', 'Enter your credentials to proceed.');
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      Alert.alert('ACCESS DENIED', error.message);
    }
  };

  const handleDemoMode = () => {
    router.replace('/(tabs)/feed');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['rgba(240,160,32,0.08)', 'transparent', 'transparent']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <View style={styles.container}>
          {/* Logo block */}
          <View style={styles.logoBlock}>
            <MaterialCommunityIcons name="airplane" size={40} color={Colors.amber} />
            <Text style={styles.logo}>FLIGHTDECK</Text>
            <Text style={styles.tagline}>THE AVIATION SOCIAL PLATFORM</Text>
            <View style={styles.logoDivider} />
          </View>

          {/* Panel */}
          <View style={styles.panel}>
            {/* Panel header strip */}
            <LinearGradient
              colors={[Colors.amberDim, 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.panelHeader}
            >
              <View style={styles.panelLED} />
              <Text style={styles.panelTitle}>PILOT AUTHENTICATION</Text>
            </LinearGradient>

            {/* Inputs */}
            <View style={styles.form}>
              <CockpitInput
                label="EMAIL / CALLSIGN ID"
                value={email}
                onChangeText={setEmail}
                placeholder="pilot@flightdeck.app"
                autoCapitalize="none"
                keyboardType="email-address"
                active={activeField === 'email'}
                onFocus={() => setActiveField('email')}
                onBlur={() => setActiveField(null)}
              />
              <CockpitInput
                label="ACCESS CODE"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                active={activeField === 'password'}
                onFocus={() => setActiveField('password')}
                onBlur={() => setActiveField(null)}
              />
            </View>

            {/* Submit */}
            <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
              <LinearGradient colors={['#C08010', Colors.amber, '#C08010']} style={styles.authBtn}>
                {loading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="shield-check" size={16} color="#000" />
                    <Text style={styles.authBtnText}>AUTHENTICATE PILOT</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Demo mode */}
            {!isSupabaseConfigured && (
              <TouchableOpacity onPress={handleDemoMode} style={styles.demoBtn}>
                <MaterialCommunityIcons name="airplane-takeoff" size={14} color={Colors.cyan} />
                <Text style={styles.demoBtnText}>ENTER DEMO MODE — NO ACCOUNT NEEDED</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Sign up link */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>NEW PILOT? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text style={styles.signupLink}>CREATE DOSSIER →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function CockpitInput({
  label, value, onChangeText, placeholder, secureTextEntry, autoCapitalize, keyboardType,
  active, onFocus, onBlur,
}: {
  label: string; value: string; onChangeText: (v: string) => void;
  placeholder: string; secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'email-address' | 'default';
  active: boolean; onFocus: () => void; onBlur: () => void;
}) {
  return (
    <View style={inputStyles.wrap}>
      <Text style={inputStyles.label}>{label}</Text>
      <View style={[inputStyles.inputWrap, active && inputStyles.inputActive]}>
        {active && <View style={inputStyles.activeDot} />}
        <TextInput
          style={inputStyles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize ?? 'none'}
          keyboardType={keyboardType ?? 'default'}
          onFocus={onFocus}
          onBlur={onBlur}
          selectionColor={Colors.amber}
        />
      </View>
    </View>
  );
}

const inputStyles = StyleSheet.create({
  wrap: { gap: 4 },
  label: { fontFamily: Font.mono, fontSize: 8, color: Colors.textMuted, letterSpacing: 1.5 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, backgroundColor: Colors.bgCard,
    overflow: 'hidden',
  },
  inputActive: { borderColor: Colors.borderAmber, backgroundColor: Colors.amberDim },
  activeDot: { width: 2, height: '100%', backgroundColor: Colors.amber },
  input: {
    flex: 1, paddingHorizontal: 12, paddingVertical: 13,
    fontFamily: Font.mono, fontSize: 13, color: Colors.textPrimary,
  },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  kav: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', padding: Space.lg },
  logoBlock: { alignItems: 'center', marginBottom: Space.xl, gap: 6 },
  logo: { fontFamily: Font.mono, fontSize: 28, color: Colors.amber, letterSpacing: 4, fontWeight: '700' },
  tagline: { fontFamily: Font.mono, fontSize: 8, color: Colors.textMuted, letterSpacing: 2 },
  logoDivider: { width: 80, height: 1, backgroundColor: Colors.borderAmber, marginTop: 8 },
  panel: {
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.xl, overflow: 'hidden',
    backgroundColor: Colors.bgCard,
  },
  panelHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: Space.md, paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  panelLED: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.amber, shadowColor: Colors.amber, shadowRadius: 4, shadowOpacity: 0.8 },
  panelTitle: { fontFamily: Font.mono, fontSize: 9, color: Colors.textAmber, letterSpacing: 2 },
  form: { padding: Space.md, gap: Space.sm },
  authBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginHorizontal: Space.md, marginBottom: Space.md,
    paddingVertical: 14, borderRadius: Radius.md,
  },
  authBtnText: { fontFamily: Font.mono, fontSize: 12, color: '#000', fontWeight: '700', letterSpacing: 1.5 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: Space.md, marginBottom: Space.sm, gap: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontFamily: Font.mono, fontSize: 9, color: Colors.textMuted },
  demoBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    marginHorizontal: Space.md, marginBottom: Space.md,
    paddingVertical: 10, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.borderCyan, backgroundColor: Colors.cyanDim,
  },
  demoBtnText: { fontFamily: Font.mono, fontSize: 9, color: Colors.cyan, letterSpacing: 0.5 },
  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Space.lg, gap: 4 },
  signupText: { fontFamily: Font.mono, fontSize: 10, color: Colors.textMuted },
  signupLink: { fontFamily: Font.mono, fontSize: 10, color: Colors.amber },
});

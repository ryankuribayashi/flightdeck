import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform, Alert,
  ActivityIndicator, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Font, Space, Radius } from '../../constants/theme';
import { useAuth } from '../../lib/hooks/useAuth';

const RANKS = ['CADET', 'OBSERVER', 'SPOTTER', 'SR. SPOTTER', 'ACE', 'LEGEND'];

const ICAO_SUGGESTIONS = ['RJTT', 'RJAA', 'KLAX', 'KJFK', 'EGLL', 'OMDB', 'YSSY', 'LFPG', 'EDDF', 'VHHH'];

export default function SignupScreen() {
  const { signUp } = useAuth();
  const [step, setStep] = useState(1);
  const [callsign, setCallsign] = useState('');
  const [homeAirport, setHomeAirport] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step === 1 && !callsign.trim()) {
      Alert.alert('CALLSIGN REQUIRED', 'Choose a unique callsign for your pilot dossier.');
      return;
    }
    if (step === 2 && !homeAirport.trim()) {
      Alert.alert('BASE REQUIRED', 'Select your home base airport (ICAO code).');
      return;
    }
    setStep((s) => s + 1);
  };

  const handleCreate = async () => {
    if (!email || !password) {
      Alert.alert('CREDENTIALS REQUIRED', 'Enter email and access code to continue.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('ACCESS CODE TOO SHORT', 'Minimum 6 characters required.');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, callsign.toUpperCase(), homeAirport.toUpperCase());
    setLoading(false);
    if (error) {
      Alert.alert('REGISTRATION FAILED', error.message);
    } else {
      Alert.alert(
        'DOSSIER CREATED',
        'Check your email to verify your account, then sign in.',
        [{ text: 'PROCEED TO LOGIN', onPress: () => router.replace('/(auth)/login') }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['rgba(240,160,32,0.06)', 'transparent']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Back */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => step > 1 ? setStep((s) => s - 1) : router.back()}
          >
            <Ionicons name="chevron-back" size={16} color={Colors.textSecondary} />
            <Text style={styles.backText}>{step > 1 ? 'BACK' : 'SIGN IN'}</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <MaterialCommunityIcons name="account-plus" size={32} color={Colors.amber} />
            <Text style={styles.title}>CREATE DOSSIER</Text>
            <Text style={styles.subtitle}>STEP {step} OF 3</Text>
          </View>

          {/* Step indicator */}
          <View style={styles.steps}>
            {[1, 2, 3].map((s) => (
              <View
                key={s}
                style={[styles.stepDot, s <= step && styles.stepDotActive, s === step && styles.stepDotCurrent]}
              />
            ))}
          </View>

          {/* Panel */}
          <View style={styles.panel}>
            <LinearGradient
              colors={[Colors.amberDim, 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.panelBar}
            >
              <View style={styles.panelLED} />
              <Text style={styles.panelLabel}>
                {step === 1 ? 'ASSIGN CALLSIGN' : step === 2 ? 'SELECT HOME BASE' : 'SET CREDENTIALS'}
              </Text>
            </LinearGradient>

            <View style={styles.formBody}>
              {step === 1 && (
                <>
                  <Text style={styles.fieldLabel}>CALLSIGN</Text>
                  <TextInput
                    style={styles.input}
                    value={callsign}
                    onChangeText={(v) => setCallsign(v.replace(/[^A-Za-z0-9-]/g, '').toUpperCase())}
                    placeholder="e.g. JA-SPOTTER"
                    placeholderTextColor={Colors.textMuted}
                    autoCapitalize="characters"
                    maxLength={12}
                    selectionColor={Colors.amber}
                  />
                  <Text style={styles.hint}>6–12 characters. This is your identity on FlightDeck.</Text>

                  <Text style={[styles.fieldLabel, { marginTop: 16 }]}>INITIAL RANK</Text>
                  <View style={styles.rankGrid}>
                    {RANKS.map((r) => (
                      <View key={r} style={styles.rankBadge}>
                        <Text style={styles.rankText}>{r}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.hint}>You start as CADET. Rank up by spotting aircraft.</Text>
                </>
              )}

              {step === 2 && (
                <>
                  <Text style={styles.fieldLabel}>HOME BASE ICAO</Text>
                  <TextInput
                    style={styles.input}
                    value={homeAirport}
                    onChangeText={(v) => setHomeAirport(v.replace(/[^A-Za-z]/g, '').toUpperCase())}
                    placeholder="e.g. RJTT"
                    placeholderTextColor={Colors.textMuted}
                    autoCapitalize="characters"
                    maxLength={4}
                    selectionColor={Colors.amber}
                  />
                  <Text style={styles.hint}>This airport appears on your profile as your base of operations.</Text>

                  <Text style={[styles.fieldLabel, { marginTop: 16 }]}>COMMON BASES</Text>
                  <View style={styles.icaoGrid}>
                    {ICAO_SUGGESTIONS.map((icao) => (
                      <TouchableOpacity
                        key={icao}
                        onPress={() => setHomeAirport(icao)}
                        style={[styles.icaoChip, homeAirport === icao && styles.icaoChipActive]}
                      >
                        <Text style={[styles.icaoText, homeAirport === icao && styles.icaoTextActive]}>{icao}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {step === 3 && (
                <>
                  <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="pilot@example.com"
                    placeholderTextColor={Colors.textMuted}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    selectionColor={Colors.amber}
                  />

                  <Text style={[styles.fieldLabel, { marginTop: Space.sm }]}>ACCESS CODE (PASSWORD)</Text>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Minimum 6 characters"
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry
                    selectionColor={Colors.amber}
                  />

                  {/* Summary */}
                  <View style={styles.summary}>
                    <SummaryRow icon="account" label="CALLSIGN" value={callsign || '—'} />
                    <SummaryRow icon="airport" label="HOME BASE" value={homeAirport || '—'} />
                  </View>
                </>
              )}
            </View>

            {step < 3 ? (
              <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
                <LinearGradient colors={['#C08010', Colors.amber]} style={styles.nextGrad}>
                  <Text style={styles.nextText}>NEXT →</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleCreate} disabled={loading} style={styles.nextBtn}>
                <LinearGradient colors={['#C08010', Colors.amber, '#C08010']} style={styles.nextGrad}>
                  {loading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <>
                      <MaterialCommunityIcons name="shield-check" size={14} color="#000" />
                      <Text style={styles.nextText}>CREATE DOSSIER</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SummaryRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={summaryStyles.row}>
      <MaterialCommunityIcons name={icon as any} size={12} color={Colors.textMuted} />
      <Text style={summaryStyles.label}>{label}</Text>
      <Text style={summaryStyles.value}>{value}</Text>
    </View>
  );
}

const summaryStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.border },
  label: { fontFamily: Font.mono, fontSize: 9, color: Colors.textMuted, flex: 1 },
  value: { fontFamily: Font.mono, fontSize: 11, color: Colors.amber },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  kav: { flex: 1 },
  scroll: { padding: Space.lg, paddingBottom: 40 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: Space.md },
  backText: { fontFamily: Font.mono, fontSize: 10, color: Colors.textSecondary },
  header: { alignItems: 'center', gap: 4, marginBottom: Space.md },
  title: { fontFamily: Font.mono, fontSize: 20, color: Colors.amber, letterSpacing: 3, fontWeight: '700' },
  subtitle: { fontFamily: Font.mono, fontSize: 9, color: Colors.textMuted, letterSpacing: 2 },
  steps: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: Space.lg },
  stepDot: { width: 20, height: 4, borderRadius: 2, backgroundColor: Colors.bgElevated, borderWidth: 1, borderColor: Colors.border },
  stepDotActive: { backgroundColor: Colors.amberDim, borderColor: Colors.borderAmber },
  stepDotCurrent: { backgroundColor: Colors.amber, borderColor: Colors.amber },
  panel: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, overflow: 'hidden', backgroundColor: Colors.bgCard },
  panelBar: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: Space.md, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  panelLED: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.amber },
  panelLabel: { fontFamily: Font.mono, fontSize: 9, color: Colors.textAmber, letterSpacing: 2 },
  formBody: { padding: Space.md, gap: 4 },
  fieldLabel: { fontFamily: Font.mono, fontSize: 8, color: Colors.textMuted, letterSpacing: 1.5 },
  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md,
    backgroundColor: Colors.bgCard, paddingHorizontal: 12, paddingVertical: 13,
    fontFamily: Font.mono, fontSize: 13, color: Colors.textPrimary,
  },
  hint: { fontFamily: Font.mono, fontSize: 8, color: Colors.textMuted, lineHeight: 13 },
  rankGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  rankBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bgElevated },
  rankText: { fontFamily: Font.mono, fontSize: 8, color: Colors.textMuted },
  icaoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  icaoChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bgCard },
  icaoChipActive: { borderColor: Colors.borderAmber, backgroundColor: Colors.amberDim },
  icaoText: { fontFamily: Font.mono, fontSize: 10, color: Colors.textSecondary },
  icaoTextActive: { color: Colors.amber },
  summary: { marginTop: 12, gap: 0 },
  nextBtn: { margin: Space.md },
  nextGrad: { paddingVertical: 14, borderRadius: Radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  nextText: { fontFamily: Font.mono, fontSize: 12, color: '#000', fontWeight: '700', letterSpacing: 1.5 },
});

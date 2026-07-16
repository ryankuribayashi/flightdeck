import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { Colors, Font } from '../constants/theme';
import { useAuth } from '../lib/hooks/useAuth';
import { isSupabaseConfigured } from '../lib/supabase';
import PhoneFrame from '../components/web/PhoneFrame';
import SplashAnimation from '../components/ui/SplashAnimation';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isSupabaseConfigured) return;
    const inAuth = segments[0] === '(auth)';
    if (!session && !inAuth) router.replace('/(auth)/login');
    else if (session && inAuth) router.replace('/(tabs)/feed');
  }, [session, loading, segments]);

  if (loading && isSupabaseConfigured) {
    return (
      <View style={loadingStyles.container}>
        <ActivityIndicator color={Colors.amber} size="large" />
        <Text style={loadingStyles.text}>INITIALIZING...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const loadingStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center', gap: 12 },
  text: { fontFamily: Font.mono, fontSize: 10, color: Colors.textMuted, letterSpacing: 2 },
});

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <PhoneFrame>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          {!splashDone && <SplashAnimation onComplete={() => setSplashDone(true)} />}
          <AuthGuard>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.bg } }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(modals)" options={{ presentation: 'modal' }} />
              <Stack.Screen name="index" />
            </Stack>
          </AuthGuard>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </PhoneFrame>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
});

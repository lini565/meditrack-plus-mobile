import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import AuthScreen from './auth';
import { supabase } from '@/lib/supabase';

export default function RootLayout() {
  const [session, setSession] = useState<Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <View style={styles.loading}><ActivityIndicator color="#157f78" size="large" /></View>;
  if (!session) return <AuthScreen />;

  return <><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false }}><Stack.Screen name="(tabs)" /></Stack></>;
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f6f8f6' },
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const storage = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') return typeof window === 'undefined' ? null : window.localStorage.getItem(key);
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
      return;
    }
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') window.localStorage.removeItem(key);
      return;
    }
    await AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
  { auth: { storage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } },
);
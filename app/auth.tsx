import { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function AuthScreen() {
  const [registering, setRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  async function submit() {
    if (!email.trim() || password.length < 6) return setStatus('Enter an email and a password of at least 6 characters.');
    setStatus('');
    setBusy(true);
    const result = registering ? await supabase.auth.signUp({ email: email.trim(), password }) : await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (result.error) return setStatus(result.error.message);
    if (registering && !result.data.session) return setStatus(`Account created. Check ${email.trim()} for the confirmation link, then sign in.`);
    setStatus('Signed in successfully.');
  }

  return <SafeAreaView style={styles.page}><View style={styles.brand}><Text style={styles.kicker}>MEDICATION, MADE CALMER</Text><Text style={styles.title}>MediTrack<Text style={styles.plus}>+</Text></Text><Text style={styles.subtitle}>A clear daily rhythm for every dose.</Text></View><View style={styles.form}><Text style={styles.heading}>{registering ? 'Create your account' : 'Welcome back'}</Text><TextInput autoCapitalize="none" keyboardType="email-address" placeholder="Email address" placeholderTextColor="#8a9792" value={email} onChangeText={setEmail} style={styles.input} /><TextInput secureTextEntry placeholder="Password" placeholderTextColor="#8a9792" value={password} onChangeText={setPassword} style={styles.input} />{status ? <Text style={styles.status}>{status}</Text> : null}<Pressable onPress={submit} disabled={busy} style={styles.button}><Text style={styles.buttonText}>{busy ? 'Please wait...' : registering ? 'Create account' : 'Sign in'}</Text></Pressable><Pressable onPress={() => { setRegistering(!registering); setStatus(''); }}><Text style={styles.switch}>{registering ? 'Already have an account? Sign in' : 'New to MediTrack+? Create an account'}</Text></Pressable></View></SafeAreaView>;
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: '#f6f8f6', padding: 24, justifyContent: 'space-between' }, brand: { marginTop: 72 }, kicker: { color: '#157f78', fontSize: 12, fontWeight: '700', letterSpacing: 1.5 }, title: { color: '#17332f', fontSize: 42, fontWeight: '800', marginTop: 10 }, plus: { color: '#e68b4d' }, subtitle: { color: '#61716c', fontSize: 17, marginTop: 8 }, form: { gap: 14, marginBottom: 28 }, heading: { color: '#17332f', fontSize: 24, fontWeight: '700', marginBottom: 4 }, input: { backgroundColor: '#fff', borderColor: '#dce6e0', borderRadius: 14, borderWidth: 1, color: '#17332f', fontSize: 16, padding: 16 }, status: { color: '#157f78', fontSize: 13, lineHeight: 19 }, button: { alignItems: 'center', backgroundColor: '#157f78', borderRadius: 14, padding: 17, marginTop: 4 }, buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' }, switch: { color: '#157f78', textAlign: 'center', fontWeight: '600', padding: 8 } });
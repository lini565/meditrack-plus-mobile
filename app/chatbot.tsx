import { useState } from 'react';
import { Link } from 'expo-router';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { postApi } from '@/lib/api';

type Message = { role: 'user' | 'assistant'; content: string };

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: 'Hi. I can share general information about medicines and side effects. What would you like to know?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function send() {
    const message = input.trim();
    if (!message || loading) return;
    setInput('');
    setMessages((current) => [...current, { role: 'user', content: message }]);
    setLoading(true);
    try {
      const result = await postApi<{ reply: string }>('/api/chatbot', { message });
      setMessages((current) => [...current, { role: 'assistant', content: result.reply }]);
    } catch (error) {
      setMessages((current) => [...current, { role: 'assistant', content: error instanceof Error ? error.message : 'I could not reach the assistant. Try again later.' }]);
    } finally {
      setLoading(false);
    }
  }

  return <SafeAreaView style={styles.page}><KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><View style={styles.header}><Link href="/(tabs)/profile" asChild><Pressable><Text style={styles.back}>‹ Profile</Text></Pressable></Link><View><Text style={styles.eyebrow}>MEDICATION ASSISTANT</Text><Text style={styles.title}>Ask MediTrack+</Text></View><View style={styles.dot} /></View><ScrollView contentContainerStyle={styles.messages}>{messages.map((message, index) => <View key={`${message.role}-${index}`} style={[styles.bubble, message.role === 'user' ? styles.userBubble : styles.assistantBubble]}><Text style={[styles.message, message.role === 'user' && styles.userMessage]}>{message.content}</Text></View>)}{loading ? <View style={[styles.bubble, styles.assistantBubble]}><ActivityIndicator color="#157f78" /></View> : null}</ScrollView><View style={styles.composer}><TextInput value={input} onChangeText={setInput} onSubmitEditing={send} returnKeyType="send" placeholder="Ask about a medicine..." placeholderTextColor="#8a9792" style={styles.input} editable={!loading} /><Pressable onPress={send} disabled={!input.trim() || loading} style={[styles.send, (!input.trim() || loading) && styles.disabled]}><Text style={styles.sendText}>›</Text></Pressable></View><Text style={styles.disclaimer}>General information only. Contact a healthcare professional for urgent concerns.</Text></KeyboardAvoidingView></SafeAreaView>;
}

const styles = StyleSheet.create({ page: { backgroundColor: '#f6f8f6', flex: 1 }, container: { flex: 1 }, header: { alignItems: 'center', borderBottomColor: '#e0e9e4', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 18 }, back: { color: '#157f78', fontSize: 15, fontWeight: '700', width: 80 }, eyebrow: { color: '#6f817b', fontSize: 10, fontWeight: '700', letterSpacing: 1, textAlign: 'center' }, title: { color: '#17332f', fontSize: 20, fontWeight: '800', marginTop: 3 }, dot: { backgroundColor: '#65b99b', borderRadius: 5, height: 10, width: 10 }, messages: { gap: 12, padding: 18, paddingBottom: 28 }, bubble: { borderRadius: 17, maxWidth: '84%', padding: 14 }, assistantBubble: { alignSelf: 'flex-start', backgroundColor: '#fff', borderBottomLeftRadius: 4 }, userBubble: { alignSelf: 'flex-end', backgroundColor: '#157f78', borderBottomRightRadius: 4 }, message: { color: '#27423b', fontSize: 15, lineHeight: 21 }, userMessage: { color: '#fff' }, composer: { alignItems: 'center', backgroundColor: '#fff', borderTopColor: '#e0e9e4', borderTopWidth: 1, flexDirection: 'row', gap: 8, padding: 12 }, input: { backgroundColor: '#f2f6f3', borderRadius: 13, color: '#17332f', flex: 1, padding: 13 }, send: { alignItems: 'center', backgroundColor: '#157f78', borderRadius: 13, height: 44, justifyContent: 'center', width: 44 }, sendText: { color: '#fff', fontSize: 28, lineHeight: 30 }, disabled: { opacity: 0.4 }, disclaimer: { backgroundColor: '#fff', color: '#8a9792', fontSize: 11, paddingBottom: 10, paddingHorizontal: 14, textAlign: 'center' } });
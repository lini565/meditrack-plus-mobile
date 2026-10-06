import { useEffect, useRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Tesseract from 'tesseract.js';
import { Alert, Image, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { saveMedicine } from '@/lib/data';

export default function PrescriptionsScreen() {
  const [image, setImage] = useState<string>();
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [busy, setBusy] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) void handleWebFile(file);
    };
    document.body.appendChild(input);
    fileInputRef.current = input;
    return () => input.remove();
  });

  const runOcr = async (source: string | Blob) => {
    if (Platform.OS !== 'web') {
      setOcrStatus('Image selected. Review and enter the medicine name below.');
      return;
    }
    setOcrStatus('Reading image...');
    try {
      const imageBlob = source instanceof Blob ? source : await (await fetch(source)).blob();
      const imageDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Image could not be converted'));
        reader.readAsDataURL(imageBlob);
      });
      const worker = await Tesseract.createWorker('eng');
      const result = await worker.recognize(imageDataUrl);
      await worker.terminate();
      const lines = result.data.text.split('\n').map((line) => line.trim()).filter((line) => line.length > 2 && line.length < 60);
      if (lines[0]) {
        setName(lines[0]);
        setOcrStatus('Medicine name detected. Check it before saving.');
      } else {
        setOcrStatus('No clear medicine name found. Enter it manually.');
      }
    } catch (error) {
      setOcrStatus(`Could not read the image${error instanceof Error ? `: ${error.message}` : ''}. Enter the medicine name manually.`);
    }
  };

  const handleWebFile = async (file: File) => {
    const uri = URL.createObjectURL(file);
    setImage(uri);
    setName('');
    await runOcr(file);
  };

  const choose = async (camera: boolean) => {
    if (Platform.OS === 'web') {
      fileInputRef.current?.click();
      return;
    }
    const permission = camera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert('Permission needed', 'Allow photo access to review a prescription.');
    const result = camera ? await ImagePicker.launchCameraAsync({ quality: 0.8 }) : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      setName('');
      await runOcr(uri);
    }
  };

  const save = async () => {
    if (!name.trim() || !dosage.trim()) return Alert.alert('Complete the details', 'Review the medicine name and dosage before saving.');
    setBusy(true);
    try {
      await saveMedicine({ name: name.trim(), dosage: dosage.trim(), time: '08:00', quantity: 30 });
      Alert.alert('Saved', 'The medicine was added to your routine.');
      setImage(undefined);
      setName('');
      setDosage('');
      setOcrStatus('');
    } catch (error) {
      Alert.alert('Could not save', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setBusy(false);
    }
  };

  return <SafeAreaView style={styles.page}><View style={styles.content}><Text style={styles.eyebrow}>PRESCRIPTION DESK</Text><Text style={styles.title}>Scan & review</Text><Text style={styles.copy}>Capture a prescription, then confirm the details before they enter your routine.</Text>{image ? <View><Image source={{ uri: image }} style={styles.preview} /><Text style={styles.review}>Review extracted details</Text>{ocrStatus ? <Text style={styles.status}>{ocrStatus}</Text> : null}<TextInput value={name} onChangeText={setName} placeholder="Medicine name" placeholderTextColor="#8a9792" style={styles.input} /><TextInput value={dosage} onChangeText={setDosage} placeholder="Dosage, e.g. 500mg" placeholderTextColor="#8a9792" style={styles.input} /><Pressable onPress={save} style={styles.primary}><Text style={styles.primaryText}>{busy ? 'Saving...' : 'Save to medicines'}</Text></Pressable><Pressable onPress={() => { setImage(undefined); setOcrStatus(''); }}><Text style={styles.change}>Choose a different image</Text></Pressable></View> : <View style={styles.choices}><Pressable style={styles.choice} onPress={() => choose(true)}><Text style={styles.icon}>⌾</Text><Text style={styles.choiceTitle}>Use camera</Text><Text style={styles.choiceCopy}>Capture a clear label</Text></Pressable><Pressable style={styles.choice} onPress={() => choose(false)}><Text style={styles.icon}>▧</Text><Text style={styles.choiceTitle}>Choose photo</Text><Text style={styles.choiceCopy}>Select from your library</Text></Pressable></View>}<Text style={styles.note}>OCR suggests a name, but always review it before saving medication information.</Text></View></SafeAreaView>;
}

const styles = StyleSheet.create({ page: { backgroundColor: '#f6f8f6', flex: 1 }, content: { padding: 20 }, eyebrow: { color: '#6f817b', fontSize: 11, fontWeight: '700', letterSpacing: 1.2 }, title: { color: '#17332f', fontSize: 30, fontWeight: '800', marginTop: 4 }, copy: { color: '#61716c', fontSize: 16, lineHeight: 23, marginTop: 10 }, choices: { gap: 12, marginTop: 30 }, choice: { backgroundColor: '#fff', borderRadius: 18, padding: 20 }, icon: { color: '#e68b4d', fontSize: 30 }, choiceTitle: { color: '#17332f', fontSize: 18, fontWeight: '800', marginTop: 10 }, choiceCopy: { color: '#71817b', marginTop: 4 }, preview: { borderRadius: 18, height: 280, marginTop: 24, width: '100%' }, review: { color: '#17332f', fontSize: 18, fontWeight: '800', marginVertical: 16 }, status: { color: '#157f78', fontSize: 13, marginBottom: 10 }, input: { backgroundColor: '#fff', borderColor: '#dce6e0', borderRadius: 12, borderWidth: 1, color: '#17332f', marginBottom: 10, padding: 14 }, primary: { alignItems: 'center', backgroundColor: '#157f78', borderRadius: 13, marginTop: 6, padding: 16 }, primaryText: { color: '#fff', fontWeight: '800' }, change: { color: '#157f78', fontWeight: '700', padding: 16, textAlign: 'center' }, note: { color: '#8a9792', fontSize: 12, lineHeight: 18, marginTop: 28 } });

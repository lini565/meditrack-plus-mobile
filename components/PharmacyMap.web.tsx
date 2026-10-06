import { StyleSheet, Text, View } from 'react-native';

type Props = { location: { latitude: number; longitude: number } };

export default function PharmacyMap({ location }: Props) {
  return <View style={styles.map}><Text style={styles.title}>Pharmacy map preview</Text><Text style={styles.coordinates}>{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</Text><Text style={styles.note}>Open the mobile build for interactive map markers.</Text></View>;
}

const styles = StyleSheet.create({ map: { alignItems: 'center', backgroundColor: '#e4eee9', borderRadius: 18, height: 220, justifyContent: 'center', marginTop: 16, padding: 20 }, title: { color: '#17332f', fontSize: 17, fontWeight: '800' }, coordinates: { color: '#157f78', fontWeight: '700', marginTop: 8 }, note: { color: '#71817b', fontSize: 12, marginTop: 8, textAlign: 'center' } });
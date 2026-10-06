import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';

type Props = { location: { latitude: number; longitude: number }; pharmacies: { id: string | number; name: string; lat: number; lng: number }[] };

export default function PharmacyMap({ location, pharmacies }: Props) {
  return <MapView style={styles.map} initialRegion={{ ...location, latitudeDelta: 0.06, longitudeDelta: 0.06 }}><Marker coordinate={location} title="You are here" pinColor="#157f78" />{pharmacies.map((pharmacy) => <Marker key={String(pharmacy.id)} coordinate={{ latitude: pharmacy.lat, longitude: pharmacy.lng }} title={pharmacy.name} />)}</MapView>;
}

const styles = StyleSheet.create({ map: { borderRadius: 18, height: 220, marginTop: 16 } });
import { Platform } from 'react-native';
import WebMap from './PharmacyMap.web';

const NativeMap = Platform.OS === 'web' ? null : require('./PharmacyMap.native').default;
type Props = Parameters<typeof WebMap>[0] & { pharmacies: { id: string | number; name: string; lat: number; lng: number }[] };

export default function PharmacyMap(props: Props) {
  if (Platform.OS === 'web') return <WebMap location={props.location} />;
  return <NativeMap {...props} />;
}
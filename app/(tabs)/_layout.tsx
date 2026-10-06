import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#157f78', tabBarInactiveTintColor: '#8a9792', tabBarLabelStyle: { fontSize: 11 }, tabBarStyle: { height: 66, paddingTop: 8 } }}><Tabs.Screen name="index" options={{ title: 'Today', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>◷</Text> }} /><Tabs.Screen name="medicines" options={{ title: 'Medicines', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>＋</Text> }} /><Tabs.Screen name="prescriptions" options={{ title: 'Scan', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>▣</Text> }} /><Tabs.Screen name="pharmacies" options={{ title: 'Pharmacies', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⌖</Text> }} /><Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>○</Text> }} /></Tabs>;
}

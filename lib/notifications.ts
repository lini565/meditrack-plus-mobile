import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }) });
}

export async function requestReminderPermission() {
  if (Platform.OS === 'web') return false;
  if (Platform.OS === 'android') await Notifications.setNotificationChannelAsync('medicine-reminders', { name: 'Medicine reminders', importance: Notifications.AndroidImportance.HIGH, sound: 'default' });
  const current = await Notifications.getPermissionsAsync();
  if (current.status === 'granted') return true;
  return (await Notifications.requestPermissionsAsync()).status === 'granted';
}

export async function scheduleReminder(name: string, dosage: string, hour: number, minute: number) {
  if (Platform.OS === 'web') throw new Error('Native reminders are available in the Android or iOS app.');
  if (!(await requestReminderPermission())) throw new Error('Notification permission was not granted.');
  return Notifications.scheduleNotificationAsync({ content: { title: `Medicine time: ${name}`, body: dosage, sound: 'default' }, trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute } });
}
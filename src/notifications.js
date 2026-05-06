import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from './supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const token = (await Notifications.getExpoPushTokenAsync({
    projectId: 'YOUR_EXPO_PROJECT_ID',
  })).data;

  if (token) {
    await supabase.from('push_tokens').upsert([{ token }], { onConflict: 'token' });
  }

  return token;
}

async function handleNotificationResponse(response, navigationRef) {
  const data = response.notification.request.content.data;
  if (!data || !navigationRef?.current) return;

  setTimeout(() => {
    if (data.announcementId) {
      // Fetch and open specific announcement
      supabase
        .from('announcements')
        .select('*')
        .eq('id', data.announcementId)
        .single()
        .then(({ data: announcement }) => {
          if (announcement) {
            navigationRef.current.navigate('AnnouncementDetail', { announcement });
          }
        });
    } else if (data.screen) {
      navigationRef.current.navigate(data.screen);
    }
  }, 1000);
}

export function setupNotificationListeners(navigationRef) {
  const foregroundSub = Notifications.addNotificationResponseReceivedListener(response => {
    handleNotificationResponse(response, navigationRef);
  });

  Notifications.getLastNotificationResponseAsync().then(response => {
    if (response) {
      handleNotificationResponse(response, navigationRef);
    }
  });

  return () => foregroundSub.remove();
}

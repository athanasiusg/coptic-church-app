import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import TabNavigator from './src/navigation/TabNavigator';
import { registerForPushNotifications, setupNotificationListeners } from './src/notifications';

export default function App() {
  const navigationRef = useRef(null);

  useEffect(() => {
    registerForPushNotifications();
    const cleanup = setupNotificationListeners(navigationRef);
    return cleanup;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <StatusBar style="dark" />
        <TabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
      </GestureHandlerRootView>
  );
}

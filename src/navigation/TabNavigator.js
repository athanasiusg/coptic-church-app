import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ServicesScreen from '../screens/ServicesScreen';
import CommunityScreen from '../screens/CommunityScreen';
import AboutScreen from '../screens/AboutScreen';
import LiveStreamScreen from '../screens/LiveStreamScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import AnnouncementsScreen from '../screens/AnnouncementsScreen';
import SocialsScreen from '../screens/SocialsScreen';
import ConfessionScreen from '../screens/ConfessionScreen';
import SermonsScreen from '../screens/SermonsScreen';
import PhotosScreen from '../screens/PhotosScreen';
import SignupsScreen from '../screens/SignupsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import WebViewScreen from '../screens/WebViewScreen';
import PrayerRequestScreen from '../screens/PrayerRequestScreen';
import AnnouncementDetailScreen from '../screens/AnnouncementDetailScreen';
import { Colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TAB_ICONS = {
  Home: { active: 'home', inactive: 'home-outline' },
  Calendar: { active: 'calendar', inactive: 'calendar-outline' },
  Services: { active: 'business', inactive: 'business-outline' },
  Community: { active: 'people', inactive: 'people-outline' },
  About: { active: 'information-circle', inactive: 'information-circle-outline' },
};

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.active : icons.inactive;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.tabBarActive,
        tabBarInactiveTintColor: Colors.tabBarInactive,
        tabBarStyle: { backgroundColor: Colors.tabBar, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.border, height: 80, paddingBottom: 16, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
    </Tab.Navigator>
  );
}

export default function TabNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={HomeTabs} />
      <Stack.Screen name="LiveStream" component={LiveStreamScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen name="Announcements" component={AnnouncementsScreen} />
      <Stack.Screen name="Socials" component={SocialsScreen} />
      <Stack.Screen name="Confession" component={ConfessionScreen} />
      <Stack.Screen name="Sermons" component={SermonsScreen} />
      <Stack.Screen name="Photos" component={PhotosScreen} />
      <Stack.Screen name="Signups" component={SignupsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="WebView" component={WebViewScreen} />
      <Stack.Screen name="PrayerRequest" component={PrayerRequestScreen} />
      <Stack.Screen name="AnnouncementDetail" component={AnnouncementDetailScreen} />
    </Stack.Navigator>
  );
}

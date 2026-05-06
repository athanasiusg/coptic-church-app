import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Image, Alert, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { Colors } from '../theme/colors';
import { CHURCH_INFO } from '../data';

const APP_VERSION = '1.1.0';

const SETTINGS_ITEMS = [
  {
    section: 'Notifications',
    items: [
      { id: 'notif', title: 'Enable Notifications', icon: 'notifications-outline', action: 'enableNotifications' },
    ],
  },
  {
    section: 'Legal',
    items: [
      { id: 'privacy', title: 'Privacy Policy', icon: 'shield-checkmark-outline', url: 'https://yourwebsite.com/privacy' },
      { id: 'terms', title: 'Terms of Use', icon: 'document-text-outline', url: 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/' },
    ],
  },
  {
    section: 'About',
    items: [
      { id: 'about', title: 'About Your Church', icon: 'information-circle-outline', url: CHURCH_INFO.website },
      { id: 'version', title: 'App Version', icon: 'phone-portrait-outline', value: APP_VERSION },
    ],
  },
];

export default function SettingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const enableNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      Alert.alert('✅ Notifications Enabled', 'You will receive push notifications from your church.');
    } else {
      Alert.alert(
        'Enable Notifications',
        'To enable notifications, go to Settings for this app and turn them on.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  const handlePress = (item) => {
    if (item.action === 'enableNotifications') {
      enableNotifications();
    } else if (item.url) {
      Linking.openURL(item.url);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        {SETTINGS_ITEMS.map((section) => (
          <View key={section.section} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.row, index < section.items.length - 1 && styles.rowBorder]}
                  activeOpacity={item.value ? 1 : 0.7}
                  onPress={() => handlePress(item)}
                  disabled={!!item.value}
                >
                  <View style={styles.rowLeft}>
                    <View style={styles.rowIcon}>
                      <Ionicons name={item.icon} size={20} color={Colors.primary} />
                    </View>
                    <Text style={styles.rowTitle}>{item.title}</Text>
                  </View>
                  {item.value ? (
                    <Text style={styles.rowValue}>{item.value}</Text>
                  ) : (
                    <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Church Logo at bottom */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.churchName}>{CHURCH_INFO.name}</Text>
          <Text style={styles.churchAddress}>{CHURCH_INFO.address}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E5E5', backgroundColor: '#fff' },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: Colors.textDark },
  content: { padding: 20, gap: 8 },
  section: { marginBottom: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: Colors.textLight, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 },
  sectionCard: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: '#E5E5E5' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E5E5' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  rowIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: 15, color: Colors.textDark, fontWeight: '500' },
  rowValue: { fontSize: 15, color: Colors.textLight },
  logoContainer: { alignItems: 'center', marginTop: 32, gap: 8 },
  logo: { width: 80, height: 80, opacity: 0.85 },
  churchName: { fontSize: 14, fontWeight: '600', color: Colors.textMedium, textAlign: 'center' },
  churchAddress: { fontSize: 12, color: Colors.textLight, textAlign: 'center' },
});

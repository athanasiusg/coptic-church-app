import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator, RefreshControl, Alert, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { Colors } from '../theme/colors';
import { supabase } from '../supabase';

export default function NotificationsScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState(null);
  const notificationId = route?.params?.notificationId || null;

  useEffect(() => { fetchNotifications(); }, []);

  useEffect(() => {
    if (notificationId && notifications.length > 0) {
      const found = notifications.find(n => n.id === notificationId);
      if (found) setSelected(found);
    }
  }, [notificationId, notifications]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase.from('notifications_sent').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setNotifications(data || []);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const onRefresh = async () => { setRefreshing(true); await fetchNotifications(); setRefreshing(false); };

  const enableNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      Alert.alert('✅ Notifications Enabled', 'You will receive push notifications from your church.');
    } else {
      Alert.alert('Enable Notifications', 'Go to Settings for this app and turn them on.',
        [{ text: 'Cancel', style: 'cancel' }, { text: 'Open Settings', onPress: () => Linking.openSettings() }]
      );
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (selected) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelected(null)}>
            <Ionicons name="chevron-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notification</Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={[styles.detailContent, { paddingBottom: insets.bottom + 32 }]}>
          <View style={styles.detailCard}>
            <Text style={styles.detailDate}>{formatDate(selected.created_at)}</Text>
            <Text style={styles.detailTitle}>{selected.title}</Text>
            <Text style={styles.detailBody}>{selected.body}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.backButton} onPress={enableNotifications}>
          <Ionicons name="settings-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.enableBanner} onPress={enableNotifications}>
        <Ionicons name="notifications" size={20} color={Colors.primary} />
        <Text style={styles.enableText}>Tap to manage notification settings</Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color={Colors.primary} /></View>
      ) : (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        >
          {notifications.map((item) => (
            <TouchableOpacity key={item.id} style={styles.notifCard} activeOpacity={0.7} onPress={() => setSelected(item)}>
              <View style={styles.notifIcon}>
                <Ionicons name="notifications" size={20} color={Colors.primary} />
              </View>
              <View style={styles.notifInfo}>
                <Text style={styles.notifTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
                <Text style={styles.notifDate}>{formatDate(item.created_at)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
            </TouchableOpacity>
          ))}
          {notifications.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-outline" size={48} color={Colors.textLight} />
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E5E5' },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: Colors.textDark },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  enableBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, backgroundColor: Colors.primary + '10', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.primary + '20' },
  enableText: { flex: 1, fontSize: 14, color: Colors.primary, fontWeight: '500' },
  content: { padding: 16, gap: 10 },
  notifCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: '#E5E5E5', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  notifIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  notifInfo: { flex: 1 },
  notifTitle: { fontSize: 15, fontWeight: '600', color: Colors.textDark, marginBottom: 3 },
  notifBody: { fontSize: 13, color: Colors.textMedium, lineHeight: 18, marginBottom: 4 },
  notifDate: { fontSize: 11, color: Colors.textLight },
  detailContent: { padding: 20 },
  detailCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: StyleSheet.hairlineWidth, borderColor: '#E5E5E5' },
  detailDate: { fontSize: 12, color: Colors.textLight, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailTitle: { fontSize: 22, fontWeight: '700', color: Colors.textDark, marginBottom: 12 },
  detailBody: { fontSize: 16, color: Colors.textMedium, lineHeight: 24 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 16, color: Colors.textLight },
});

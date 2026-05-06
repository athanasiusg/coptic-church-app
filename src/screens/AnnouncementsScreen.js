import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { supabase } from '../supabase';

export default function AnnouncementsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAnnouncements();
    setRefreshing(false);
  };

  const getImageCount = (item) => {
    if (item.images) {
      try {
        const imgs = Array.isArray(item.images) ? item.images : JSON.parse(item.images);
        return imgs.length;
      } catch { return item.image_url ? 1 : 0; }
    }
    return item.image_url ? 1 : 0;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Announcements</Text>
        <View style={{ width: 36 }} />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        >
          {announcements.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('AnnouncementDetail', { announcement: item })}
            >
              {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.cardImage} resizeMode="cover" />
              ) : null}
              <View style={styles.cardContent}>
                <View style={styles.cardTop}>
                  <View style={styles.cardIcon}>
                    <Ionicons name="megaphone" size={18} color={Colors.primary} />
                  </View>
                  <View style={styles.cardTexts}>
                    {item.date ? <Text style={styles.cardDate}>{item.date}</Text> : null}
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardBody} numberOfLines={2}>{item.body}</Text>
                  </View>
                </View>
                <View style={styles.cardFooter}>
                  <View style={styles.readMore}>
                    <Text style={styles.readMoreText}>Read more</Text>
                    <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
                  </View>
                  {getImageCount(item) > 0 && (
                    <View style={styles.imagesBadge}>
                      <Ionicons name="images-outline" size={13} color={Colors.textLight} />
                      <Text style={styles.imagesBadgeText}>{getImageCount(item)} photo{getImageCount(item) > 1 ? 's' : ''}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
          {announcements.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="megaphone-outline" size={48} color={Colors.textLight} />
              <Text style={styles.emptyText}>No announcements yet</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E5E5', backgroundColor: '#fff' },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: Colors.textDark },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, gap: 12 },
  cardImage: { width: '100%', height: 180 },
  card: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: '#E5E5E5', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardContent: { padding: 16 },
  cardTop: { flexDirection: 'row', gap: 12 },
  cardIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
  cardTexts: { flex: 1 },
  cardDate: { fontSize: 11, color: Colors.textLight, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.textDark, marginBottom: 6 },
  cardBody: { fontSize: 14, color: Colors.textMedium, lineHeight: 20 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#f0f0f0' },
  readMore: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  readMoreText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  imagesBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  imagesBadgeText: { fontSize: 12, color: Colors.textLight },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 16, color: Colors.textLight },
});

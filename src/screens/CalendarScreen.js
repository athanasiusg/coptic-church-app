import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { Colors } from '../theme/colors';
import { supabase } from '../supabase';

function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  let h = hours;
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return h * 60 + (minutes || 0);
}

function groupEventsByDate(events) {
  const grouped = {};
  events.forEach((event) => {
    if (!grouped[event.date]) grouped[event.date] = [];
    grouped[event.date].push(event);
  });
  Object.keys(grouped).forEach(date => {
    grouped[date].sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time));
  });
  return grouped;
}

function formatDateHeader(dateString) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const date = new Date(dateString + 'T00:00:00');
  const isToday = date.getTime() === today.getTime();
  const isTomorrow = date.getTime() === today.getTime() + 86400000;
  if (isToday) return 'Today';
  if (isTomorrow) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function CalendarScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = async () => { setRefreshing(true); await fetchEvents(); setRefreshing(false); };

  const fetchEvents = async () => {
    try {
      const now = new Date(); const today = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true });
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedEvents = useMemo(() => {
    const grouped = groupEventsByDate(events);
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, [events]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.headerBg} />
      <Header navigation={navigation} />
      <ScrollView style={styles.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />} contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        {groupedEvents.map(([date, dayEvents]) => (
          <View key={date} style={styles.dateGroup}>
            <Text style={[styles.dateHeader, date === new Date().toISOString().split('T')[0] && styles.todayHeader]}>
              {formatDateHeader(date)}
            </Text>
            {dayEvents.map((event, index) => (
              <TouchableOpacity
                key={event.id}
                style={[styles.eventRow, index < dayEvents.length - 1 && styles.eventRowBorder]}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('EventDetail', { event })}
              >
                <View style={styles.eventLeft}>
                  <View style={[styles.eventDot, { backgroundColor: Colors.primary }]} />
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <View style={styles.eventMeta}>
                      <Text style={styles.eventTime}>{event.start_time} – {event.end_time}</Text>
                      {event.location ? (
                        <>
                          <Text style={styles.eventMetaDot}> · </Text>
                          <Ionicons name="location-outline" size={12} color={Colors.textLight} style={{ marginRight: 2 }} />
                          <Text style={styles.eventLocation} numberOfLines={1}>{event.location}</Text>
                        </>
                      ) : null}
                    </View>
                    {event.details ? (
                      <Text style={styles.detailHint}>Tap for hour breakdown →</Text>
                    ) : null}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        ))}
        {groupedEvents.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={Colors.textLight} />
            <Text style={styles.emptyText}>No upcoming events</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 8 },
  dateGroup: { marginBottom: 8 },
  dateHeader: { fontSize: 20, fontWeight: '700', color: Colors.textDark, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  todayHeader: { color: Colors.primary },
  eventRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: Colors.background },
  eventRowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
  eventLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1 },
  eventDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12, marginTop: 6 },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: 16, fontWeight: '500', color: Colors.textDark, marginBottom: 3 },
  eventMeta: { flexDirection: 'row', alignItems: 'center' },
  eventTime: { fontSize: 13, color: Colors.textLight },
  eventMetaDot: { fontSize: 13, color: Colors.textLight },
  eventLocation: { fontSize: 13, color: Colors.textLight, flex: 1 },
  detailHint: { fontSize: 12, color: Colors.primary, marginTop: 4, fontWeight: '500' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 16, color: Colors.textLight },
});

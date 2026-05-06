import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { supabase } from '../supabase';

export default function UpcomingEvents({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const now = new Date(); const today = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('date', today)
        .order('start_time', { ascending: true });
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && events.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
          <Text style={styles.seeAll}>Full calendar →</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ padding: 20 }} />
      ) : (
        <View style={styles.eventsList}>
          {events.map((event, index) => (
            <TouchableOpacity
              key={event.id}
              style={[styles.eventRow, index < events.length - 1 && styles.eventBorder]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('EventDetail', { event })}
            >
              <View style={styles.dateBox}>
                <Text style={styles.timeText}>{event.start_time}</Text>
              </View>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
                <Text style={styles.eventLocation}>{event.location}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 0, backgroundColor: '#fff', borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: Colors.border, overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.textDark },
  seeAll: { fontSize: 14, color: Colors.primary, fontWeight: '500' },
  eventsList: {},
  eventRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  eventBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
  dateBox: { minWidth: 70, marginRight: 12 },
  timeText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: 14, fontWeight: '500', color: Colors.textDark, marginBottom: 2 },
  eventLocation: { fontSize: 12, color: Colors.textLight },
});

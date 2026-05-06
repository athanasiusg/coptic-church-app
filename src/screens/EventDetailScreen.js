import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

const EVENT_TYPE_COLORS = {
  liturgy: Colors.primary,
  service: '#7C3AED',
  education: '#047857',
  youth: '#B45309',
  default: Colors.textMedium,
};

function NoteWithLinks({ text }) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return (
    <Text style={styles.noteText}>
      {parts.map((part, index) =>
        urlRegex.test(part) ? (
          <Text key={index} style={styles.noteLink} onPress={() => Linking.openURL(part)}>
            {part}
          </Text>
        ) : (
          <Text key={index}>{part}</Text>
        )
      )}
    </Text>
  );
}

export default function EventDetailScreen({ route, navigation }) {
  const { event } = route.params;
  const insets = useSafeAreaInsets();
  const color = EVENT_TYPE_COLORS[event.type] || EVENT_TYPE_COLORS.default;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
        <Text style={styles.title}>{event.title}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={16} color={Colors.textLight} />
          <Text style={styles.metaText}>{event.start_time} – {event.end_time}</Text>
        </View>
        {event.location ? (
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={16} color={Colors.textLight} />
            <Text style={styles.metaText}>{event.location}</Text>
          </View>
        ) : null}
        {event.note ? (
          <View style={styles.noteBox}>
            <NoteWithLinks text={event.note} />
          </View>
        ) : null}
        {event.details && event.details.length > 0 ? (
          <View style={styles.detailsSection}>
            <Text style={styles.detailsTitle}>Hour Breakdown</Text>
            {event.details.map((item, index) => (
              <View key={index} style={styles.detailRow}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, { backgroundColor: color }]} />
                  {index < event.details.length - 1 && <View style={[styles.timelineLine, { backgroundColor: color + '40' }]} />}
                </View>
                <View style={styles.detailContent}>
                  <Text style={[styles.detailTime, { color }]}>{item.time}</Text>
                  <Text style={styles.detailDesc}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E5E5' },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: Colors.textDark },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.textDark, marginBottom: 16, lineHeight: 32 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  metaText: { fontSize: 15, color: Colors.textLight, marginLeft: 8 },
  noteBox: { backgroundColor: '#8B1A1A10', borderLeftWidth: 3, borderLeftColor: '#8B1A1A', padding: 14, borderRadius: 8, marginTop: 16 },
  noteText: { fontSize: 14, color: '#8B1A1A', lineHeight: 22 },
  noteLink: { fontSize: 14, color: Colors.primary, textDecorationLine: 'underline' },
  detailsSection: { marginTop: 28 },
  detailsTitle: { fontSize: 18, fontWeight: '700', color: Colors.textDark, marginBottom: 20 },
  detailRow: { flexDirection: 'row', marginBottom: 0 },
  timelineLeft: { width: 24, alignItems: 'center' },
  timelineDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  timelineLine: { width: 2, flex: 1, marginTop: 4, marginBottom: -4 },
  detailContent: { flex: 1, paddingLeft: 16, paddingBottom: 24 },
  detailTime: { fontSize: 13, fontWeight: '700', marginBottom: 2 },
  detailDesc: { fontSize: 15, color: Colors.textDark, lineHeight: 22 },
});

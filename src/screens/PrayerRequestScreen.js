import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { supabase } from '../supabase';

export default function PrayerRequestScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [prayer, setPrayer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!prayer.trim()) {
      Alert.alert('Please enter your prayer request.');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('prayer_requests').insert([{
        name: name.trim() || 'Anonymous',
        prayer: prayer.trim(),
      }]);
      if (error) throw error;
      Alert.alert(
        '🙏 Prayer Received',
        'Your prayer request has been submitted. Our priests will pray for your intention.',
        [{ text: 'Done', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Prayer Requests</Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
          <View style={styles.introBox}>
            <Ionicons name="heart" size={32} color={Colors.primary} style={{ marginBottom: 12 }} />
            <Text style={styles.introTitle}>Submit a Prayer Request</Text>
            <Text style={styles.introText}>Share your prayer intentions with our community. Our priests and congregation will pray for you.</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>Your Name (Optional)</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Leave blank to submit anonymously"
              placeholderTextColor={Colors.textLight}
            />

            <Text style={styles.label}>Prayer Request *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={prayer}
              onChangeText={setPrayer}
              placeholder="Share your prayer intention here..."
              placeholderTextColor={Colors.textLight}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Ionicons name="heart" size={18} color="#fff" />
              <Text style={styles.submitText}>{submitting ? 'Submitting...' : 'Submit Prayer Request'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E5E5', backgroundColor: '#fff' },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: Colors.textDark },
  content: { padding: 20, gap: 16 },
  introBox: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: '#E5E5E5' },
  introTitle: { fontSize: 20, fontWeight: '700', color: Colors.textDark, marginBottom: 8, textAlign: 'center' },
  introText: { fontSize: 14, color: Colors.textMedium, lineHeight: 22, textAlign: 'center' },
  formCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: StyleSheet.hairlineWidth, borderColor: '#E5E5E5' },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textLight, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1.5, borderColor: '#E5E5E5', borderRadius: 12, padding: 14, fontSize: 15, color: Colors.textDark, backgroundColor: '#fafafa' },
  textArea: { height: 150, textAlignVertical: 'top' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primary, padding: 16, borderRadius: 12, marginTop: 24 },
  submitText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});

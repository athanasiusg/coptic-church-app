import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Image, ActivityIndicator, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { supabase } from '../supabase';

function FormField({ label, value, onChangeText, placeholder, keyboardType, multiline, required }) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}{required ? ' *' : ''}</Text>
      <TextInput
        style={[styles.fieldInput, multiline && styles.fieldInputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || ''}
        placeholderTextColor={Colors.textLight}
        keyboardType={keyboardType || 'default'}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );
}

function SelectField({ label, value, options, onSelect, required }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}{required ? ' *' : ''}</Text>
      <TouchableOpacity style={styles.selectButton} onPress={() => setOpen(!open)}>
        <Text style={value ? styles.selectValue : styles.selectPlaceholder}>{value || 'Select...'}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textLight} />
      </TouchableOpacity>
      {open && (
        <View style={styles.selectOptions}>
          {options.map((opt) => (
            <TouchableOpacity key={opt} style={styles.selectOption} onPress={() => { onSelect(opt); setOpen(false); }}>
              <Text style={[styles.selectOptionText, value === opt && styles.selectOptionActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// Anonymous Q&A Form
function QAForm({ signup, onBack }) {
  const insets = useSafeAreaInsets();
  const [question, setQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) {
      Alert.alert('Please enter your question.');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('signup_responses').insert([{
        signup_id: signup.id,
        signup_type: 'question',
        question: question.trim(),
      }]);
      if (error) throw error;
      Alert.alert('✅ Question Submitted!', 'Your anonymous question has been submitted.', [{ text: 'Done', onPress: onBack }]);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.formContent, { paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.qaIntro}>
          <Ionicons name="chatbubble-ellipses" size={36} color={Colors.primary} style={{ marginBottom: 12 }} />
          <Text style={styles.qaTitle}>Submit a Question</Text>
          <Text style={styles.qaSubtitle}>Your question is completely anonymous — no name or contact info required.</Text>
        </View>
        <Text style={styles.fieldLabel}>Your Question *</Text>
        <TextInput
          style={[styles.fieldInput, styles.fieldInputMultiline, { minHeight: 120 }]}
          value={question}
          onChangeText={setQuestion}
          placeholder="Type your question here..."
          placeholderTextColor={Colors.textLight}
          multiline
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={[styles.submitButton, submitting && { opacity: 0.6 }, { marginTop: 24 }]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit Question</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ParticipantForm({ signup, onBack }) {
  const insets = useSafeAreaInsets();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    parent_first_name: '', parent_last_name: '', email: '', phone: '',
    emergency_contact_name: '', emergency_contact_phone: '',
    child_first_name: '', child_last_name: '', grade: '', gender: '',
    date_of_birth: '', shirt_size: '', allergies: '', medical_concerns: '',
    friend_requests: '', comments: '',
  });

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.parent_first_name || !form.parent_last_name || !form.email || !form.phone || !form.child_first_name || !form.child_last_name) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('signup_responses').insert([{
        signup_id: signup.id,
        signup_type: 'participant',
        ...form,
      }]);
      if (error) throw error;
      Alert.alert('Registration Complete! 🎉', `Thank you! ${form.child_first_name} has been registered for ${signup.event_name}.`, [{ text: 'Done', onPress: onBack }]);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.formContent, { paddingBottom: insets.bottom + 40 }]}>
        <Text style={styles.formSection}>Parent Information</Text>
        <FormField label="First Name" value={form.parent_first_name} onChangeText={v => update('parent_first_name', v)} required />
        <FormField label="Last Name" value={form.parent_last_name} onChangeText={v => update('parent_last_name', v)} required />
        <FormField label="Email" value={form.email} onChangeText={v => update('email', v)} keyboardType="email-address" required />
        <FormField label="Phone" value={form.phone} onChangeText={v => update('phone', v)} keyboardType="phone-pad" required />
        <FormField label="Emergency Contact Name" value={form.emergency_contact_name} onChangeText={v => update('emergency_contact_name', v)} required />
        <FormField label="Emergency Contact Phone" value={form.emergency_contact_phone} onChangeText={v => update('emergency_contact_phone', v)} keyboardType="phone-pad" required />
        <Text style={styles.formSection}>Child Information</Text>
        <FormField label="First Name" value={form.child_first_name} onChangeText={v => update('child_first_name', v)} required />
        <FormField label="Last Name" value={form.child_last_name} onChangeText={v => update('child_last_name', v)} required />
        <SelectField label="Grade" value={form.grade} onSelect={v => update('grade', v)} options={['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8']} required />
        <SelectField label="Gender" value={form.gender} onSelect={v => update('gender', v)} options={['Female', 'Male']} required />
        <FormField label="Date of Birth (MM/DD/YYYY)" value={form.date_of_birth} onChangeText={v => update('date_of_birth', v)} required />
        <SelectField label="Shirt Size" value={form.shirt_size} onSelect={v => update('shirt_size', v)} options={['No T-shirt', 'Child Sm (6-8)', 'Child Med (10-12)', 'Child Lg (14-16)', 'Adult Sm', 'Adult Med', 'Adult Lg', 'Adult XL', 'Adult 2XL']} required />
        <FormField label="Allergies" value={form.allergies} onChangeText={v => update('allergies', v)} placeholder="None" />
        <FormField label="Medical Concerns" value={form.medical_concerns} onChangeText={v => update('medical_concerns', v)} placeholder="None" />
        <FormField label="Friend Requests (up to 3 names)" value={form.friend_requests} onChangeText={v => update('friend_requests', v)} multiline />
        <FormField label="Comments" value={form.comments} onChangeText={v => update('comments', v)} multiline />
        <TouchableOpacity style={[styles.submitButton, submitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={submitting}>
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit Registration</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function VolunteerForm({ signup, onBack }) {
  const insets = useSafeAreaInsets();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ parent_first_name: '', parent_last_name: '', email: '', phone: '', comments: '' });
  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.parent_first_name || !form.parent_last_name || !form.email || !form.phone) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('signup_responses').insert([{ signup_id: signup.id, signup_type: 'volunteer', ...form }]);
      if (error) throw error;
      Alert.alert('Thank You! 🎉', 'Your volunteer registration has been submitted!', [{ text: 'Done', onPress: onBack }]);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.formContent, { paddingBottom: insets.bottom + 40 }]}>
        <Text style={styles.formSection}>Volunteer Information</Text>
        <FormField label="First Name" value={form.parent_first_name} onChangeText={v => update('parent_first_name', v)} required />
        <FormField label="Last Name" value={form.parent_last_name} onChangeText={v => update('parent_last_name', v)} required />
        <FormField label="Email" value={form.email} onChangeText={v => update('email', v)} keyboardType="email-address" required />
        <FormField label="Phone" value={form.phone} onChangeText={v => update('phone', v)} keyboardType="phone-pad" required />
        <FormField label="Comments / Availability" value={form.comments} onChangeText={v => update('comments', v)} multiline />
        <TouchableOpacity style={[styles.submitButton, submitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={submitting}>
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit Volunteer Registration</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SignupDetail({ signup, onBack }) {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState('main');
  const isQA = signup.type === 'qna';

  if (view === 'question') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setView('main')}>
            <Ionicons name="chevron-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Submit Question</Text>
          <View style={{ width: 36 }} />
        </View>
        <QAForm signup={signup} onBack={() => setView('main')} />
      </View>
    );
  }

  if (view === 'participant') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setView('main')}>
            <Ionicons name="chevron-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Participant Registration</Text>
          <View style={{ width: 36 }} />
        </View>
        <ParticipantForm signup={signup} onBack={() => setView('main')} />
      </View>
    );
  }

  if (view === 'volunteer') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setView('main')}>
            <Ionicons name="chevron-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Volunteer Registration</Text>
          <View style={{ width: 36 }} />
        </View>
        <VolunteerForm signup={signup} onBack={() => setView('main')} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{signup.event_name}</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
        {signup.event_image_url ? (
          <Image source={{ uri: signup.event_image_url }} style={styles.eventImage} resizeMode="cover" />
        ) : null}
        <View style={styles.eventDetail}>
          <Text style={styles.eventDetailTitle}>{signup.event_name}</Text>
          {signup.event_date ? <Text style={styles.eventDate}>{signup.event_date}</Text> : null}
          {signup.event_description ? <Text style={styles.eventDesc}>{signup.event_description}</Text> : null}
          <View style={styles.actionButtons}>
            {isQA ? (
              <TouchableOpacity style={styles.actionButton} onPress={() => setView('question')}>
                <Ionicons name="chatbubble-ellipses" size={22} color="#fff" />
                <Text style={styles.actionButtonText}>Submit a Question</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={styles.actionButton} onPress={() => setView('participant')}>
                  <Ionicons name="person-add" size={22} color="#fff" />
                  <Text style={styles.actionButtonText}>Register a Child</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.actionButtonOutline]} onPress={() => setView('volunteer')}>
                  <Ionicons name="people" size={22} color={Colors.primary} />
                  <Text style={[styles.actionButtonText, { color: Colors.primary }]}>Volunteer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default function SignupsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSignup, setSelectedSignup] = useState(null);

  useEffect(() => { fetchSignups(); }, []);

  const fetchSignups = async () => {
    try {
      const { data, error } = await supabase.from('signups').select('*').eq('is_active', true).order('created_at', { ascending: false });
      if (error) throw error;
      setSignups(data || []);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const onRefresh = async () => { setRefreshing(true); await fetchSignups(); setRefreshing(false); };

  if (selectedSignup) return <SignupDetail signup={selectedSignup} onBack={() => setSelectedSignup(null)} />;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign-ups</Text>
        <View style={{ width: 36 }} />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color={Colors.primary} /></View>
      ) : (
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
          {signups.map((signup) => (
            <TouchableOpacity key={signup.id} style={styles.signupCard} activeOpacity={0.8} onPress={() => setSelectedSignup(signup)}>
              {signup.event_image_url ? <Image source={{ uri: signup.event_image_url }} style={styles.signupImage} resizeMode="cover" /> : null}
              <View style={styles.signupInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Text style={styles.signupTitle}>{signup.event_name}</Text>
                  {signup.type === 'qna' && <View style={styles.qaBadge}><Text style={styles.qaBadgeText}>Q&A</Text></View>}
                </View>
                {signup.event_date ? <Text style={styles.signupDate}>{signup.event_date}</Text> : null}
                {signup.event_description ? <Text style={styles.signupDesc} numberOfLines={2}>{signup.event_description}</Text> : null}
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textLight} style={{ margin: 16 }} />
            </TouchableOpacity>
          ))}
          {signups.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="clipboard-outline" size={48} color={Colors.textLight} />
              <Text style={styles.emptyText}>No active sign-ups</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

import { RefreshControl } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E5E5' },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: Colors.textDark, flex: 1, textAlign: 'center' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, gap: 12 },
  signupCard: { backgroundColor: '#fff', borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: Colors.border, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  signupImage: { width: '100%', height: 160 },
  signupInfo: { padding: 16 },
  signupTitle: { fontSize: 17, fontWeight: '700', color: Colors.textDark },
  signupDate: { fontSize: 13, color: Colors.primary, fontWeight: '500', marginBottom: 6 },
  signupDesc: { fontSize: 14, color: Colors.textMedium, lineHeight: 20 },
  qaBadge: { backgroundColor: Colors.primary + '15', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  qaBadgeText: { fontSize: 11, fontWeight: '600', color: Colors.primary },
  eventImage: { width: '100%', height: 200 },
  eventDetail: { padding: 20 },
  eventDetailTitle: { fontSize: 22, fontWeight: '700', color: Colors.textDark, marginBottom: 4 },
  eventDate: { fontSize: 14, color: Colors.primary, fontWeight: '500', marginBottom: 12 },
  eventDesc: { fontSize: 15, color: Colors.textMedium, lineHeight: 24, marginBottom: 24 },
  actionButtons: { gap: 12 },
  actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.primary, padding: 16, borderRadius: 12 },
  actionButtonOutline: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: Colors.primary },
  actionButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  formContent: { padding: 20, gap: 4 },
  formSection: { fontSize: 18, fontWeight: '700', color: Colors.textDark, marginTop: 16, marginBottom: 8 },
  fieldContainer: { marginBottom: 16 },
  fieldLabel: { fontSize: 14, fontWeight: '500', color: Colors.textMedium, marginBottom: 6 },
  fieldInput: { borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 12, fontSize: 15, color: Colors.textDark, backgroundColor: '#fafafa' },
  fieldInputMultiline: { height: 90, textAlignVertical: 'top' },
  selectButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 12, backgroundColor: '#fafafa' },
  selectValue: { fontSize: 15, color: Colors.textDark },
  selectPlaceholder: { fontSize: 15, color: Colors.textLight },
  selectOptions: { borderWidth: 1, borderColor: Colors.border, borderRadius: 10, marginTop: 4, backgroundColor: '#fff', overflow: 'hidden' },
  selectOption: { padding: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
  selectOptionText: { fontSize: 15, color: Colors.textDark },
  selectOptionActive: { color: Colors.primary, fontWeight: '600' },
  submitButton: { backgroundColor: Colors.primary, padding: 18, borderRadius: 12, alignItems: 'center' },
  submitText: { fontSize: 17, fontWeight: '700', color: '#fff' },
  qaIntro: { alignItems: 'center', marginBottom: 24, padding: 20, backgroundColor: Colors.primary + '08', borderRadius: 14 },
  qaTitle: { fontSize: 20, fontWeight: '700', color: Colors.textDark, marginBottom: 8, textAlign: 'center' },
  qaSubtitle: { fontSize: 14, color: Colors.textMedium, textAlign: 'center', lineHeight: 20 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 16, color: Colors.textLight },
});

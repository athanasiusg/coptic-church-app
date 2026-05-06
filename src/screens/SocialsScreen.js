import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { SOCIAL_LINKS } from '../data';

export default function SocialsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Follow Us</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
        <Text style={styles.subtitle}>Stay connected with your church on social media</Text>
        {SOCIAL_LINKS.map((link, index) => (
          <TouchableOpacity
            key={link.id}
            style={styles.socialRow}
            activeOpacity={0.7}
            onPress={() => Linking.openURL(link.url)}
          >
            <View style={[styles.iconWrap, { backgroundColor: link.bg }]}>
              <Ionicons name={link.icon} size={26} color="#fff" />
            </View>
            <Text style={styles.socialName}>{link.name}</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
          </TouchableOpacity>
        ))}
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
  subtitle: { fontSize: 15, color: Colors.textMedium, marginBottom: 24, lineHeight: 22 },
  socialRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
  iconWrap: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  socialName: { flex: 1, fontSize: 17, fontWeight: '500', color: Colors.textDark },
});

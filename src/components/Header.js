import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { CHURCH_INFO } from '../data';

export default function Header({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.inner}>
        <View style={styles.left}>
          <View style={styles.logoMark}><Ionicons name="business-outline" size={24} color={Colors.primary} /></View>
          <View style={styles.titleRow}>
            <Text style={styles.churchName}>{CHURCH_INFO.shortName}</Text>
          </View>
        </View>
        <View style={styles.right}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFFFFF', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E5E5' },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 52 },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  logoMark: { width: 36, height: 36, borderRadius: 8, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  churchName: { fontSize: 17, fontWeight: '700', color: Colors.primary, letterSpacing: -0.3 },
  right: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { padding: 6, marginLeft: 4 },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Linking, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { CHURCH_INFO, HOME_CARDS } from '../data';

const YOUTUBE_LIVE_URL = HOME_CARDS.find((card) => card.screen === 'LiveStream')?.liveUrl || 'https://www.youtube.com/channel/YOUR_CHANNEL_ID';

export default function LiveStreamScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Stream</Text>
        <View style={{ width: 36 }} />
      </View>
      <ImageBackground
        source={{ uri: 'https://orthodoxy.life/wp-content/uploads/2016/07/capture-4.jpg' }}
        style={styles.content}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.centerContent}>
          <Ionicons name="logo-youtube" size={64} color="#FF0000" />
          <Text style={styles.churchName}>{CHURCH_INFO.name}</Text>
          <Text style={styles.subtitle}>البث المباشر</Text>
          <TouchableOpacity style={styles.watchButton} onPress={() => Linking.openURL(YOUTUBE_LIVE_URL)}>
            <Ionicons name="play-circle" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.watchText}>Watch Live on YouTube</Text>
          </TouchableOpacity>
          <Text style={styles.note}>Opens in YouTube app</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#000' },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#fff' },
  content: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.65)' },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  churchName: { fontSize: 20, fontWeight: '700', color: '#fff', textAlign: 'center', marginTop: 20, marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 40 },
  watchButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 14, marginBottom: 12 },
  watchText: { fontSize: 17, fontWeight: '600', color: '#fff' },
  note: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
});

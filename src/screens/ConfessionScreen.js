import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

const PRIESTS = [
  {
    id: '1',
    name: 'Fr. Paul Baky Mikhail',
    arabicName: 'أبونا بولس باكي',
    url: 'https://calendly.com/paul5m/confession-w-fr-paul',
    image: 'https://www.lacopts.org/wp-content/uploads/2022/06/Fr-Boules-Baky-1-264x300.jpg',
  },
  {
    id: '2',
    name: 'Fr. Augustine Ibrahim',
    arabicName: 'أبونا أغسطينوس إبراهيم',
    url: 'https://confesswfra.as.me/schedule/6ab11f66',
    image: 'https://www.lacopts.org/wp-content/uploads/2023/01/Fr-Augustine-Iskander-243x300.jpg',
  },
];

export default function ConfessionScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedPriest, setSelectedPriest] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => selectedPriest ? setSelectedPriest(null) : navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectedPriest ? selectedPriest.name : 'Confession'}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      {!selectedPriest ? (
        <View style={styles.content}>
          <Text style={styles.subtitle}>Select a priest to book your confession appointment</Text>
          {PRIESTS.map((priest) => (
            <TouchableOpacity
              key={priest.id}
              style={styles.priestCard}
              activeOpacity={0.8}
              onPress={() => setSelectedPriest(priest)}
            >
              <View style={styles.priestIcon}>
  {priest.image ? (
    <Image source={{ uri: priest.image }} style={styles.priestPhoto} resizeMode="cover" />
  ) : (
    <Ionicons name="person" size={28} color={Colors.primary} />
  )}
</View>
              <View style={styles.priestInfo}>
                <Text style={styles.priestName}>{priest.name}</Text>
                <Text style={styles.priestArabic}>{priest.arabicName}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.webviewContainer}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          )}
          <WebView
            source={{ uri: selectedPriest.url }}
            style={styles.webview}
            onLoadEnd={() => setLoading(false)}
            javaScriptEnabled
            domStorageEnabled
          />
        </View>
      )}
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
  priestCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: Colors.border, marginBottom: 12, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  priestIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  priestPhoto: {width: 52, height: 62, marginTop: -10 },
  priestInfo: { flex: 1 },
  priestName: { fontSize: 16, fontWeight: '600', color: Colors.textDark, marginBottom: 4 },
  priestArabic: { fontSize: 13, color: Colors.textLight },
  webviewContainer: { flex: 1 },
  webview: { flex: 1 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', zIndex: 1 },
});

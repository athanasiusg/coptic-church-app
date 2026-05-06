import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ImageBackground, Image, StatusBar, Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { Colors } from '../theme/colors';
import { COMMUNITY_CARDS } from '../data';

const DIOCESE_RESOURCES = [
  { id: 'r1', title: 'LA Diakonia', subtitle: 'Diakonia and Development Department', imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=200&q=80', url: 'https://ladiakonia.org' },
];

export default function CommunityScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const handleCardPress = (card) => {
    if (card.url) {
      navigation.navigate('WebView', { url: card.url, title: card.title });
    } else if (card.screen) {
      navigation.navigate(card.screen);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.headerBg} />
      <Header navigation={navigation} />
      <ScrollView style={styles.scroll} contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsSection}>
          <TouchableOpacity style={styles.cardWrapper} activeOpacity={0.88} onPress={() => navigation.navigate('Photos')}>
            <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80' }} style={styles.card} imageStyle={styles.cardImage}>
              <View style={styles.cardOverlay} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>📸 Photos</Text>
                <Text style={styles.cardSubtitle}>Church albums & memories</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          {COMMUNITY_CARDS.map((card) => (
            <TouchableOpacity key={card.id} style={styles.cardWrapper} activeOpacity={0.88} onPress={() => handleCardPress(card)}>
              <ImageBackground source={{ uri: card.imageUrl }} style={styles.card} imageStyle={styles.cardImage}>
                <View style={styles.cardOverlay} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                  {card.subtitle ? <Text style={styles.cardSubtitle}>{card.subtitle}</Text> : null}
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Diocese Resources</Text></View>
        <View style={styles.resourcesList}>
          {DIOCESE_RESOURCES.map((item, index) => (
            <TouchableOpacity key={item.id} style={[styles.resourceRow, index < DIOCESE_RESOURCES.length - 1 && styles.resourceRowBorder]} activeOpacity={0.7} onPress={() => Linking.openURL(item.url)}>
              <View style={styles.resourceIcon}><Image source={{ uri: item.imageUrl }} style={styles.resourceImage} resizeMode="cover" /></View>
              <View style={styles.resourceText}>
                <Text style={styles.resourceTitle}>{item.title}</Text>
                <Text style={styles.resourceSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 8 },
  cardsSection: { paddingHorizontal: 12, gap: 10 },
  cardWrapper: { borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  card: { width: '100%', height: 130, justifyContent: 'flex-end' },
  cardImage: { borderRadius: 14 },
  cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.40)', borderRadius: 14 },
  cardContent: { padding: 16 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  cardSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  sectionHeader: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 8 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: Colors.textDark },
  resourcesList: { backgroundColor: Colors.background, marginHorizontal: 12, borderRadius: 14, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: Colors.border },
  resourceRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  resourceRowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
  resourceIcon: { width: 52, height: 52, borderRadius: 10, overflow: 'hidden', marginRight: 14 },
  resourceImage: { width: 52, height: 52 },
  resourceText: { flex: 1 },
  resourceTitle: { fontSize: 15, fontWeight: '500', color: Colors.textDark, marginBottom: 2 },
  resourceSubtitle: { fontSize: 13, color: Colors.textLight },
});

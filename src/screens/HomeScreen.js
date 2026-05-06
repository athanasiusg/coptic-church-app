import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, StatusBar, Linking, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../components/Header';
import UpcomingEvents from '../components/UpcomingEvents';
import { Colors } from '../theme/colors';
import { HOME_CARDS } from '../data';

const { width } = Dimensions.get('window');
const CARD_HEIGHT = 160;

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleCardPress = (card) => {
    if (card.screen === 'Announcements') {
      navigation.navigate('Announcements');
    } else if (card.screen === 'LiveStream') {
      navigation.navigate('LiveStream');
    } else if (card.screen === 'Giving' && card.givingUrl) {
      Linking.openURL(card.givingUrl);
    } else if (card.screen === 'Sermons') {
      navigation.navigate('Sermons');
    } else if (card.screen === 'Gallery') {
      Linking.openURL('https://yourwebsite.com/gallery');
    } else if (card.screen === 'Confession') {
      navigation.navigate('Confession');
    } else if (card.screen === 'Socials') {
      navigation.navigate('Socials');
    } else if (card.screen === 'Signups') {
      navigation.navigate('Signups');
    } else {
      console.log('Navigate to:', card.screen);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.headerBg} />
      <Header navigation={navigation} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 16 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        <UpcomingEvents navigation={navigation} />
        {HOME_CARDS.map((card) => (
          <TouchableOpacity
            key={card.id}
            activeOpacity={0.88}
            onPress={() => handleCardPress(card)}
            style={styles.cardWrapper}
          >
            <ImageBackground
              source={{ uri: card.imageUrl }}
              style={styles.card}
              imageStyle={[styles.cardImage, card.imageTop ? { top: card.imageTop } : {}]}
            >
              <View style={styles.cardOverlay} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                {card.subtitle ? (
                  <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                ) : null}
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 8, paddingHorizontal: 12, gap: 10 },
  cardWrapper: { borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 4 },
  card: { width: '100%', height: CARD_HEIGHT, justifyContent: 'flex-end' },
  cardImage: { borderRadius: 14 },
  cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.36)', borderRadius: 14 },
  cardContent: { padding: 18, paddingBottom: 20 },
  cardTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.2, textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  cardSubtitle: { fontSize: 14, fontWeight: '400', color: 'rgba(255,255,255,0.88)', marginTop: 2 },
});

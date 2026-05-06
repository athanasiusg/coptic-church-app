import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, ImageBackground, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { Colors } from '../theme/colors';

const SERVICES = [
  {
    id: '1',
    title: 'MyDailyWay Ministry',
    subtitle: '6AM Bible Study — Tue, Wed, Thu, Fri',
    imageUrl: 'https://s3.us-east-2.wasabisys.com/media-oaj/wp-content/uploads/2015/09/02140948/FullSizeRender.jpg',
    url: 'https://us02web.zoom.us/j/83006040371?pwd=TUx5SVVQOUNxR2RyRXIzQmRqd25aUT09',
  },
  {
    id: '2',
    title: 'Lord at Rest Bible Service',
    subtitle: 'Weekly on Mondays — 9:30 PM via ZOOM',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeq5hjrT73KEMM0wt6OPoSUC_pNc2ua7vpRQ&s',
    url: null,
  },
  {
    id: '3',
    title: 'Find Him in 15',
    subtitle: 'Youth Outreach Ministry',
    imageUrl: 'https://saintantonygiftshop.com/cdn/shop/files/IMG_3544copy.jpg?v=1710880866&width=1445',
    url: null,
  },
  {
    id: '4',
    title: 'Kenonia Young Adult Meeting',
    subtitle: 'Weekly on Tuesdays — 8:00 PM',
    imageUrl: 'https://copticiconography.com/wp-content/uploads/2020/01/pentecost_detail.jpg?w=1272',
    url: null,
  },
  {
    id: '5',
    title: 'Hymns Classes',
    subtitle: 'Weekly on Saturdays — 5:00 PM',
    imageUrl: 'https://coptic.gallery/images/virtuemart/product/augustin3.png',
    url: null,
  },
];

export default function ServicesScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.headerBg} />
      <Header navigation={navigation} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsSection}>
          {SERVICES.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.cardWrapper}
              activeOpacity={0.88}
              onPress={() => service.url ? Linking.openURL(service.url) : null}
            >
              <ImageBackground
                source={{ uri: service.imageUrl }}
                style={styles.card}
                imageStyle={styles.cardImage}
              >
                <View style={styles.cardOverlay} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{service.title}</Text>
                  {service.subtitle ? (
                    <Text style={styles.cardSubtitle}>{service.subtitle}</Text>
                  ) : null}
                </View>
              </ImageBackground>
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
  card: { width: '100%', height: 150, justifyContent: 'flex-end' },
  cardImage: { borderRadius: 14 },
  cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 14 },
  cardContent: { padding: 16 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  cardSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
});

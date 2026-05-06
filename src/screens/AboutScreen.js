import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { Colors } from '../theme/colors';
import { CHURCH_INFO, SOCIAL_LINKS } from '../data';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1507036066871-b7e8032b3dea?w=1200&q=80';
const GIVING_URL = 'https://yourwebsite.com/donate';

export default function AboutScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const handleDonate = () => Linking.openURL(GIVING_URL);
  const handleSocial = (url) => { if (url) Linking.openURL(url); };
  const handlePhone = () => Linking.openURL(`tel:${CHURCH_INFO.phone}`);
  const handleEmail = () => Linking.openURL(`mailto:${CHURCH_INFO.email}`);
  const handleWebsite = () => Linking.openURL(CHURCH_INFO.website);
  const handleAddress = () => {
    const address = encodeURIComponent(CHURCH_INFO.address);
    const url = Platform.OS === 'ios'
      ? `maps://maps.apple.com/?q=${address}`
      : `geo:0,0?q=${address}`;
    Linking.openURL(url).catch(() => Linking.openURL(`https://maps.google.com/?q=${address}`));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.headerBg} />
      <Header navigation={navigation} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: HERO_IMAGE }} style={styles.heroImage} resizeMode="cover" />

        <View style={styles.aboutSection}>
          <Text style={styles.aboutText}>{CHURCH_INFO.about}</Text>
        </View>

        <View style={styles.donateSection}>
          <TouchableOpacity style={styles.donateButton} activeOpacity={0.8} onPress={handleDonate}>
            <Text style={styles.donateText}>Donate</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Contact</Text>
        </View>
        <View style={styles.contactList}>
          <TouchableOpacity style={styles.contactRow} onPress={handlePhone}>
            <View style={styles.contactIconWrap}>
              <Ionicons name="call-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.contactText}>{CHURCH_INFO.phone}</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
          </TouchableOpacity>
          <View style={styles.rowDivider} />
          <TouchableOpacity style={styles.contactRow} onPress={handleEmail}>
            <View style={styles.contactIconWrap}>
              <Ionicons name="mail-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.contactText}>{CHURCH_INFO.email}</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
          </TouchableOpacity>
          <View style={styles.rowDivider} />
          <TouchableOpacity style={styles.contactRow} onPress={handleWebsite}>
            <View style={styles.contactIconWrap}>
              <Ionicons name="globe-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.contactText}>{CHURCH_INFO.website.replace(/^https?:\/\//, '')}</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
          </TouchableOpacity>
          <View style={styles.rowDivider} />
          <TouchableOpacity style={styles.contactRow} onPress={handleAddress}>
            <View style={styles.contactIconWrap}>
              <Ionicons name="location-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.contactText} numberOfLines={2}>{CHURCH_INFO.address}</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Connect</Text>
        </View>
        <View style={styles.contactList}>
          {SOCIAL_LINKS.map((link, index) => (
            <View key={link.id}>
              <TouchableOpacity style={styles.socialRow} activeOpacity={0.7} onPress={() => handleSocial(link.url)}>
                <View style={[styles.socialIconWrap, { backgroundColor: link.bg }]}>
                  <Ionicons name={link.icon} size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.socialName}>{link.name}</Text>
                <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
              </TouchableOpacity>
              {index < SOCIAL_LINKS.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 0 },
  heroImage: { width: '100%', height: 220 },
  aboutSection: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  aboutText: { fontSize: 15, lineHeight: 24, color: Colors.textMedium },
  donateSection: { paddingHorizontal: 20, paddingVertical: 16 },
  donateButton: { borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  donateText: { fontSize: 16, fontWeight: '500', color: Colors.primary },
  sectionHeader: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: Colors.textDark },
  contactList: { marginHorizontal: 12, backgroundColor: Colors.background, borderRadius: 14, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: Colors.border },
  contactRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  contactIconWrap: { width: 34, height: 34, borderRadius: 8, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  contactText: { flex: 1, fontSize: 15, color: Colors.textDark },
  rowDivider: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.border, marginLeft: 60 },
  socialRow: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  socialIconWrap: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  socialName: { flex: 1, fontSize: 16, fontWeight: '400', color: Colors.textDark },
});

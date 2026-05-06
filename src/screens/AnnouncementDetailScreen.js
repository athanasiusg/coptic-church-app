import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Image, Linking, Dimensions, FlatList, Modal, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

function TextWithLinks({ text, style }) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return (
    <Text style={style}>
      {parts.map((part, index) =>
        urlRegex.test(part) ? (
          <Text key={index} style={styles.link} onPress={() => Linking.openURL(part)}>{part}</Text>
        ) : (
          <Text key={index}>{part}</Text>
        )
      )}
    </Text>
  );
}

function getImages(announcement) {
  if (announcement.images) {
    if (Array.isArray(announcement.images) && announcement.images.length > 0) return announcement.images;
    if (typeof announcement.images === 'string') {
      try {
        const parsed = JSON.parse(announcement.images);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
  }
  if (announcement.image_url) return [announcement.image_url];
  return [];
}

async function saveImageToLibrary(url) {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Please allow access to save photos.'); return; }
    const filename = FileSystem.documentDirectory + 'photo_' + Date.now() + '.jpg';
    const { uri } = await FileSystem.downloadAsync(url, filename);
    await MediaLibrary.saveToLibraryAsync(uri);
    Alert.alert('✅ Saved!', 'Photo saved to your camera roll.');
  } catch { Alert.alert('Error', 'Could not save photo.'); }
}

function FullscreenGallery({ images, startIndex, onClose }) {
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const insets = useSafeAreaInsets();

  return (
    <Modal visible animationType="fade" statusBarTranslucent>
      <View style={styles.fullscreenContainer}>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={startIndex}
          getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
          keyExtractor={(_, i) => i.toString()}
          onMomentumScrollEnd={e => setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
          renderItem={({ item }) => (
            <ScrollView
              style={{ width, height }}
              maximumZoomScale={4}
              minimumZoomScale={1}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              centerContent
            >
              <TouchableOpacity activeOpacity={1} onLongPress={() => saveImageToLibrary(item)}>
                <Image source={{ uri: item }} style={{ width, height }} resizeMode="contain" />
              </TouchableOpacity>
            </ScrollView>
          )}
        />

        <TouchableOpacity style={[styles.closeBtn, { top: insets.top + 10 }]} onPress={onClose}>
          <Ionicons name="close" size={26} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, { bottom: insets.bottom + 20 }]}
          onPress={() => saveImageToLibrary(images[activeIndex])}
        >
          <Ionicons name="download-outline" size={18} color="#fff" />
          <Text style={styles.saveBtnText}>Save Photo</Text>
        </TouchableOpacity>

        {images.length > 1 && (
          <View style={[styles.fullscreenDots, { bottom: insets.bottom + 65 }]}>
            {images.map((_, i) => (
              <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
            ))}
          </View>
        )}

        <Text style={[styles.hintText, { top: insets.top + 52 }]}>Pinch to zoom · Long press to save</Text>
      </View>
    </Modal>
  );
}

function ImageGallery({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState(null);

  if (!images || images.length === 0) return null;

  return (
    <View style={styles.galleryContainer}>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        onMomentumScrollEnd={e => setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item, index }) => (
          <TouchableOpacity activeOpacity={0.9} onPress={() => setFullscreenIndex(index)} onLongPress={() => saveImageToLibrary(item)}>
            <Image source={{ uri: item }} style={styles.galleryImage} resizeMode="cover" />
          </TouchableOpacity>
        )}
      />
      {images.length > 1 && (
        <View style={styles.dots}>
          {images.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
          ))}
        </View>
      )}
      <Text style={styles.imageCount}>
        {images.length > 1 ? `${activeIndex + 1} / ${images.length} · ` : ''}Tap to view · Long press to save
      </Text>

      {fullscreenIndex !== null && (
        <FullscreenGallery images={images} startIndex={fullscreenIndex} onClose={() => setFullscreenIndex(null)} />
      )}
    </View>
  );
}

export default function AnnouncementDetailScreen({ route, navigation }) {
  const { announcement } = route.params;
  const insets = useSafeAreaInsets();
  const images = getImages(announcement);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Announcement</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
        <View style={styles.body}>
          {announcement.date ? <Text style={styles.date}>{announcement.date}</Text> : null}
          <Text style={styles.title}>{announcement.title}</Text>
          <TextWithLinks text={announcement.body || ''} style={styles.text} />
        </View>
        <ImageGallery images={images} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E5E5' },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: Colors.textDark, flex: 1, textAlign: 'center' },
  content: { paddingBottom: 32 },
  body: { padding: 20 },
  date: { fontSize: 12, color: Colors.textLight, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.textDark, marginBottom: 16, lineHeight: 32 },
  text: { fontSize: 16, color: Colors.textMedium, lineHeight: 26 },
  link: { color: Colors.primary, textDecorationLine: 'underline' },
  galleryContainer: { marginTop: 8 },
  galleryImage: { width, height: 280 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ddd' },
  dotActive: { backgroundColor: Colors.primary, width: 18 },
  imageCount: { textAlign: 'center', fontSize: 12, color: Colors.textLight, marginTop: 6, marginBottom: 8 },
  fullscreenContainer: { flex: 1, backgroundColor: '#000' },
  closeBtn: { position: 'absolute', left: 16, zIndex: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  saveBtn: { position: 'absolute', alignSelf: 'center', left: width / 2 - 70, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,0,0,0.7)', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  fullscreenDots: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  hintText: { position: 'absolute', left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 12 },
});

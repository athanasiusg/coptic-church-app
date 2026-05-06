import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Image, ActivityIndicator, FlatList, Dimensions, Alert, Modal, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Colors } from '../theme/colors';
import { supabase } from '../supabase';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 4) / 3;

export default function PhotosScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const onRefresh = async () => { setRefreshing(true); await fetchAlbums(); setRefreshing(false); };

  const fetchAlbums = async () => {
    try {
      const { data, error } = await supabase
        .from('photo_albums')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAlbums(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPhotos = async (album) => {
    setSelectedAlbum(album);
    setPhotosLoading(true);
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('album_id', album.id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setPhotosLoading(false);
    }
  };

  const savePhoto = async (url) => {
    setSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to save photos.');
        setSaving(false);
        return;
      }
      const filename = FileSystem.documentDirectory + 'photo_' + Date.now() + '.jpg';
      const { uri } = await FileSystem.downloadAsync(url, filename);
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Saved!', 'Photo saved to your camera roll.');
    } catch (error) {
      Alert.alert('Error', 'Could not save photo.');
    } finally {
      setSaving(false);
    }
  };

  if (selectedPhoto) {
    return (
      <Modal visible={true} backgroundColor="#000" animationType="fade">
        <View style={styles.fullscreenContainer}>
          <TouchableOpacity style={[styles.closeBtn, { top: insets.top + 10 }]} onPress={() => setSelectedPhoto(null)}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Image source={{ uri: selectedPhoto.url }} style={styles.fullscreenImage} resizeMode="contain" />
          <TouchableOpacity
            style={[styles.saveBtn, { bottom: insets.bottom + 20 }]}
            onPress={() => savePhoto(selectedPhoto.url)}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="download-outline" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>Save to Camera Roll</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  if (selectedAlbum) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => { setSelectedAlbum(null); setPhotos([]); }}>
            <Ionicons name="chevron-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{selectedAlbum.title}</Text>
          <View style={{ width: 36 }} />
        </View>
        {photosLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            data={photos}
            numColumns={3}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedPhoto(item)} activeOpacity={0.8}>
                <Image source={{ uri: item.url }} style={styles.gridPhoto} resizeMode="cover" />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="images-outline" size={48} color={Colors.textLight} />
                <Text style={styles.emptyText}>No photos yet</Text>
              </View>
            }
          />
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Photos</Text>
        <View style={{ width: 36 }} />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
          {albums.map((album) => (
            <TouchableOpacity
              key={album.id}
              style={styles.albumCard}
              activeOpacity={0.8}
              onPress={() => fetchPhotos(album)}
            >
              {album.cover_url ? (
                <Image source={{ uri: album.cover_url }} style={styles.albumCover} resizeMode="cover" />
              ) : (
                <View style={[styles.albumCover, styles.albumPlaceholder]}>
                  <Ionicons name="images-outline" size={40} color={Colors.textLight} />
                </View>
              )}
              <View style={styles.albumOverlay} />
              <View style={styles.albumInfo}>
                <Text style={styles.albumTitle}>{album.title}</Text>
                {album.date ? <Text style={styles.albumDate}>{album.date}</Text> : null}
              </View>
            </TouchableOpacity>
          ))}
          {albums.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="images-outline" size={48} color={Colors.textLight} />
              <Text style={styles.emptyText}>No albums yet</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E5E5' },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: Colors.textDark, flex: 1, textAlign: 'center' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, gap: 16 },
  albumCard: { borderRadius: 14, overflow: 'hidden', height: 180, justifyContent: 'flex-end' },
  albumCover: { ...StyleSheet.absoluteFillObject },
  albumPlaceholder: { backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  albumOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  albumInfo: { padding: 16 },
  albumTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  albumDate: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  gridPhoto: { width: PHOTO_SIZE, height: PHOTO_SIZE, margin: 0.5 },
  fullscreenContainer: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  fullscreenImage: { width: '100%', height: '80%' },
  closeBtn: { position: 'absolute', left: 16, zIndex: 10, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
  saveBtn: { position: 'absolute', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.primary, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 30 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 16, color: Colors.textLight },
});

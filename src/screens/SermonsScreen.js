import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { Colors } from '../theme/colors';
import { supabase } from '../supabase';

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function FileViewer({ file, onClose, insets }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{file.title}</Text>
        <View style={{ width: 36 }} />
      </View>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
      <WebView
        source={{ uri: file.file_url }}
        style={{ flex: 1 }}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled
      />
    </View>
  );
}

export default function SermonsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [sermons, setSermons] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSermon, setSelectedSermon] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('sermons');

  useEffect(() => {
    fetchSermons();
    fetchFiles();
  }, []);

  const onRefresh = async () => { setRefreshing(true); await fetchSermons(); await fetchFiles(); setRefreshing(false); };

  const fetchSermons = async () => {
    try {
      const { data, error } = await supabase.from('sermons').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setSermons(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase.from('sermon_files').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  if (selectedFile) {
    return <FileViewer file={selectedFile} onClose={() => setSelectedFile(null)} insets={insets} />;
  }

  if (selectedSermon) {
    const videoId = getYouTubeId(selectedSermon.youtube_url);
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedSermon(null)}>
            <Ionicons name="chevron-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{selectedSermon.title}</Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
          {videoId ? (
            <View style={styles.videoContainer}>
              <WebView source={{ uri: `https://www.youtube.com/embed/${videoId}?autoplay=1` }} style={styles.video} allowsFullscreenVideo javaScriptEnabled />
            </View>
          ) : selectedSermon.youtube_url ? (
            <View style={styles.videoContainer}>
              <WebView source={{ uri: selectedSermon.youtube_url }} style={styles.video} allowsFullscreenVideo javaScriptEnabled />
            </View>
          ) : null}
          <View style={styles.sermonDetail}>
            <Text style={styles.sermonDetailTitle}>{selectedSermon.title}</Text>
            {selectedSermon.speaker ? <Text style={styles.sermonSpeaker}>{selectedSermon.speaker}</Text> : null}
            {selectedSermon.date ? <Text style={styles.sermonDate}>{selectedSermon.date}</Text> : null}
            {selectedSermon.description ? <Text style={styles.sermonDesc}>{selectedSermon.description}</Text> : null}
          </View>
        </ScrollView>
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
        <Text style={styles.headerTitle}>Sermons</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tab, activeTab === 'sermons' && styles.activeTab]} onPress={() => setActiveTab('sermons')}>
          <Text style={[styles.tabText, activeTab === 'sermons' && styles.activeTabText]}>Videos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'files' && styles.activeTab]} onPress={() => setActiveTab('files')}>
          <Text style={[styles.tabText, activeTab === 'files' && styles.activeTabText]}>Files & Notes</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : activeTab === 'sermons' ? (
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
          {sermons.map((sermon) => (
            <TouchableOpacity key={sermon.id} style={styles.sermonCard} activeOpacity={0.8} onPress={() => setSelectedSermon(sermon)}>
              {sermon.image_url ? <Image source={{ uri: sermon.image_url }} style={styles.sermonImage} resizeMode="cover" /> : null}
              <View style={styles.sermonInfo}>
                <Text style={styles.sermonTitle}>{sermon.title}</Text>
                {sermon.speaker ? <Text style={styles.sermonMeta}>{sermon.speaker}</Text> : null}
                {sermon.date ? <Text style={styles.sermonMeta}>{sermon.date}</Text> : null}
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
            </TouchableOpacity>
          ))}
          {sermons.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="mic-outline" size={48} color={Colors.textLight} />
              <Text style={styles.emptyText}>No sermons yet</Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
          {files.map((file) => (
            <TouchableOpacity key={file.id} style={styles.fileCard} activeOpacity={0.8} onPress={() => setSelectedFile(file)}>
              <View style={styles.fileIcon}>
                <Ionicons
                  name={file.file_type === 'image' ? 'image' : 'document-text'}
                  size={28}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.fileInfo}>
                <Text style={styles.fileTitle}>{file.title}</Text>
                {file.description ? <Text style={styles.fileMeta}>{file.description}</Text> : null}
                {file.date ? <Text style={styles.fileMeta}>{file.date}</Text> : null}
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
            </TouchableOpacity>
          ))}
          {files.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color={Colors.textLight} />
              <Text style={styles.emptyText}>No files yet</Text>
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
  tabBar: { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabText: { fontSize: 15, fontWeight: '500', color: Colors.textLight },
  activeTabText: { color: Colors.primary },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', zIndex: 1 },
  content: { padding: 16, gap: 12 },
  sermonCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: Colors.border, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  sermonImage: { width: 90, height: 90 },
  sermonInfo: { flex: 1, padding: 12 },
  sermonTitle: { fontSize: 15, fontWeight: '600', color: Colors.textDark, marginBottom: 4 },
  sermonMeta: { fontSize: 13, color: Colors.textLight, marginBottom: 2 },
  videoContainer: { width: '100%', height: 220, backgroundColor: '#000' },
  video: { flex: 1 },
  sermonDetail: { padding: 20 },
  sermonDetailTitle: { fontSize: 22, fontWeight: '700', color: Colors.textDark, marginBottom: 8 },
  sermonSpeaker: { fontSize: 15, fontWeight: '500', color: Colors.primary, marginBottom: 4 },
  sermonDate: { fontSize: 13, color: Colors.textLight, marginBottom: 12 },
  sermonDesc: { fontSize: 15, color: Colors.textMedium, lineHeight: 24 },
  fileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: Colors.border, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  fileIcon: { width: 52, height: 52, borderRadius: 12, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  fileInfo: { flex: 1 },
  fileTitle: { fontSize: 15, fontWeight: '600', color: Colors.textDark, marginBottom: 4 },
  fileMeta: { fontSize: 13, color: Colors.textLight, marginBottom: 2 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 16, color: Colors.textLight },
});

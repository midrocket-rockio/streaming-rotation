import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useWatchlist } from '../src/hooks/useWatchlist';
import { WatchlistItemCard } from '../src/components/WatchlistItem';

export default function WatchlistScreen() {
  const { items, stats, addItem, toggleWatched, removeItem } = useWatchlist();
  const [newTitle, setNewTitle] = useState('');
  const [newService, setNewService] = useState('Netflix');
  const [newType, setNewType] = useState<'show' | 'movie'>('show');

  const services = ['Netflix', 'Spotify', 'Disney', 'Amazon', 'Hulu', 'HBO', 'Apple TV+'];

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addItem({ title: newTitle.trim(), type: newType, service: newService, watched: false, notes: '' });
    setNewTitle('');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Watchlist</Text>
        <Text style={styles.subtitle}>Track what to watch next</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{stats.watched}</Text>
          <Text style={styles.statLabel}>Watched</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{stats.unwatched}</Text>
          <Text style={styles.statLabel}>Unwatched</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{stats.progress}%</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
      </View>

      <View style={styles.addSection}>
        <TextInput
          style={styles.input}
          placeholder="Title..."
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Service</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {services.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.serviceChip, newService === s && styles.serviceChipActive]}
                  onPress={() => setNewService(s)}
                >
                  <Text style={[styles.serviceChipText, newService === s && styles.serviceChipTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeRow}>
              <TouchableOpacity style={[styles.typeBtn, newType === 'show' && styles.typeBtnActive]} onPress={() => setNewType('show')}>
                <Text style={[styles.typeText, newType === 'show' && styles.typeTextActive]}>Show</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.typeBtn, newType === 'movie' && styles.typeBtnActive]} onPress={() => setNewType('movie')}>
                <Text style={[styles.typeText, newType === 'movie' && styles.typeTextActive]}>Movie</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>+ Add to Watchlist</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listSection}>
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <WatchlistItemCard
              item={item}
              onToggle={() => toggleWatched(item.id)}
              onDelete={() => removeItem(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Your watchlist is empty</Text>
              <Text style={styles.emptySub}>Add shows and movies to track</Text>
            </View>
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, backgroundColor: '#0f172a' },
  title: { fontSize: 24, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 14, color: '#94a3b8', marginTop: 4 },
  statsRow: { flexDirection: 'row', padding: 16, gap: 8 },
  statBox: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  statNum: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  statLabel: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  addSection: { padding: 16, gap: 12 },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 12, fontSize: 16, backgroundColor: '#fff' },
  row: { flexDirection: 'row', gap: 12 },
  halfInput: { flex: 1 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 4 },
  serviceChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', marginRight: 6 },
  serviceChipActive: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
  serviceChipText: { fontSize: 12, color: '#334155', fontWeight: '600' },
  serviceChipTextActive: { color: '#fff' },
  typeRow: { flexDirection: 'row', gap: 8 },
  typeBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0' },
  typeBtnActive: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
  typeText: { fontSize: 13, color: '#334155', fontWeight: '600' },
  typeTextActive: { color: '#fff' },
  addBtn: { backgroundColor: '#0f172a', padding: 14, borderRadius: 12, alignItems: 'center' },
  addBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  listSection: { padding: 16 },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#64748b' },
  emptySub: { fontSize: 14, color: '#94a3b8', marginTop: 4 },
});

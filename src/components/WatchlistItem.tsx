import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WatchlistItem } from '../types/rotation';

interface WatchlistItemProps {
  item: WatchlistItem;
  onToggle: () => void;
  onDelete: () => void;
}

export const WatchlistItemCard: React.FC<WatchlistItemProps> = ({ item, onToggle, onDelete }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <TouchableOpacity onPress={onToggle} style={styles.checkBtn}>
        <Text style={[styles.checkText, item.watched && styles.checkTextActive]}>{item.watched ? '✓' : '○'}</Text>
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={[styles.title, item.watched && styles.titleWatched]}>{item.title}</Text>
        <View style={styles.meta}>
          <View style={[styles.serviceBadge, { backgroundColor: getServiceColor(item.service) }]}>
            <Text style={styles.serviceText}>{item.service}</Text>
          </View>
          <Text style={styles.type}>{item.type}</Text>
          {item.rating && <Text style={styles.rating}>⭐ {item.rating}/5</Text>}
        </View>
        {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const getServiceColor = (service: string): string => {
  const colors: Record<string, string> = {
    Netflix: '#E50914',
    Spotify: '#1DB954',
    Disney: '#113CCF',
    Amazon: '#00A8E1',
    Hulu: '#1CE783',
    HBO: '#B535F6',
  };
  return colors[service] || '#64748b';
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkBtn: { padding: 4 },
  checkText: { fontSize: 22, color: '#cbd5e1' },
  checkTextActive: { color: '#10B981' },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  titleWatched: { textDecorationLine: 'line-through', color: '#94a3b8' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  serviceBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  serviceText: { fontSize: 11, color: '#fff', fontWeight: '600' },
  type: { fontSize: 12, color: '#94a3b8' },
  rating: { fontSize: 12, color: '#f59e0b' },
  notes: { fontSize: 13, color: '#64748b', marginTop: 4, fontStyle: 'italic' },
  deleteBtn: { padding: 4 },
  deleteText: { fontSize: 14, color: '#ef4444' },
});

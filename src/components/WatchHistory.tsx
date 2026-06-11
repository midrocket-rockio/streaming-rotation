// ─── Watch History Component ────────────────────────────────────

import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useWatchStore } from '@/stores/watchStore';
import { useRotationStore } from '@/stores/rotationStore';

export default function WatchHistory() {
  const watchHistory = useWatchStore((s) => s.watchHistory);
  const toggleFavorite = useWatchStore((s) => s.toggleFavorite);
  const services = useRotationStore((s) => s.services);

  const getServiceIcon = (serviceId: string) => {
    const svc = services.find((s) => s.id === serviceId);
    return svc?.icon || '📺';
  };

  const getServiceColor = (serviceId: string) => {
    const svc = services.find((s) => s.id === serviceId);
    return svc?.brandColor || '#666';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderHistoryItem = ({ item }: { item: typeof watchHistory[0] }) => (
    <View style={styles.card}>
      <View style={[styles.iconBadge, { backgroundColor: getServiceColor(item.serviceId) + '20' }]}>
        <Text style={styles.iconText}>{getServiceIcon(item.serviceId)}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.title}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
            <Text style={styles.favoriteIcon}>{item.favorite ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.service}>{item.service} • {item.type}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.date}>{formatDate(item.watchedAt)}</Text>
          <View style={styles.rating}>
            {Array.from({ length: 5 }, (_, i) => (
              <Text key={i} style={i < Math.round(item.rating / 2) ? styles.starFilled : styles.starEmpty}>
                ★
              </Text>
            ))}
          </View>
          <Text style={styles.ratingValue}>{item.rating.toFixed(1)}</Text>
        </View>
        {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
      </View>
    </View>
  );

  if (watchHistory.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>📺</Text>
        <Text style={styles.emptyText}>No viewing history yet</Text>
        <Text style={styles.emptySubtext}>Start tracking what you watch!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={watchHistory}
      keyExtractor={(item) => item.id}
      renderItem={renderHistoryItem}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  service: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  rating: {
    flexDirection: 'row',
    gap: 2,
  },
  starFilled: {
    color: '#FFD700',
    fontSize: 12,
  },
  starEmpty: {
    color: '#444',
    fontSize: 12,
  },
  ratingValue: {
    fontSize: 12,
    color: '#aaa',
    fontWeight: 'bold',
  },
  notes: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
    fontStyle: 'italic',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});

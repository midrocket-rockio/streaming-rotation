import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { ViewingHistory } from '@/types/rotation';

interface ViewingEntryProps {
  entry: ViewingHistory;
  onToggleFavorite: () => void;
  onRemove: () => void;
}

export default function ViewingEntry({
  entry,
  onToggleFavorite,
  onRemove,
}: ViewingEntryProps) {
  const typeEmoji = entry.type === 'series' ? '📺' : entry.type === 'movie' ? '🎬' : '📄';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Icon */}
        <View style={[styles.iconCircle, { backgroundColor: entry.serviceColor + '22' }]}>
          <Text style={styles.icon}>{typeEmoji}</Text>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {entry.title}
            </Text>
            {entry.isFavorite && <Text style={styles.favIcon}>⭐</Text>}
          </View>

          <View style={styles.metaRow}>
            <View style={[styles.serviceTag, { backgroundColor: entry.serviceColor + '33' }]}>
              <Text style={[styles.serviceTagText, { color: entry.serviceColor }]}>
                {entry.serviceIcon} {entry.serviceName}
              </Text>
            </View>
            <Text style={styles.genreText}>{entry.genre}</Text>
            <Text style={styles.yearText}>{entry.year}</Text>
          </View>

          {/* Rating */}
          <View style={styles.ratingRow}>
            {Array.from({ length: 5 }, (_, i) => (
              <Text key={i} style={[styles.star, i < entry.rating ? styles.starFilled : styles.starEmpty]}>
                ★
              </Text>
            ))}
          </View>

          {/* Notes */}
          {entry.notes && (
            <Text style={styles.notes} numberOfLines={2}>
              {entry.notes}
            </Text>
          )}

          {/* Date */}
          <Text style={styles.date}>
            {new Date(entry.watchedAt).toLocaleDateString('es', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={onToggleFavorite} style={styles.actionBtn}>
            <Text style={styles.actionIcon}>{entry.isFavorite ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRemove} style={styles.actionBtn}>
            <Text style={styles.removeIcon}>🗑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2a2a3e',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  icon: {
    fontSize: 22,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  favIcon: {
    fontSize: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  serviceTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  serviceTagText: {
    fontSize: 9,
    fontWeight: '600',
  },
  genreText: {
    color: '#AAAAAA',
    fontSize: 10,
  },
  yearText: {
    color: '#666666',
    fontSize: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
  },
  star: {
    fontSize: 12,
  },
  starFilled: {
    color: '#F59E0B',
  },
  starEmpty: {
    color: '#333333',
  },
  notes: {
    color: '#888888',
    fontSize: 11,
    marginTop: 4,
    fontStyle: 'italic',
  },
  date: {
    color: '#555555',
    fontSize: 10,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    flexShrink: 0,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2a2a3e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 14,
  },
  removeIcon: {
    fontSize: 14,
  },
});

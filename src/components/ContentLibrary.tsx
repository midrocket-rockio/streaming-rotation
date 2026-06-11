// ─── Content Library Component ──────────────────────────────────

import React from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useWatchStore } from '@/stores/watchStore';

type FilterStatus = 'all' | ContentLibraryItem['status'];

export default function ContentLibrary() {
  const library = useWatchStore((s) => s.library);
  const addItem = useWatchStore((s) => s.addItem);
  const updateItem = useWatchStore((s) => s.updateItem);
  const removeItem = useWatchStore((s) => s.removeItem);
  const searchLibrary = useWatchStore((s) => s.searchLibrary);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [filter, setFilter] = React.useState<FilterStatus>('all');

  const filtered = React.useMemo(() => {
    let items = library;
    if (filter !== 'all') {
      items = items.filter((item) => item.status === filter);
    }
    if (searchQuery.trim()) {
      items = searchLibrary(searchQuery);
    }
    return items;
  }, [library, filter, searchQuery, searchLibrary]);

  const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
    watching: { label: 'Watching', color: '#3B82F6', icon: '▶️' },
    completed: { label: 'Completed', color: '#4ADE80', icon: '✅' },
    'plan-to-watch': { label: 'Plan to Watch', color: '#FBBF24', icon: '📋' },
    dropped: { label: 'Dropped', color: '#F87171', icon: '❌' },
  };

  const filterOptions: { key: FilterStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'watching', label: 'Watching' },
    { key: 'completed', label: 'Completed' },
    { key: 'plan-to-watch', label: 'Plan' },
    { key: 'dropped', label: 'Dropped' },
  ];

  const renderLibraryItem = ({ item }: { item: typeof library[0] }) => {
    const config = statusConfig[item.status] || statusConfig['plan-to-watch'];

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.titleArea}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>
              {item.type} • {item.service} • {item.year}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: config.color + '30' }]}>
            <Text style={[styles.statusText, { color: config.color }]}>
              {config.icon} {config.label}
            </Text>
          </View>
        </View>

        {/* Tags */}
        {item.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {item.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Progress */}
        {item.totalEpisodes && item.episodesWatched !== undefined && (
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Progress</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(item.episodesWatched / item.totalEpisodes) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {item.episodesWatched}/{item.totalEpisodes} episodes
            </Text>
          </View>
        )}

        {/* Personal Rating */}
        <View style={styles.ratingRow}>
          <Text style={styles.ratingLabel}>Your Rating:</Text>
          <View style={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => updateItem(item.id, { personalRating: star })}
              >
                <Text style={star <= item.personalRating ? styles.starFilled : styles.starEmpty}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingValue}>{item.personalRating}/5</Text>
        </View>

        {item.notes && <Text style={styles.notes}>{item.notes}</Text>}

        {/* Actions */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => removeItem(item.id)}
          >
            <Text style={styles.actionBtnText}>🗑️ Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search library..."
        placeholderTextColor="#666"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Filter */}
      <FlatList
        data={filterOptions}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterBtn, filter === item.key && styles.filterBtnActive]}
            onPress={() => setFilter(item.key)}
          >
            <Text style={[styles.filterText, filter === item.key && styles.filterTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      />

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          addItem({
            title: 'New Title',
            type: 'series',
            genre: [],
            rating: 0,
            year: new Date().getFullYear(),
            service: 'Netflix',
            serviceId: 'netflix',
            personalRating: 0,
            status: 'plan-to-watch',
            dateAdded: Date.now(),
            totalEpisodes: 0,
            episodesWatched: 0,
            notes: '',
            tags: [],
          });
        }}
      >
        <Text style={styles.addBtnText}>+ Add to Library</Text>
      </TouchableOpacity>

      {/* Library List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderLibraryItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>Your library is empty</Text>
            <Text style={styles.emptySubtext}>Add shows and movies to track!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2a2a3e',
    marginBottom: 10,
  },
  filterRow: {
    gap: 6,
    marginBottom: 10,
  },
  filterBtn: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  filterBtnActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterText: {
    fontSize: 13,
    color: '#888',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addBtn: {
    backgroundColor: '#4ADE80',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  list: {
    gap: 10,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleArea: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  tagText: {
    fontSize: 11,
    color: '#aaa',
  },
  progressSection: {
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#2a2a3e',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  ratingLabel: {
    fontSize: 12,
    color: '#888',
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
  },
  starFilled: {
    color: '#FFD700',
    fontSize: 18,
  },
  starEmpty: {
    color: '#444',
    fontSize: 18,
  },
  ratingValue: {
    fontSize: 13,
    color: '#aaa',
    fontWeight: 'bold',
  },
  notes: {
    fontSize: 12,
    color: '#777',
    marginTop: 6,
    fontStyle: 'italic',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  actionBtn: {
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  actionBtnText: {
    fontSize: 12,
    color: '#F87171',
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

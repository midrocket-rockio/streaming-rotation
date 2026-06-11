// ─── Recommendations Component ──────────────────────────────────

import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useWatchStore } from '@/stores/watchStore';
import { useRotationStore } from '@/stores/rotationStore';
import { getRecommendations, getTopGenres, getTopServices } from '@/services/recommendationService';
import type { RecommendationEngine } from '@/types';

export default function Recommendations() {
  const watchHistory = useWatchStore((s) => s.watchHistory);
  const library = useWatchStore((s) => s.library);
  const services = useRotationStore((s) => s.services);

  const [engine, setEngine] = React.useState<RecommendationEngine>('hybrid');

  const recommendations = getRecommendations(watchHistory, library, services, engine, 15);
  const topGenres = getTopGenres(watchHistory);
  const topServices = getTopServices(watchHistory);

  const getGenreColor = (genre: string) => {
    const colors: Record<string, string> = {
      'Sci-Fi': '#06B6D4',
      'Drama': '#8B5CF6',
      'Comedy': '#FBBF24',
      'Action': '#EF4444',
      'Thriller': '#6B7280',
      'Fantasy': '#A855F7',
      'Crime': '#EC4899',
      'Animation': '#F97316',
      'Documentary': '#10B981',
    };
    return colors[genre] || '#6B7280';
  };

  const renderRecommendation = ({ item }: { item: typeof recommendations[0] }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleArea}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.service}>{item.service} • {item.type} • {item.year}</Text>
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: item.matchScore >= 70 ? '#4ADE80' : item.matchScore >= 40 ? '#FBBF24' : '#F87171' }]}>
          <Text style={styles.scoreText}>{item.matchScore}%</Text>
        </View>
      </View>
      <Text style={styles.reason}>💡 {item.reason}</Text>
      <View style={styles.genresRow}>
        {item.genre.map((g) => (
          <View key={g} style={[styles.genreTag, { backgroundColor: getGenreColor(g) + '30' }]}>
            <Text style={[styles.genreText, { color: getGenreColor(g) }]}>{g}</Text>
          </View>
        ))}
      </View>
      <View style={styles.ratingRow}>
        <Text style={styles.ratingStars}>
          {Array.from({ length: 5 }, (_, i) => (
            <Text key={i} style={i < Math.round(item.rating / 2) ? styles.starFilled : styles.starEmpty}>★</Text>
          ))}
        </Text>
        <Text style={styles.ratingValue}>{item.rating}</Text>
      </View>
    </View>
  );

  const engineOptions: { key: RecommendationEngine; label: string; icon: string }[] = [
    { key: 'genre-match', label: 'Genre', icon: '🎭' },
    { key: 'rating-weighted', label: 'Top Rated', icon: '⭐' },
    { key: 'service-preference', label: 'Your Services', icon: '📺' },
    { key: 'hybrid', label: 'Smart Mix', icon: '🧠' },
  ];

  if (watchHistory.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🎯</Text>
        <Text style={styles.emptyText}>No recommendations yet</Text>
        <Text style={styles.emptySubtext}>Start watching shows to get personalized picks!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Engine Selector */}
      <View style={styles.engineRow}>
        {engineOptions.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.engineBtn, engine === opt.key && styles.engineBtnActive]}
            onPress={() => setEngine(opt.key)}
          >
            <Text style={styles.engineIcon}>{opt.icon}</Text>
            <Text style={[styles.engineLabel, engine === opt.key && styles.engineLabelActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Top Genres */}
      {topGenres.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Top Genres</Text>
          <View style={styles.genresRow}>
            {topGenres.slice(0, 5).map((g) => (
              <View key={g.genre} style={[styles.genreTag, { backgroundColor: getGenreColor(g.genre) + '30' }]}>
                <Text style={[styles.genreText, { color: getGenreColor(g.genre) }]}>
                  {g.genre} ({g.count})
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Top Services */}
      {topServices.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Services</Text>
          <View style={styles.genresRow}>
            {topServices.slice(0, 5).map((s) => (
              <View key={s.service} style={[styles.genreTag, { backgroundColor: '#3B82F630' }]}>
                <Text style={[styles.genreText, { color: '#3B82F6' }]}>
                  {s.service} ({s.count})
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Recommendations */}
      <Text style={styles.sectionTitle}>Recommended For You</Text>
      <FlatList
        data={recommendations}
        keyExtractor={(item) => item.id}
        renderItem={renderRecommendation}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  engineRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  engineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  engineBtnActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  engineIcon: {
    fontSize: 14,
  },
  engineLabel: {
    fontSize: 12,
    color: '#888',
  },
  engineLabelActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  genresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  genreTag: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  genreText: {
    fontSize: 12,
    fontWeight: '600',
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
  service: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  scoreBadge: {
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  reason: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  ratingStars: {
    flexDirection: 'row',
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
    fontSize: 13,
    color: '#aaa',
    fontWeight: 'bold',
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

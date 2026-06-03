import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { Service } from '@/types';

interface ContentPreviewProps {
  service: Service;
}

export default function ContentPreview({ service }: ContentPreviewProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.serviceIcon}>{service.icon}</Text>
          <View>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.contentCount}>
              {service.featuredContent.length} contenido destacado
            </Text>
          </View>
        </View>
        <View style={[styles.brandDot, { backgroundColor: service.brandColor }]} />
      </View>

      {/* Content list */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {service.featuredContent.map((item) => (
          <View key={item.id} style={styles.contentCard}>
            <View style={[styles.contentImage, { borderColor: service.brandColor }]}>
              <Text style={styles.contentEmoji}>
                {item.type === 'series' ? '📺' : item.type === 'movie' ? '🎬' : '📄'}
              </Text>
            </View>
            <Text style={styles.contentTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.contentMeta}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>⭐ {item.rating}</Text>
              </View>
              <Text style={styles.genreText}>{item.genre}</Text>
              <Text style={styles.yearText}>{item.year}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  serviceIcon: {
    fontSize: 28,
  },
  serviceName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  contentCount: {
    color: '#888888',
    fontSize: 11,
  },
  brandDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  scroll: {
    maxHeight: 220,
  },
  contentCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: '#16213e',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  contentImage: {
    height: 100,
    backgroundColor: '#0d1b2a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  contentEmoji: {
    fontSize: 36,
  },
  contentTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    padding: 8,
    paddingHorizontal: 6,
  },
  contentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingBottom: 8,
    flexWrap: 'wrap',
  },
  ratingBadge: {
    backgroundColor: '#F59E0B22',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '700',
  },
  genreText: {
    color: '#888888',
    fontSize: 9,
  },
  yearText: {
    color: '#555555',
    fontSize: 9,
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import type { Service } from '@/types';
import { useRotationStore } from '@/stores/rotationStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface ServiceCardProps {
  service: Service;
  onPress?: () => void;
  isActive?: boolean;
  size?: 'default' | 'compact';
}

export default function ServiceCard({
  service,
  onPress,
  isActive = false,
  size = 'default',
}: ServiceCardProps) {
  const isCompact = size === 'compact';
  const cardWidth = isCompact ? width - 32 : CARD_WIDTH;
  const logRotation = useRotationStore((s) => s.logRotation);

  const handleLogRotation = () => {
    logRotation(service.id);
    Alert.alert(
      '✅ Rotación Registrada',
      `Se registró la rotación de ${service.name}.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.card,
        { width: cardWidth },
        isActive && styles.cardActive,
      ]}
    >
      {/* Brand color top bar */}
      <View style={[styles.brandBar, { backgroundColor: service.brandColor }]} />

      {/* Icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{service.icon}</Text>
      </View>

      {/* Name */}
      <Text style={styles.name} numberOfLines={1}>
        {service.name}
      </Text>

      {/* Price */}
      <Text style={styles.price}>${service.monthlyPrice.toFixed(2)}</Text>
      <Text style={styles.period}>/mes</Text>

      {/* Category badge */}
      <View style={[styles.categoryBadge, { backgroundColor: service.brandColor + '33' }]}>
        <Text style={[styles.categoryText, { color: service.brandColor }]}>
          {service.category === 'video' ? '📺 Video' : service.category === 'music' ? '🎵 Música' : service.category === 'gaming' ? '🎮 Gaming' : '📦 Otro'}
        </Text>
      </View>

      {/* Active indicator */}
      {isActive && (
        <View style={styles.activeDot}>
          <View style={[styles.activeDotInner, { backgroundColor: '#4ADE80' }]} />
        </View>
      )}

      {/* Log rotation button */}
      <TouchableOpacity
        onPress={handleLogRotation}
        activeOpacity={0.7}
        style={styles.logRotationBtn}
      >
        <Text style={styles.logRotationBtnText}>📝 Registrar Rotación</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  cardActive: {
    borderColor: '#4ADE80',
    borderWidth: 2,
  },
  brandBar: {
    height: 4,
    width: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  icon: {
    fontSize: 32,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  price: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
  },
  period: {
    color: '#888888',
    fontSize: 12,
    textAlign: 'center',
  },
  categoryBadge: {
    alignSelf: 'center',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  activeDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  logRotationBtn: {
    backgroundColor: '#4ADE8022',
    borderRadius: 8,
    paddingVertical: 6,
    marginTop: 8,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4ADE8044',
  },
  logRotationBtnText: {
    color: '#4ADE80',
    fontSize: 11,
    fontWeight: '700',
  },
});

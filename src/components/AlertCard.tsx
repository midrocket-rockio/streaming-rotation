import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { AlertConfig, Service } from '@/types';

interface AlertCardProps {
  alert: AlertConfig;
  service: Service | undefined;
  onToggle: () => void;
  onRemove: () => void;
}

export default function AlertCard({
  alert,
  service,
  onToggle,
  onRemove,
}: AlertCardProps) {
  const isCancel = alert.type === 'cancel';

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {/* Icon */}
        <View style={[styles.iconCircle, { backgroundColor: isCancel ? '#E5091422' : '#4ADE8022' }]}>
          <Text style={styles.iconText}>{isCancel ? '⚠️' : '🔄'}</Text>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.alertTitle}>
            {isCancel ? 'Cancelar' : 'Reactivar'}: {service?.name ?? 'Servicio'}
          </Text>
          <Text style={styles.alertDetail}>
            {isCancel ? 'Cancelarás' : 'Reactivarás'} en {alert.daysBefore} día(s)
          </Text>
          <Text style={styles.alertType}>
            {isCancel ? '🔴 Cancelación' : '🟢 Reactivación'}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.rightSection}>
        <TouchableOpacity onPress={onToggle} activeOpacity={0.7} style={styles.toggleBtn}>
          <View style={[styles.toggleIndicator, { backgroundColor: alert.enabled ? '#4ADE80' : '#555555' }]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onRemove} activeOpacity={0.7} style={styles.removeBtn}>
          <Text style={styles.removeIcon}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  info: {
    flex: 1,
  },
  alertTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  alertDetail: {
    color: '#888888',
    fontSize: 11,
    marginTop: 2,
  },
  alertType: {
    fontSize: 10,
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleBtn: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2a2a3e',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2a2a3e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    color: '#888888',
    fontSize: 12,
  },
});

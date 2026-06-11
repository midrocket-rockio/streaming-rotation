import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FamilyPlanMember } from '../types/rotation';

interface FamilyMemberCardProps {
  member: FamilyPlanMember;
  onToggle: () => void;
}

export const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({ member, onToggle }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{member.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{member.name}</Text>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: member.role === 'admin' ? '#f59e0b' : '#64748b' }]}>
            <Text style={styles.badgeText}>{member.role}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: member.isActive ? '#10b981' : '#ef4444' }]}>
            <Text style={styles.badgeText}>{member.isActive ? 'Active' : 'Inactive'}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={onToggle} style={styles.toggleBtn}>
        <Text style={styles.toggleText}>{member.isActive ? 'ON' : 'OFF'}</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.stats}>
      <Text style={styles.statLabel}>Profiles: {member.profileCount}</Text>
      <Text style={styles.statCost}>${member.monthlyCost.toFixed(2)}/mo</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 20, fontWeight: '700', color: '#fff' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 11, color: '#fff', fontWeight: '600' },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#f1f5f9' },
  toggleText: { fontSize: 12, fontWeight: '700', color: '#334155' },
  stats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderColor: '#f1f5f9' },
  statLabel: { fontSize: 13, color: '#64748b' },
  statCost: { fontSize: 14, fontWeight: '700', color: '#059669' },
});

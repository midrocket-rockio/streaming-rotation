// ─── Watch Party Component ──────────────────────────────────────

import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useWatchStore } from '@/stores/watchStore';

export default function WatchParty() {
  const parties = useWatchStore((s) => s.parties);
  const createParty = useWatchStore((s) => s.createParty);
  const updateParty = useWatchStore((s) => s.updateParty);
  const removeParty = useWatchStore((s) => s.removeParty);

  const upcomingParties = parties.filter(
    (p) => p.status === 'planned' && p.scheduledAt > Date.now()
  );

  const pastParties = parties.filter(
    (p) => p.status !== 'planned' || p.scheduledAt <= Date.now()
  );

  const statusColors: Record<string, string> = {
    planned: '#3B82F6',
    'in-progress': '#4ADE80',
    completed: '#6B7280',
    cancelled: '#F87171',
  };

  const statusLabels: Record<string, string> = {
    planned: 'Planned',
    'in-progress': 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  const formatPartyDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderPartyItem = ({ item }: { item: typeof parties[0] }) => (
    <View style={[styles.card, { borderLeftWidth: 3, borderLeftColor: statusColors[item.status] }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] + '30' }]}>
          <Text style={[styles.statusText, { color: statusColors[item.status] }]}>
            {statusLabels[item.status]}
          </Text>
        </View>
      </View>
      <Text style={styles.cardService}>{item.service}</Text>
      <Text style={styles.cardDate}>📅 {formatPartyDate(item.scheduledAt)}</Text>
      {item.episode && <Text style={styles.cardEpisode}>🎬 {item.episode}</Text>}
      <Text style={styles.cardHost}>Hosted by {item.hostName}</Text>

      {/* Attendees */}
      <View style={styles.attendeesSection}>
        <Text style={styles.attendeesLabel}>Attendees ({item.attendees.length})</Text>
        <View style={styles.attendeesRow}>
          {item.attendees.map((a) => (
            <View key={a.id} style={styles.attendeeChip}>
              <Text style={styles.attendeeName}>{a.name}</Text>
              <Text style={[styles.attendeeStatus, {
                color: a.status === 'accepted' ? '#4ADE80' : a.status === 'declined' ? '#F87171' : '#FBBF24',
              }]}>
                {a.status === 'accepted' ? '✓' : a.status === 'declined' ? '✗' : '⏳'}
              </Text>
            </View>
          ))}
          {item.attendees.length === 0 && (
            <Text style={styles.noAttendees}>No attendees yet</Text>
          )}
        </View>
      </View>

      {item.notes && <Text style={styles.cardNotes}>{item.notes}</Text>}

      <View style={styles.cardActions}>
        {item.status === 'planned' && (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#4ADE80' }]}
            onPress={() => updateParty(item.id, { status: 'in-progress' })}
          >
            <Text style={styles.actionBtnText}>Start</Text>
          </TouchableOpacity>
        )}
        {item.status === 'in-progress' && (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#3B82F6' }]}
            onPress={() => updateParty(item.id, { status: 'completed' })}
          >
            <Text style={styles.actionBtnText}>Complete</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#F87171' }]}
          onPress={() => removeParty(item.id)}
        >
          <Text style={styles.actionBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* New Party Button */}
      <TouchableOpacity
        style={styles.newPartyBtn}
        onPress={() => {
          createParty({
            title: 'New Watch Party',
            service: 'Netflix',
            serviceId: 'netflix',
            scheduledAt: Date.now() + 86400000,
            hostId: 'me',
            hostName: 'You',
            notes: '',
          });
        }}
      >
        <Text style={styles.newPartyBtnText}>+ New Watch Party</Text>
      </TouchableOpacity>

      {/* Upcoming */}
      {upcomingParties.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Upcoming ({upcomingParties.length})</Text>
          <FlatList
            data={upcomingParties}
            keyExtractor={(item) => item.id}
            renderItem={renderPartyItem}
            contentContainerStyle={styles.list}
            scrollEnabled={false}
          />
        </>
      )}

      {/* Past */}
      {pastParties.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Past ({pastParties.length})</Text>
          <FlatList
            data={pastParties}
            keyExtractor={(item) => item.id}
            renderItem={renderPartyItem}
            contentContainerStyle={styles.list}
            scrollEnabled={false}
          />
        </>
      )}

      {parties.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🎉</Text>
          <Text style={styles.emptyText}>No watch parties yet</Text>
          <Text style={styles.emptySubtext}>Plan a watch party with friends!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  newPartyBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  newPartyBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    marginTop: 4,
  },
  list: {
    gap: 10,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  statusBadge: {
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardService: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  cardDate: {
    fontSize: 13,
    color: '#aaa',
    marginTop: 4,
  },
  cardEpisode: {
    fontSize: 13,
    color: '#aaa',
    marginTop: 2,
  },
  cardHost: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  attendeesSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#2a2a3e',
  },
  attendeesLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  attendeesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  attendeeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  attendeeName: {
    fontSize: 12,
    color: '#ccc',
  },
  attendeeStatus: {
    fontSize: 12,
  },
  noAttendees: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  cardNotes: {
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
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
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

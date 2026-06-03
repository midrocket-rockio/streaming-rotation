import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import ServiceCard from '@/components/ServiceCard';
import ContentPreview from '@/components/ContentPreview';
import AlertCard from '@/components/AlertCard';
import AdMobBanner from '@/components/AdMobBanner';
import { useRotationStore } from '@/stores/rotationStore';
import type { Service } from '@/types';

const BRAND_COLORS = [
  '#E50914', '#0063E5', '#B535F6', '#1DB954',
  '#00A8E1', '#555555', '#4F46E5', '#0064FF',
  '#FF6900', '#E60000', '#0078D4', '#00C853',
];

const CATEGORIES: { label: string; value: string }[] = [
  { label: '📺 Video', value: 'video' },
  { label: '🎵 Música', value: 'music' },
  { label: '🎮 Gaming', value: 'gaming' },
  { label: '📦 Otro', value: 'other' },
];

const ICONS = ['🎬', '🏰', '🎭', '🎵', '📦', '🍎', '✨', '⛰️', '🎮', '📺', '🎶', '🌐'];

export default function ServicesScreen() {
  const services = useRotationStore((s) => s.services);
  const addService = useRotationStore((s) => s.addService);
  const removeService = useRotationStore((s) => s.removeService);
  const toggleService = useRotationStore((s) => s.toggleService);
  const updateService = useRotationStore((s) => s.updateService);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newColor, setNewColor] = useState(BRAND_COLORS[0]);
  const [newIcon, setNewIcon] = useState(ICONS[0]);
  const [newCategory, setNewCategory] = useState('video');

  const enabledServices = services.filter((s) => s.enabled);
  const disabledServices = services.filter((s) => !s.enabled);

  const handleAdd = () => {
    if (!newName.trim() || !newPrice) {
      Alert.alert('Error', 'Nombre y precio son requeridos');
      return;
    }
    addService({
      name: newName.trim(),
      monthlyPrice: parseFloat(newPrice),
      brandColor: newColor,
      icon: newIcon,
      category: newCategory as Service['category'],
      featuredContent: [],
      enabled: true,
    });
    setNewName('');
    setNewPrice('');
    setShowAddModal(false);
  };

  const handleRemove = (id: string) => {
    Alert.alert('Eliminar', '¿Estás seguro de eliminar este servicio?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => removeService(id),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Servicios</Text>
          <Text style={styles.headerSubtitle}>
            {enabledServices.length} activos · {services.length} total
          </Text>
        </View>

        {/* Add Button */}
        <AdMobBanner />
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addBtnText}>+ Agregar Servicio</Text>
        </TouchableOpacity>

        {/* Active Services */}
        <Text style={styles.sectionTitle}>Activos ({enabledServices.length})</Text>
        <View style={styles.grid}>
          {enabledServices.map((svc) => (
            <View key={svc.id} style={styles.serviceWrapper}>
              <ServiceCard
                service={svc}
                isActive={true}
                onPress={() => toggleService(svc.id)}
              />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => handleRemove(svc.id)}
              >
                <Text style={styles.removeBtnText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Inactive Services */}
        {disabledServices.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Inactivos ({disabledServices.length})</Text>
            <View style={styles.grid}>
              {disabledServices.map((svc) => (
                <View key={svc.id} style={styles.serviceWrapper}>
                  <ServiceCard
                    service={svc}
                    onPress={() => toggleService(svc.id)}
                  />
                  <TouchableOpacity
                    style={[styles.removeBtn, { backgroundColor: '#4ADE8022' }]}
                    onPress={() => toggleService(svc.id)}
                  >
                    <Text style={[styles.removeBtnText, { color: '#4ADE80' }]}>Activar</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Content Previews */}
        {enabledServices.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>🎬 Contenido Destacado</Text>
            {enabledServices.slice(0, 4).map((svc) => (
              <ContentPreview key={svc.id} service={svc} />
            ))}
          </>
        )}

        {/* Alerts Section */}
        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>🔔 Alertas de Rotación</Text>
          <View style={styles.alertsList}>
            {enabledServices.slice(0, 3).map((svc) => (
              <AlertCard
                key={svc.id}
                alert={{
                  id: `alert-${svc.id}`,
                  serviceId: svc.id,
                  daysBefore: 7,
                  type: 'cancel',
                  enabled: true,
                }}
                service={svc}
                onToggle={() => {}}
                onRemove={() => {}}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Add Modal */}
      {showAddModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Agregar Servicio</Text>

            <Text style={styles.inputLabel}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Netflix"
              value={newName}
              onChangeText={setNewName}
              placeholderTextColor="#555"
            />

            <Text style={styles.inputLabel}>Precio mensual ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="13.99"
              value={newPrice}
              onChangeText={setNewPrice}
              keyboardType="decimal-pad"
              placeholderTextColor="#555"
            />

            <Text style={styles.inputLabel}>Ícono</Text>
            <View style={styles.iconPicker}>
              {ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[styles.iconOption, newIcon === icon && styles.iconOptionActive]}
                  onPress={() => setNewIcon(icon)}
                >
                  <Text style={styles.iconOptionText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Color</Text>
            <View style={styles.colorPicker}>
              {BRAND_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorOption, { backgroundColor: color }]}
                  onPress={() => setNewColor(color)}
                />
              ))}
            </View>

            <Text style={styles.inputLabel}>Categoría</Text>
            <View style={styles.categoryPicker}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryOption,
                    newCategory === cat.value && styles.categoryOptionActive,
                  ]}
                  onPress={() => setNewCategory(cat.value)}
                >
                  <Text style={styles.categoryOptionText}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnAdd]} onPress={handleAdd}>
                <Text style={styles.modalBtnAddText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
    paddingTop: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#888888',
    fontSize: 13,
    marginTop: 4,
  },
  addBtn: {
    backgroundColor: '#4ADE80',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  addBtnText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceWrapper: {
    width: '48%',
    marginBottom: 4,
  },
  removeBtn: {
    backgroundColor: '#E5091422',
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  removeBtnText: {
    color: '#E50914',
    fontSize: 11,
    fontWeight: '600',
  },
  alertsSection: {
    marginTop: 16,
  },
  alertsList: {
    gap: 8,
  },
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  inputLabel: {
    color: '#888888',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#0a0a0a',
    borderRadius: 10,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  iconPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconOption: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  iconOptionActive: {
    borderColor: '#4ADE80',
    backgroundColor: '#4ADE8022',
  },
  iconOptionText: {
    fontSize: 20,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  categoryOptionActive: {
    borderColor: '#4ADE80',
    backgroundColor: '#4ADE8022',
  },
  categoryOptionText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBtnCancel: {
    backgroundColor: '#2a2a3e',
  },
  modalBtnCancelText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  modalBtnAdd: {
    backgroundColor: '#4ADE80',
  },
  modalBtnAddText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },
});

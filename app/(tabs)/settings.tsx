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
  Switch,
} from 'react-native';
import { useSettingsStore } from '@/stores/settingsStore';
import { useRotationStore } from '@/stores/rotationStore';
import { useHistoryStore } from '@/stores/historyStore';
import { formatCurrency } from '@/services/calculatorService';
import { admobService } from '@/services/admobService';

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'Dólar (USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'GBP', symbol: '£', name: 'Libra (GBP)' },
  { code: 'MXN', symbol: '$', name: 'Peso Mexicano (MXN)' },
  { code: 'COP', symbol: '$', name: 'Peso Colombiano (COP)' },
  { code: 'ARS', symbol: '$', name: 'Peso Argentino (ARS)' },
  { code: 'BRL', symbol: 'R$', name: 'Real Brasileño (BRL)' },
  { code: 'CLP', symbol: '$', name: 'Peso Chileno (CLP)' },
];

const LANGUAGES = [
  { code: 'es', label: '🇪🇸 Español' },
  { code: 'en', label: '🇺🇸 English' },
];

export default function SettingsScreen() {
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const resetSettings = useSettingsStore((s) => s.resetSettings);
  const exportData = useSettingsStore((s) => s.exportData);
  const resetAll = useRotationStore((s) => s.resetAll);
  const clearHistory = useHistoryStore((s) => s.clearHistory);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [rotationDay, setRotationDay] = useState(String(settings.rotationDayOfMonth));

  const handleCurrencySelect = (code: string, symbol: string) => {
    updateSettings({ currency: code, currencySymbol: symbol });
    setShowCurrencyPicker(false);
  };

  const handleRotationDayChange = (val: string) => {
    const num = parseInt(val);
    if (!isNaN(num) && num >= 1 && num <= 28) {
      setRotationDay(val);
      updateSettings({ rotationDayOfMonth: num });
    }
  };

  const handleExport = () => {
    const data = exportData();
    Alert.alert(
      'Exportar Datos',
      'Los datos de configuración han sido generados. En una app real, esto se compartiría o guardaría.',
      [{ text: 'OK' }]
    );
    console.log('Exported data:', data);
  };

  const handleResetAll = () => {
    Alert.alert(
      'Restablecer Todo',
      '¿Estás seguro? Esto eliminará todos los servicios, historial y configuraciones.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restablecer',
          style: 'destructive',
          onPress: () => {
            resetAll();
            clearHistory();
            resetSettings();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>⚙️ Configuración</Text>
        </View>

        {/* General */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>

          {/* Currency */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>💱</Text>
              <View>
                <Text style={styles.settingLabel}>Moneda</Text>
                <Text style={styles.settingValue}>
                  {CURRENCIES.find((c) => c.code === settings.currency)?.name || 'USD'}
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {showCurrencyPicker && (
            <View style={styles.pickerContainer}>
              {CURRENCIES.map((c) => (
                <TouchableOpacity
                  key={c.code}
                  style={[
                    styles.pickerItem,
                    c.code === settings.currency && styles.pickerItemActive,
                  ]}
                  onPress={() => handleCurrencySelect(c.code, c.symbol)}
                >
                  <Text style={styles.pickerItemText}>{c.name}</Text>
                  {c.code === settings.currency && (
                    <Text style={styles.pickerCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Language */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setShowLanguagePicker(!showLanguagePicker)}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🌐</Text>
              <View>
                <Text style={styles.settingLabel}>Idioma</Text>
                <Text style={styles.settingValue}>
                  {LANGUAGES.find((l) => l.code === settings.language)?.label || 'Español'}
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {showLanguagePicker && (
            <View style={styles.pickerContainer}>
              {LANGUAGES.map((l) => (
                <TouchableOpacity
                  key={l.code}
                  style={[
                    styles.pickerItem,
                    l.code === settings.language && styles.pickerItemActive,
                  ]}
                  onPress={() => {
                    updateSettings({ language: l.code as 'es' | 'en' });
                    setShowLanguagePicker(false);
                  }}
                >
                  <Text style={styles.pickerItemText}>{l.label}</Text>
                  {l.code === settings.language && (
                    <Text style={styles.pickerCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Rotation Day */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📅</Text>
              <View>
                <Text style={styles.settingLabel}>Día de rotación</Text>
                <Text style={styles.settingValue}>
                  Día {settings.rotationDayOfMonth} de cada mes
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.sliderRow}>
            <Text style={styles.sliderLabel}>1</Text>
            <View style={styles.sliderTrack}>
              {Array.from({ length: 28 }, (_, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.sliderDot,
                    settings.rotationDayOfMonth === i + 1 && styles.sliderDotActive,
                  ]}
                  onPress={() => {
                    updateSettings({ rotationDayOfMonth: i + 1 });
                  }}
                />
              ))}
            </View>
            <Text style={styles.sliderLabel}>28</Text>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔔</Text>
              <View>
                <Text style={styles.settingLabel}>Días antes de la alerta</Text>
                <Text style={styles.settingValue}>
                  {settings.notificationDaysBefore} días antes
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.pickerRow}>
            {[3, 7, 14, 30].map((days) => (
              <TouchableOpacity
                key={days}
                style={[
                  styles.dayPill,
                  settings.notificationDaysBefore === days && styles.dayPillActive,
                ]}
                onPress={() => updateSettings({ notificationDaysBefore: days })}
              >
                <Text
                  style={[
                    styles.dayPillText,
                    settings.notificationDaysBefore === days && styles.dayPillTextActive,
                  ]}
                >
                  {days} días
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Auto Rotate */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔄</Text>
              <View>
                <Text style={styles.settingLabel}>Rotación automática</Text>
                <Text style={styles.settingValue}>
                  Rotar servicios automáticamente
                </Text>
              </View>
            </View>
            <Switch
              value={settings.autoRotate}
              onValueChange={(val) => updateSettings({ autoRotate: val })}
              trackColor={{ false: '#2a2a3e', true: '#4ADE8044' }}
              thumbColor={settings.autoRotate ? '#4ADE80' : '#555555'}
            />
          </View>
        </View>

        {/* Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos</Text>

          <TouchableOpacity style={styles.settingRow} onPress={handleExport}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📤</Text>
              <View>
                <Text style={styles.settingLabel}>Exportar datos</Text>
                <Text style={styles.settingValue}>JSON con toda tu configuración</Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📥</Text>
              <View>
                <Text style={styles.settingLabel}>Importar datos</Text>
                <Text style={styles.settingValue}>Restaurar desde archivo JSON</Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* AdMob / Ads */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Publicidad</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📢</Text>
              <View>
                <Text style={styles.settingLabel}>Mostrar anuncios</Text>
                <Text style={styles.settingValue}>Banner ads, interstitials y rewarded videos</Text>
              </View>
            </View>
            <Switch
              value={admobService.isAdMobEnabled()}
              onValueChange={(val) => {
                admobService.setConfig({ enabled: val });
              }}
              trackColor={{ false: '#2a2a3e', true: '#4ADE8044' }}
              thumbColor={admobService.isAdMobEnabled() ? '#4ADE80' : '#555555'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📋</Text>
              <View>
                <Text style={styles.settingLabel}>Modo test</Text>
                <Text style={styles.settingValue}>Usa anuncios de prueba (test mode)</Text>
              </View>
            </View>
            <Text style={[styles.testBadge, { color: admobService.isTestMode() ? '#4ADE80' : '#888' }]}>
              {admobService.isTestMode() ? 'ACTIVO' : 'INACTIVO'}
            </Text>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.dangerTitle}>Zona de Peligro</Text>

          <TouchableOpacity style={styles.dangerBtn} onPress={() => {
            Alert.alert(
              'Limpiar Historial',
              '¿Eliminar todo el historial de rotaciones?',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Limpiar',
                  style: 'destructive',
                  onPress: clearHistory,
                },
              ]
            );
          }}>
            <Text style={styles.dangerBtnText}>🗑️ Limpiar Historial</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dangerBtn} onPress={handleResetAll}>
            <Text style={styles.dangerBtnText}>⚠️ Restablecer Todo</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Streaming Rotation</Text>
          <Text style={styles.aboutVersion}>Versión 1.2.0</Text>
          <Text style={styles.aboutDesc}>
            Optimiza tu gasto en streaming con rotación inteligente de suscripciones.
          </Text>
          <Text style={styles.aboutMade}>
            Hecho con ❤️ por Midrocket
          </Text>
        </View>
      </ScrollView>
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
    marginBottom: 20,
    paddingTop: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  section: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  sectionTitle: {
    color: '#888888',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingIcon: {
    fontSize: 22,
  },
  settingLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  settingValue: {
    color: '#888888',
    fontSize: 12,
    marginTop: 2,
  },
  chevron: {
    color: '#555555',
    fontSize: 22,
  },
  // Currency/Language picker
  pickerContainer: {
    marginTop: 8,
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  pickerItemActive: {
    backgroundColor: '#4ADE8011',
  },
  pickerItemText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  pickerCheck: {
    color: '#4ADE80',
    fontSize: 16,
    fontWeight: '700',
  },
  // Slider
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  sliderLabel: {
    color: '#555555',
    fontSize: 11,
    width: 20,
  },
  sliderTrack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2a2a3e',
  },
  sliderDotActive: {
    backgroundColor: '#4ADE80',
  },
  // Day pills
  pickerRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  dayPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  dayPillActive: {
    borderColor: '#4ADE80',
    backgroundColor: '#4ADE8022',
  },
  dayPillText: {
    color: '#888888',
    fontSize: 13,
    fontWeight: '600',
  },
  dayPillTextActive: {
    color: '#4ADE80',
  },
  // AdMob test badge
  testBadge: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  // Danger zone
  dangerSection: {
    backgroundColor: '#1a0a0a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5091433',
  },
  dangerTitle: {
    color: '#E50914',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  dangerBtn: {
    backgroundColor: '#E5091422',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5091444',
  },
  dangerBtnText: {
    color: '#E50914',
    fontSize: 14,
    fontWeight: '700',
  },
  // About
  aboutSection: {
    alignItems: 'center',
    padding: 20,
  },
  aboutTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  aboutVersion: {
    color: '#555555',
    fontSize: 12,
    marginTop: 4,
  },
  aboutDesc: {
    color: '#888888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  aboutMade: {
    color: '#4ADE80',
    fontSize: 12,
    marginTop: 12,
    fontWeight: '600',
  },
});

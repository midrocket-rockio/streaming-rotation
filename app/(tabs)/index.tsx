import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import ServiceCard from '@/components/ServiceCard';
import RotationCalendar from '@/components/RotationCalendar';
import ContentPreview from '@/components/ContentPreview';
import AdMobBanner from '@/components/AdMobBanner';
import UpgradeModal from '@/components/UpgradeModal';
import { useRotationStore } from '@/stores/rotationStore';
import { usePremiumStore } from '@/stores/premiumStore';
import { useRotation } from '@/hooks/useRotation';
import { formatCurrency } from '@/services/calculatorService';

export default function RotationScreen() {
  const { currentRotation } = useRotation();
  const rotation = currentRotation();
  const services = useRotationStore((s) => s.services);
  const enabledServices = services.filter((s) => s.enabled);
  const [refreshing, setRefreshing] = React.useState(false);
  const [upgradeVisible, setUpgradeVisible] = React.useState(false);
  const isPremium = usePremiumStore((s) => s.isPremium);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4ADE80" />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>Streaming Rotation</Text>
                <Text style={styles.headerSubtitle}>
                  {enabledServices.length} servicios · {formatCurrency(rotation.savings.monthlyDifference)}/mes
                </Text>
              </View>
              {!isPremium && (
                <TouchableOpacity
                  style={styles.proBtn}
                  onPress={() => setUpgradeVisible(true)}
                >
                  <Text style={styles.proBtnText}>👑 Pro</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* AdMob Banner */}
          <AdMobBanner />

          {/* Current Service Hero */}
          <View style={styles.heroSection}>
            <Text style={styles.heroLabel}>📺 Servicio Actual</Text>
            {rotation.current ? (
              <View style={[styles.heroCard, { borderColor: rotation.current.brandColor }]}>
                <Text style={styles.heroEmoji}>{rotation.current.icon}</Text>
                <Text style={styles.heroName}>{rotation.current.name}</Text>
                <Text style={styles.heroPrice}>
                  {formatCurrency(rotation.current.monthlyPrice)}
                </Text>
                <Text style={styles.heroLabelSmall}>
                  Mes {enabledServices.indexOf(rotation.current) + 1} de {enabledServices.length}
                </Text>
              </View>
            ) : (
              <View style={styles.heroEmpty}>
                <Text style={styles.heroEmptyText}>No hay servicios activos</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => {}}>
                  <Text style={styles.addBtnText}>+ Agregar servicio</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Next Service */}
          {rotation.next && (
            <View style={styles.nextSection}>
              <Text style={styles.sectionTitle}>🔜 Próximo Servicio</Text>
              <View style={styles.nextCard}>
                <Text style={styles.nextEmoji}>{rotation.next.icon}</Text>
                <View style={styles.nextInfo}>
                  <Text style={styles.nextName}>{rotation.next.name}</Text>
                  <Text style={styles.nextTime}>
                    En {rotation.monthsUntil} {rotation.monthsUntil === 1 ? 'mes' : 'meses'}
                  </Text>
                </View>
                <Text style={styles.nextPrice}>
                  {formatCurrency(rotation.next.monthlyPrice)}
                </Text>
              </View>
            </View>
          )}

          {/* Savings Summary */}
          <View style={styles.savingsSummary}>
            <Text style={styles.savingsTitle}>💰 Resumen de Ahorro</Text>
            <View style={styles.savingsRow}>
              <View style={styles.savingsStat}>
                <Text style={styles.savingsValue}>{formatCurrency(rotation.savings.allAtOnceMonthly)}</Text>
                <Text style={styles.savingsLabel}>Todo junto</Text>
              </View>
              <View style={styles.savingsStat}>
                <Text style={[styles.savingsValue, { color: '#4ADE80' }]}>
                  {formatCurrency(rotation.savings.rotationMonthly)}
                </Text>
                <Text style={styles.savingsLabel}>Rotación</Text>
              </View>
            </View>
          </View>

          {/* Premium Rotation Algorithm (Pro feature) */}
          {isPremium && (
            <View style={styles.premiumFeature}>
              <View style={styles.premiumFeatureHeader}>
                <Text style={styles.premiumFeatureIcon}>🤖</Text>
                <Text style={styles.premiumFeatureTitle}>Algoritmo IA Optimizado</Text>
              </View>
              <Text style={styles.premiumFeatureDesc}>
                Tu algoritmo de rotación está optimizado para maximizar tu ahorro.
                Se actualiza automáticamente cada semana.
              </Text>
            </View>
          )}

          {/* Rotation Calendar */}
          <RotationCalendar />

          {/* Content Previews */}
          {enabledServices.length > 0 && (
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>🎬 Contenido Destacado</Text>
              {enabledServices.slice(0, 3).map((svc) => (
                <ContentPreview key={svc.id} service={svc} />
              ))}
            </View>
          )}

          {/* Quick Service Grid */}
          {enabledServices.length > 0 && (
            <View style={styles.quickGrid}>
              <Text style={styles.sectionTitle}>📋 Mis Servicios</Text>
              <View style={styles.grid}>
                {enabledServices.map((svc) => (
                  <ServiceCard
                    key={svc.id}
                    service={svc}
                    isActive={rotation.current?.id === svc.id}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Bottom AdMob Banner */}
          <AdMobBanner />
        </ScrollView>
      </SafeAreaView>

      <UpgradeModal
        visible={upgradeVisible}
        onClose={() => setUpgradeVisible(false)}
      />
    </>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  proBtn: {
    backgroundColor: 'rgba(251,191,36,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FBBF24',
  },
  proBtnText: {
    color: '#FBBF24',
    fontSize: 13,
    fontWeight: '700',
  },
  heroSection: {
    marginBottom: 16,
  },
  heroLabel: {
    color: '#888888',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
  },
  heroEmoji: {
    fontSize: 48,
  },
  heroName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  heroPrice: {
    color: '#4ADE80',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  heroLabelSmall: {
    color: '#888888',
    fontSize: 12,
    marginTop: 4,
  },
  heroEmpty: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  heroEmptyText: {
    color: '#555555',
    fontSize: 14,
  },
  addBtn: {
    marginTop: 12,
    backgroundColor: '#4ADE80',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '700',
  },
  nextSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  nextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  nextEmoji: {
    fontSize: 32,
  },
  nextInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nextName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  nextTime: {
    color: '#F59E0B',
    fontSize: 12,
    marginTop: 2,
  },
  nextPrice: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  savingsSummary: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  savingsTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  savingsStat: {
    alignItems: 'center',
  },
  savingsValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  savingsLabel: {
    color: '#888888',
    fontSize: 11,
    marginTop: 2,
  },
  contentSection: {
    marginBottom: 16,
  },
  quickGrid: {
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  premiumFeature: {
    backgroundColor: 'rgba(167,139,250,0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#A78BFA',
  },
  premiumFeatureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  premiumFeatureIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  premiumFeatureTitle: {
    color: '#A78BFA',
    fontSize: 15,
    fontWeight: '700',
  },
  premiumFeatureDesc: {
    color: '#CCCCCC',
    fontSize: 13,
    lineHeight: 18,
  },
});

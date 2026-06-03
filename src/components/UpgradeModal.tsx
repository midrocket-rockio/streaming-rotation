import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { usePremiumStore } from '@/stores/premiumStore';

const { width } = Dimensions.get('window');

interface UpgradeModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ visible, onClose }: UpgradeModalProps) {
  const tier = usePremiumStore((s) => s.tier);
  const activatePremium = usePremiumStore((s) => s.activatePremium);

  const plans = [
    {
      id: 'pro' as const,
      name: 'Pro',
      price: '$2.99',
      period: '/mes',
      color: '#4ADE80',
      features: [
        'Sin anuncios',
        'Algoritmo avanzado de rotación',
        'Historial ilimitado',
        'Exportar datos CSV',
        'Soporte prioritario',
      ],
      popular: false,
    },
    {
      id: 'family' as const,
      name: 'Family',
      price: '$4.99',
      period: '/mes',
      color: '#A78BFA',
      features: [
        'Todo lo de Pro',
        'Hasta 6 miembros',
        'Control parental',
        'Perfiles individuales',
        'Chat familiar',
        'Algoritmo IA optimizado',
      ],
      popular: true,
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Mejora a Pro</Text>
              <Text style={styles.headerSubtitle}>
                Desbloquea todo el potencial de Streaming Rotation
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Plans */}
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  { borderColor: plan.color },
                  plan.popular && styles.planCardPopular,
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  activatePremium(plan.id);
                  onClose();
                }}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>⭐ MÁS POPULAR</Text>
                  </View>
                )}

                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={styles.planPriceContainer}>
                    <Text style={[styles.planPrice, { color: plan.color }]}>
                      {plan.price}
                    </Text>
                    <Text style={styles.planPeriod}>{plan.period}</Text>
                  </View>
                </View>

                <View style={styles.featuresList}>
                  {plan.features.map((feature, i) => (
                    <View key={i} style={styles.featureRow}>
                      <Text style={styles.checkIcon}>✓</Text>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                <View
                  style={[
                    styles.planBtn,
                    { backgroundColor: plan.color },
                    tier === plan.id && styles.planBtnActive,
                  ]}
                >
                  <Text style={styles.planBtnText}>
                    {tier === plan.id ? 'Plan Activo' : 'Seleccionar'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Current plan indicator */}
            {tier !== 'free' && (
              <View style={styles.currentPlan}>
                <Text style={styles.currentPlanText}>
                  Tu plan actual: {tier === 'pro' ? 'Pro' : 'Family'}
                </Text>
              </View>
            )}

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Pago seguro a través de la App Store
              </Text>
              <Text style={styles.footerLink}>
                Términos de uso · Política de privacidad
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    minHeight: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#888888',
    fontSize: 13,
    marginTop: 4,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2a2a3e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#888888',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  planCard: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#2a2a3e',
    padding: 20,
    marginBottom: 16,
    position: 'relative',
  },
  planCardPopular: {
    borderColor: '#A78BFA',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 16,
    backgroundColor: '#A78BFA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '800',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  planPriceContainer: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '800',
  },
  planPeriod: {
    color: '#888888',
    fontSize: 12,
  },
  featuresList: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkIcon: {
    color: '#4ADE80',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 8,
  },
  featureText: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  planBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  planBtnActive: {
    backgroundColor: '#333333',
  },
  planBtnText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },
  currentPlan: {
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  currentPlanText: {
    color: '#4ADE80',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  footerText: {
    color: '#555555',
    fontSize: 12,
    marginBottom: 8,
  },
  footerLink: {
    color: '#4ADE80',
    fontSize: 12,
  },
});

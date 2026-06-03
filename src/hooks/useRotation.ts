import { useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { useRotationStore } from '@/stores/rotationStore';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Hook that manages rotation logic, notifications, and alerts.
 */
export function useRotation() {
  const services = useRotationStore((s) => s.services);
  const notificationState = useRotationStore((s) => s.notificationState);
  const updateNotificationState = useRotationStore((s) => s.updateNotificationState);
  const getNextService = useRotationStore((s) => s.getNextService);
  const getCurrentService = useRotationStore((s) => s.getCurrentService);
  const getMonthsUntilNextRotation = useRotationStore((s) => s.getMonthsUntilNextRotation);
  const calculateSavings = useRotationStore((s) => s.calculateSavings);

  /**
   * Schedule a notification for a given service.
   */
  const scheduleRotationAlert = useCallback(
    async (serviceName: string, daysBefore: number) => {
      const seconds = daysBefore * 24 * 60 * 60;
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + daysBefore);

      try {
        const trigger: Notifications.SchedulableTriggerInput = {
          date: scheduledDate,
          repeats: false,
        };

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `⚠️ Rotación de Streaming`,
            body: `Es momento de ${daysBefore === 0 ? 'reactivar' : 'recordatorio'} ${serviceName}. ¡No te pierdas su contenido!`,
            sound: true,
          },
          trigger,
        });
      } catch (error) {
        console.warn('Failed to schedule notification:', error);
      }
    },
    []
  );

  /**
   * Get the current rotation info.
   */
  const currentRotation = useCallback(() => {
    const current = getCurrentService();
    const next = getNextService();
    const monthsUntil = getMonthsUntilNextRotation();

    return {
      current,
      next,
      monthsUntil,
      savings: calculateSavings(),
    };
  }, [getCurrentService, getNextService, getMonthsUntilNextRotation, calculateSavings]);

  /**
   * Initialize notifications on mount.
   */
  useEffect(() => {
    const initNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        // Schedule alerts for upcoming rotations
        const nextService = getNextService();
        if (nextService) {
          await scheduleRotationAlert(nextService.name, 7);
        }
      }
    };

    initNotifications();
  }, [getNextService, scheduleRotationAlert]);

  return {
    currentRotation,
    scheduleRotationAlert,
    notificationPermission: notificationState,
  };
}

import { Platform } from 'react-native';
import {
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-notifications/build/NotificationPermissions';
import cancelScheduledNotificationAsync from 'expo-notifications/build/cancelScheduledNotificationAsync';
import getAllScheduledNotificationsAsync from 'expo-notifications/build/getAllScheduledNotificationsAsync';
import scheduleNotificationAsync from 'expo-notifications/build/scheduleNotificationAsync';
import setNotificationChannelAsync from 'expo-notifications/build/setNotificationChannelAsync';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';

/** Импорт только подмодулей — без entry `expo-notifications`, чтобы в Expo Go не грузился push-token (SDK 53+). */

const LAB_NOTIFICATION_ID = 'myshop_lab_interval';
const LAB_TEST_NOTIFICATION_ID = 'myshop_lab_test_once';
/** Должен совпадать с channelId в триггерах на Android. */
const ANDROID_CHANNEL_ID = 'myshop_lab_channel';

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function scheduleLabNotifications(): Promise<void> {
  try {
    const { status: existing } = await getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.warn('[MyShop] Уведомления: разрешение не выдано');
      return;
    }

    if (Platform.OS === 'android') {
      await setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
        name: 'MyShop — напоминания',
        importance: 6,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    await cancelScheduledNotificationAsync(LAB_NOTIFICATION_ID).catch(() => {});
    await cancelScheduledNotificationAsync(LAB_TEST_NOTIFICATION_ID).catch(() => {});

    const intervalSeconds = 60;

    /** Разовое через 8 с — проверка, что пайплайн и канал работают (смотрите шторку уведомлений). */
    await scheduleNotificationAsync({
      identifier: LAB_TEST_NOTIFICATION_ID,
      content: {
        title: 'MyShop — проверка',
        body: 'Если это видно, локальные уведомления доходят. Дальше будут повторы каждую минуту.',
        sound: true,
        priority: 'high',
      },
      trigger:
        Platform.OS === 'android'
          ? {
              type: SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: 8,
              repeats: false,
              channelId: ANDROID_CHANNEL_ID,
            }
          : {
              type: SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: 8,
              repeats: false,
            },
    });

    await scheduleNotificationAsync({
      identifier: LAB_NOTIFICATION_ID,
      content: {
        title: 'MyShop',
        body: 'Напоминание по расписанию — загляните в каталог и свои товары.',
        sound: true,
        priority: 'high',
      },
      trigger:
        Platform.OS === 'android'
          ? {
              type: SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: intervalSeconds,
              repeats: true,
              channelId: ANDROID_CHANNEL_ID,
            }
          : {
              type: SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: intervalSeconds,
              repeats: true,
            },
    });

    const scheduled = await getAllScheduledNotificationsAsync();
    console.log(
      '[MyShop] Запланировано уведомлений:',
      scheduled.length,
      scheduled.map((r) => r.identifier)
    );
  } catch (e) {
    console.warn('[MyShop] scheduleLabNotifications:', e);
  }
}

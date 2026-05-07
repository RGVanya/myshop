const appJson = require('./app.json');

module.exports = {
  expo: {
    ...appJson.expo,
    plugins: [...(appJson.expo.plugins || []), 'expo-notifications'],
    android: {
      ...appJson.expo.android,
      permissions: [
        ...(appJson.expo.android?.permissions || []),
        'POST_NOTIFICATIONS',
        // После своей сборки (expo run:android / EAS). В Expo Go манифест не ваш — повторы могут не сработать.
        'SCHEDULE_EXACT_ALARM',
        'RECEIVE_BOOT_COMPLETED',
      ],
    },
    extra: {
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
      firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
    },
  },
};

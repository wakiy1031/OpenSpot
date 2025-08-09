// app.config.js
// 環境変数を読み込んで Expo 設定に反映する
require('dotenv').config();

/** @type {import('@expo/config').ExpoConfig} */
module.exports = ({ config }) => ({
  ...config,
  name: 'app',
  slug: 'app',
  ios: {
    ...config.ios,
    bundleIdentifier: 'com.openspot.app',
    supportsTablet: true,
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  },
  android: {
    ...config.android,
    edgeToEdgeEnabled: true,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    package: 'com.openspot.app',
  },
  plugins: ['expo-router', 'expo-localization'],
  experiments: { typedRoutes: true },
  extra: {
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
});

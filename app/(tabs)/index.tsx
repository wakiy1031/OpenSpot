/**
 * @file 概要: ホームタブ（地図表示）。
 * @spec:
 * - iOS は Google プロバイダを利用（API キー設定必須）。
 * - Android も Google マップを利用。
 */
import { Platform, StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default function HomeTabScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={Platform.OS === 'ios' ? PROVIDER_GOOGLE : undefined}
        initialRegion={{
          latitude: 34.7025, // Osaka Station vicinity
          longitude: 135.4959,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

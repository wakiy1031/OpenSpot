/**
 * @file 概要: ホームタブ（地図表示）。
 * @spec:
 * - iOS は Google プロバイダを利用（API キー設定必須）。
 * - Android も Google マップを利用。
 */
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default function HomeTabScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 34.7025,
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

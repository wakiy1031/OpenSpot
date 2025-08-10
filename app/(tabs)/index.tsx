/**
 * @file 概要: ホームタブ（地図表示）。
 * @spec:
 * - iOS/Android ともに Google マップを使用。
 * - 現在地の権限をユーザーに確認し、許可時は現在地を中心に表示。
 * - 現在地の青いドットを表示（showsUserLocation）。
 * @limitations:
 * - iOS の権限文言（NSLocationWhenInUseUsageDescription）が未設定の場合、権限要求時に失敗します。
 * - 端末・エミュレータ側で位置情報が無効な場合、取得に失敗します。
 */
import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';

/**
 * @function isPermissionResult
 * @description 位置情報権限レスポンスの簡易バリデーション
 * @param {unknown} value 検証対象
 * @returns {value is { status: string }} 検証結果
 */
function isPermissionResult(value: unknown): value is { status: string } {
  return (
    value !== null &&
    typeof value === 'object' &&
    'status' in (value as Record<string, unknown>) &&
    typeof (value as Record<string, unknown>).status === 'string'
  );
}

/**
 * @function isSimpleLocation
 * @description 位置情報オブジェクトの簡易バリデーション（必要最小限: 緯度/経度）
 * @param {unknown} value 検証対象
 * @returns {value is { coords: { latitude: number; longitude: number } }} 検証結果
 */
function isSimpleLocation(
  value: unknown,
): value is { coords: { latitude: number; longitude: number } } {
  if (value === null || typeof value !== 'object') return false;
  const coords = (value as Record<string, unknown>).coords as
    | { latitude?: unknown; longitude?: unknown }
    | undefined;
  return !!coords && typeof coords.latitude === 'number' && typeof coords.longitude === 'number';
}
/**
 * @function HomeTabScreen
 * @description ホームタブ画面のコンポーネント。地図表示と現在地表示を行う。
 * @returns {JSX.Element} 画面コンポーネント
 */
export default function HomeTabScreen() {
  // 現在地を中心とした地図表示範囲（未取得時は null）
  const [initRegion, setInitRegion] = useState<Region | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // アンマウント後の setState を防止するためのフラグ
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;

    /**
     * @function getCurrentLocation
     * @description 位置情報の利用許可を要求し、現在地を取得して地図の中心に設定する。
     */
    const getCurrentLocation = async () => {
      try {
        // expo-location の型解決が環境により any になるケースへ対応: 返り値を検証してから利用

        const permissionUnknown: unknown = await requestForegroundPermissionsAsync();
        if (!isPermissionResult(permissionUnknown)) {
          if (isMountedRef.current) {
            setErrorMsg('[getCurrentLocation] 位置情報権限レスポンスの形式が不正です。引数: none');
          }
          return;
        }
        const { status } = permissionUnknown;
        if (status !== 'granted') {
          if (isMountedRef.current) {
            setErrorMsg(
              '[getCurrentLocation] 位置情報の利用が許可されていません。引数: none, 権限: not granted',
            );
          }
          return;
        }

        const locationUnknown: unknown = await getCurrentPositionAsync({});
        if (!isSimpleLocation(locationUnknown)) {
          if (isMountedRef.current) {
            setErrorMsg('[getCurrentLocation] 現在地レスポンスの形式が不正です。引数: {}');
          }
          return;
        }

        const { coords } = locationUnknown;
        if (isMountedRef.current) {
          setInitRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? `[getCurrentLocation] 現在地情報取得エラー: ${err.message}`
            : '[getCurrentLocation] 現在地情報取得エラー: 不明なエラーが発生しました';
        if (isMountedRef.current) {
          setErrorMsg(message);
        }
      }
    };

    void getCurrentLocation();

    return () => {
      isMountedRef.current = false;
    };
  }, []);
  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        <MapView
          style={StyleSheet.absoluteFill}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={true}
          region={initRegion || undefined}
        ></MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

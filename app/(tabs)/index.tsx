/**
 * @file 概要: ホームタブの画面。
 * @spec 主な仕様:
 * - シンプルなテキストのみ表示。
 */
import { StyleSheet, Text, View } from 'react-native';

/**
 * ホームタブ
 * @returns {JSX.Element} 画面
 */
export default function HomeTabScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>OpenSpot</Text>
      <Text>Welcome!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
});

/**
 * @file 概要: セカンドタブの画面。
 * @spec 主な仕様:
 * - シンプルなテキストのみ表示。
 */
import { StyleSheet, Text, View } from 'react-native';

/**
 * セカンドタブ
 * @returns {JSX.Element} 画面
 */
export default function secondTabScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Second</Text>
      <Text>Another screen</Text>
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

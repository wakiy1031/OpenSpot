/**
 * @file 概要: タブレイアウトの設定。
 * @spec 主な仕様:
 * - 2 つのタブ（index / two）を表示。
 * - ヘッダーは表示しない。
 * @limitations 制限事項:
 * - アイコンやカスタムヘッダーは簡素化のため省略。
 */
import { Tabs } from 'expo-router';
import React from 'react';

/**
 * タブレイアウト
 * @returns {JSX.Element} タブレイアウト
 */
export default function TabLayout(): JSX.Element {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="two" options={{ title: 'Second' }} />
    </Tabs>
  );
}

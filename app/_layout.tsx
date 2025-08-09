/**
 * @file 概要: アプリ全体のレイアウトとテーマを提供するルートレイアウト。
 * @spec 主な仕様:
 * - React Navigation の `ThemeProvider` を用いて、OS のカラースキームに応じてテーマを切り替える。
 * - `expo-router` のスタックレイアウトで `(tabs)` のみを表示する。
 * @limitations 制限事項:
 * - スプラッシュ制御やフォントの事前ロードは簡素化のため省略している。
 */
import 'react-native-reanimated';
import '@/i18n';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

import { queryClient } from '@/lib/queryClient';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

/**
 * ルートレイアウトコンポーネント
 * @returns {JSX.Element} ルートレイアウト
 */
export default function RootLayout(): JSX.Element {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

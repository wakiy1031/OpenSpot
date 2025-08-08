/**
 * @file TanStack Query のクライアント定義
 * @summary アプリ全体で共有される `QueryClient` を提供します。
 */
import { QueryClient } from '@tanstack/react-query';

/**
 * 共有クエリクライアント
 * @type {QueryClient}
 */
export const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

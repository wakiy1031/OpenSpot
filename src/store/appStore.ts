/**
 * @file アプリ全体の薄いグローバル状態
 * @summary 小規模・高頻度更新に強い Zustand を採用。フォームや非同期は専用ライブラリに委譲します。
 */
import { create } from 'zustand';

/**
 * テーマの種別
 */
export type AppTheme = 'light' | 'dark';

/**
 * アプリストアの型
 */
interface AppState {
  theme: AppTheme;
  setTheme: (next: AppTheme) => void;
}

/**
 * アプリストア
 */
export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  setTheme: (next) => set({ theme: next }),
}));



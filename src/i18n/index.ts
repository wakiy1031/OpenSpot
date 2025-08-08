/**
 * @file 国際化の初期化
 * @summary expo-localization と i18n-js の連携設定を行います。
 */
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

import ja from './ja.json';
import en from './en.json';

/**
 * i18n インスタンス
 * @type {I18n}
 */
export const i18n = new I18n({ ja, en });

i18n.defaultLocale = 'ja';
i18n.enableFallback = true;
i18n.locale = Localization.getLocales()?.[0]?.languageCode ?? 'ja';

/**
 * 翻訳関数のラッパー
 * @param {string} key 翻訳キー
 * @param {Record<string, unknown>=} params パラメータ
 * @returns {string} 翻訳結果
 */
export function t(key: string, params?: Record<string, unknown>): string {
  return i18n.t(key, params);
}



/**
 * @file スポットに関する型定義
 * @summary アプリで扱うスポット情報のコア型を定義します。
 * @limitations 将来的に API 仕様と差分が生じた場合は本ファイルを更新してください。
 */

/**
 * スポットのカテゴリ
 * - public: 図書館、公民館など
 * - commercial: デパート、ショッピングモールなど
 * - outdoor: 公園、広場など
 */
export type SpotCategory = 'public' | 'commercial' | 'outdoor';

/**
 * 電源コンセントの利用可能性
 * - none: 利用不可
 * - some: 一部の席で利用可能
 * - plentiful: 多くの席で利用可能
 */
export type PowerOutletLevel = 'none' | 'some' | 'plentiful';

/**
 * 飲食に関するポリシー
 * - none: 飲食不可
 * - drinks_only: 蓋付きの飲み物のみ可
 * - bento_ok: 弁当などの持ち込み可
 */
export type FoodPolicy = 'none' | 'drinks_only' | 'bento_ok';

/**
 * スポット情報の型
 * @property {string} id 一意の識別子
 * @property {string} name 施設名
 * @property {SpotCategory} category カテゴリ
 * @property {string} address 住所
 * @property {number} latitude 緯度
 * @property {number} longitude 経度
 * @property {string} operatingHours 営業時間（例: "10:00-20:00"）
 * @property {boolean} isFree 完全無料か
 * @property {boolean} hasSeating 座席の有無
 * @property {PowerOutletLevel} powerOutlets 電源コンセントの利用可能性
 * @property {boolean} hasWifi 無料 Wi-Fi の有無
 * @property {FoodPolicy} foodPolicy 飲食に関するポリシー
 * @property {boolean} isQuiet 静かな環境かどうか
 * @property {string[]=} photoUrls ユーザー投稿写真 URL
 * @property {number=} userRating ユーザー評価（5 段階）
 */
export interface Spot {
  id: string;
  name: string;
  category: SpotCategory;
  address: string;
  latitude: number;
  longitude: number;
  operatingHours: string;
  isFree: boolean;
  hasSeating: boolean;
  powerOutlets: PowerOutletLevel;
  hasWifi: boolean;
  foodPolicy: FoodPolicy;
  isQuiet: boolean;
  photoUrls?: string[];
  userRating?: number;
}

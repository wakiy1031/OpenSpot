# OpenSpot

このリポジトリは Expo（expo-router / tabs テンプレート）で構築した React Native アプリのモノレポ構成です。ルート直下に `app/`（画面・ルーティング）と `assets/`（画像・フォント）を持つ構成です。

目標

- **開発環境のセットアップ**を素早く終え、iOS/Android/Web のいずれでも Expo 上で動作確認できる状態にする
- 以降の実装に備え、基本的なフォルダ構成と起動コマンドを整備する

前提条件

- Node.js 20 以上（LTS 推奨）
- npm 10 以上
- iOS 実機/シミュレータ起動: Xcode（macOS のみ）
- Android 実機/エミュレータ起動: Android Studio（SDK/エミュレータ含む）
- モバイル実機で確認する場合は Expo Go アプリ（App Store / Google Play）

初期セットアップ（初回のみ）

1. 依存関係をインストール
   - ルートに移動して以下を実行
     - `npm install`
2. 動作確認
   - 開発サーバ起動（安定化のため localhost モード）: `npm run start`
   - iOS シミュレータ: `npm run ios`
   - Android エミュレータ: `npm run android`
   - Web: `npm run web`

日常開発フロー

1. 開発サーバを起動（`npm run start`）
2. 端末またはシミュレータで確認（`npm run ios` / `npm run android` / `npm run web`）
3. テスト（任意）: `npm test`

ディレクトリ構成（要点）

```
OpenSpot/
  app/                     # 画面・ルーティング（expo-router）
  assets/                  # 画像・フォントなどの静的アセット
  components/              # 再利用可能な UI コンポーネント
  constants/               # 定数定義
  app.json                 # Expo 設定
  package.json             # スクリプトと依存
  tsconfig.json            # TypeScript 設定
  README.project.md        # 旧 README の退避コピー
```

よくあるトラブルと対処

- iOS/Android のビルドが開始しない
  - Xcode / Android Studio のセットアップ（コマンドラインツール、SDK、エミュレータ）を確認
  - `npm run start` 実行後に `i` または `a` キーで起動できない場合は各スクリプトを使用
- Metro Bundler のキャッシュ不整合
  - サーバ停止後に `rm -rf node_modules && npm install` を実行
  - 接続モードの切替で改善する場合あり: LAN（`npm run start:lan`）、トンネル（`npm run start:tunnel`）
- ポート衝突
  - 既存の Metro/Expo が動作していないか確認し、不要なプロセスを停止

スクリプト一覧

- `npm run start`: Expo 開発サーバ起動
- `npm run ios`: iOS シミュレータ起動
- `npm run android`: Android エミュレータ起動
- `npm run web`: Web 起動
- `npm test`: Jest によるテスト実行

補足

- 本リポジトリは Google Drive 配下に存在します。長いパスや日本語パスでも Node/Expo は動作しますが、問題が発生する場合はローカルパス直下に移して動作確認してください。

# OpenSpot 開発計画 & セットアップガイド

> **あなたのための『開かれた場所』を見つけよう**

## 1\. プロジェクト概要

「OpenSpot」は、全国の無料で利用できる公共施設や商業施設の共有スペースなど、「無料で涼める場所（クールスポット）」や短時間の作業に適したオープンスペースを、誰もが簡単に検索・発見できる地図アプリケーションです。

外出中の営業担当者や学生、リモートワーカー、そして少し休憩したいすべての人々が、コストをかけずに快適な時間を過ごせる場所を提供し、社会の「遊休スペース」の価値を最大化することを目指します。

---

## Part 1: 基本設計と要件定義

### 機能要件 (MVP: Minimum Viable Product)

| ID       | 機能名                           | 機能概要                                                                                                         |
| :------- | :------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| **F-01** | **マップ検索機能**               | ユーザーの現在地周辺のオープンスポットを地図上に表示します。スポットはカテゴリ毎に異なるアイコンで可視化します。 |
| **F-02** | **リスト表示機能**               | 地図上のスポットを、現在地からの距離順でソート可能な一覧リスト形式で表示します。                                 |
| **F-03** | **スポット詳細表示機能**         | マップ上のピンまたはリスト項目をタップすると、施設の詳細情報（写真、設備、利用ルール等）を表示します。           |
| **F-04** | **詳細フィルター機能**           | 「電源あり」「Wi-Fi あり」「飲食可」「静かな環境」といった複数の条件でスポットを絞り込めるようにします。         |
| **F-05** | **ユーザーによる情報提供 (UGC)** | ユーザーが新しいスポット情報を投稿したり、既存の情報の修正を提案したりできるフォーム機能を提供します。           |

### 画面構成案

1.  **メイン画面 (タブ構成)**
    - **マップタブ (`/index`)**: アプリのメイン画面。スポットを地図上に表示。
    - **リストタブ (`/list`)**: 周辺のスポットを一覧表示。
2.  **スポット詳細画面 (`/spot/[id]`)**
    - マップまたはリストから遷移。スポットの全情報を表示。
3.  **スポット投稿画面 (`/add`)**
    - 新しいスポット情報を入力するためのフォーム画面。

### データモデル (`Spot` Interface)

アプリケーションのコアとなるデータ構造を以下のように定義します。これはプロジェクトの型安全性の基盤となります。

```typescript
// src/types/spot.ts

/**
 * スポットのカテゴリ
 * public: 図書館、公民館など
 * commercial: デパート、ショッピングモールなどの商業施設
 * outdoor: 公園、広場など
 */
export type SpotCategory = "public" | "commercial" | "outdoor";

/**
 * 電源コンセントの利用可能性
 * none: 利用不可
 * some: 一部の席で利用可能
 * plentiful: 多くの席で利用可能
 */
export type PowerOutletLevel = "none" | "some" | "plentiful";

/**
 * 飲食に関するポリシー
 * none: 飲食不可
 * drinks_only: 蓋付きの飲み物のみ可
 * bento_ok: 弁当などの持ち込み可
 */
export type FoodPolicy = "none" | "drinks_only" | "bento_ok";

export interface Spot {
  id: string; // 一意の識別子 (例: 'google_places_xxxx', 'user_yyyy')
  name: string; // 施設の名称
  category: SpotCategory; // スポットのカテゴリ
  address: string; // 住所
  latitude: number; // 緯度
  longitude: number; // 経度
  operatingHours: string; // 営業時間 (例: "10:00-20:00", "24時間")

  // ユーザーがフィルターで利用する主要な属性
  isFree: boolean; // 完全無料か
  hasSeating: boolean; // 座席の有無
  powerOutlets: PowerOutletLevel; // 電源コンセントの利用可能性
  hasWifi: boolean; // 無料Wi-Fiの有無
  foodPolicy: FoodPolicy; // 飲食に関するポリシー
  isQuiet: boolean; // 静かな環境かどうか

  // UGCによってリッチになる情報
  photoUrls?: string[]; // ユーザー投稿写真のURLリスト
  userRating?: number; // ユーザー評価の平均値（5段階）
}
```

### 技術スタック

| 領域               | 技術                  | 理由                                                                                         |
| :----------------- | :-------------------- | :------------------------------------------------------------------------------------------- |
| **フレームワーク** | React Native (Expo)   | iOS/Android のクロスプラットフォーム開発を効率化し、ネイティブの複雑さを抽象化するため。     |
| **言語**           | TypeScript            | 静的型付けにより開発時のエラーを早期に発見し、コードの保守性と可読性を高めるため。           |
| **ナビゲーション** | Expo Router           | ファイルベースのルーティングにより、直感的でスケーラブルなナビゲーション構造を構築するため。 |
| **地図表示**       | `react-native-maps`   | 標準的な地図表示ライブラリ。マーカーのカスタマイズやクラスタリングにも対応可能なため。       |
| **リスト表示**     | `@shopify/flash-list` | 標準の`FlatList`より高いパフォーマンスを提供し、大量のデータを扱う際の UX を向上させるため。 |
| **状態管理**       | Zustand               | Redux のようなボイラープレートが少なく、軽量で React Hooks との親和性が高いため。            |

---

## Part 2: 開発ルールと規約 (for Cursor)

```plaintext
# cursorrules

## 1. 全般的なルール
- **言語**: 全てのコードはTypeScriptで記述し、`tsconfig.json`の`strict: true`を遵守してください。`any`型の使用は原則禁止します。
- **スタイル**: Prettierのルールに従ってコードをフォーマットしてください。ESLintのエラールールに準拠してください。
- **コメント**: 複雑なロジックやコンポーネントのPropsには、その目的と使い方をJSDoc形式で記述してください。
- **エラーハンドリング**: `try...catch`ブロックやPromiseの`.catch()`を用いて、非同期処理やAPI呼び出しのエラーハンドリングを必ず実装してください。

## 2. ファイル構成と命名規則
- **ディレクトリ構造**: 以下の構造を厳守してください。
```

src/
├── app/ \# Expo Router のルーティング定義
├── assets/ \# 画像、フォントなど
├── components/
│ ├── ui/ \# 基本的な UI 部品 (Atoms) -例: Button, Input
│ └── modules/ \# 複合コンポーネント (Molecules/Organisms) -例: SpotCard
├── constants/ \# 定数（色、API エンドポイントなど）
├── hooks/ \# カスタム React フック (例: useSpots.ts)
├── lib/ \# UI に依存しないビジネスロジック (例: api.ts)
└── types/ \# TypeScript の型定義 (例: spot.ts)

```
- **命名規則**:
- コンポーネントファイル: `PascalCase.tsx` (例: `SpotDetailCard.tsx`)
- フック: `use`プレフィックスを付けた`camelCase.ts` (例: `useSpots.ts`)

## 3. コンポーネント設計
- **Props**: コンポーネントのPropsは、ファイル内で`type`または`interface`を用いて明示的に型定義してください。
- **スタイリング**: `StyleSheet.create`を使用してスタイルを定義し、インラインスタイルはパフォーマンス上の理由がある場合を除き避けてください。
- **状態管理**: コンポーネント固有の単純な状態は`useState`を使用します。複数のコンポーネントで共有される状態や非同期ロジックは、Zustandを用いたカスタムフック（`src/hooks/`）に分離してください。

## 4. プロンプトの形式
- **ファイルの新規作成**: `// Create file: src/components/ui/Button.tsx` のようにコメントで指示してください。
- **コードの生成・修正**: `// TODO:` や `// IMPLEMENT:` といったプレフィックスを付けたコメントで、実装してほしい内容を具体的に記述してください。
- 例: `// TODO: Implement a function to fetch spots from the dummy API in src/lib/api.ts.`
- 例: `// IMPLEMENT: Create a MapView component that displays an array of Spot objects as markers.`
```

---

## Part 3: 開発環境セットアップと初期構築手順

### Step 0: 前提条件

- Node.js (LTS 版) と npm (または yarn) がインストールされていること。
- Expo CLI がインストールされていること (`npm install -g expo-cli`)。

### Step 1: プロジェクトの作成

ターミナルで以下のコマンドを実行し、Expo + TypeScript のプロジェクトを作成します。

```bash
npx create-expo-app@latest OpenSpot --template tabs
cd OpenSpot
```

### Step 2: 必要なライブラリのインストール

開発に必要な主要ライブラリをインストールします。

```bash
npx expo install react-native-maps @shopify/flash-list zustand @react-native-async-storage/async-storage expo-location
```

### Step 3: プロジェクトの初期設定

1.  **`tsconfig.json`の編集**: `strict`モードを有効にし、パスエイリアスを設定します。

    ```json
    {
      "extends": "expo/tsconfig.base",
      "compilerOptions": {
        "strict": true,
        "paths": {
          "@/*": ["./src/*"]
        }
      }
    }
    ```

2.  **ESLint と Prettier の設定**:

    ```bash
    npm install --save-dev eslint-config-prettier
    ```

    プロジェクトルートに`.eslintrc.json`と`.prettierrc.js`を作成します。

    **`.eslintrc.json`**:

    ```json
    {
      "extends": ["expo", "prettier"],
      "plugins": ["prettier"]
    }
    ```

    **`.prettierrc.js`**:

    ```javascript
    module.exports = {
      arrowParens: "always",
      singleQuote: true,
      jsxSingleQuote: true,
      tabWidth: 2,
      semi: true,
    };
    ```

3.  **ディレクトリ構造の作成**:
    `app`ディレクトリを`src/app`に移動し、推奨されるディレクトリ構造を作成します。

    ```bash
    mkdir src
    mv app src/app
    mkdir src/assets src/components src/constants src/hooks src/lib src/types
    mkdir src/components/ui src/components/modules
    ```

    その後、`app.json`の`expo.entryPoint`を`./src/app/index.js`（または関連するエントリーポイント）に更新する必要があるか確認してください（Expo SDK 49+では通常自動で解決されます）。

### Step 4: MVP 機能の初期構築（最初のコーディングセッション）

1.  **型定義ファイル作成**:

    - **ファイル**: `src/types/spot.ts`
    - **内容**: Part 1 で定義した`Spot`インターフェースとその関連型を記述します。

2.  **ダミーデータ API 層作成**:

    - **ファイル**: `src/lib/api.ts`
    - **内容**: `getSpots(): Promise<Spot[]>` という非同期関数を作成します。内部では`setTimeout`を使い、大阪駅周辺の緯度経度を持つダミーの`Spot`データを 3〜5 件、2 秒後に返すようにします。

3.  **ナビゲーション骨格の修正**:

    - **`src/app/(tabs)/_layout.tsx`**: 「マップ」と「リスト」の 2 つのタブが正しく設定されていることを確認します。
    - **`src/app/_layout.tsx`**: アプリ全体の`Stack`ナビゲーターを定義し、`(tabs)`と、後々作成する`spot/[id]`のスクリーンを含めます。

4.  **主要コンポーネントの雛形作成**:

    - **`src/components/modules/SpotMap.tsx`**: `MapView`をラップし、`Spot[]`を Props として受け取るコンポーネントの雛形を作成します。
    - **`src/components/modules/SpotListItem.tsx`**: `Spot`を 1 つ Props として受け取り、スポット名と住所を表示するシンプルなコンポーネントの雛形を作成します。

5.  **画面への機能組み込み**:

    - **`src/app/(tabs)/index.tsx` (マップ画面)**: `useEffect`内で`lib/api.ts`の`getSpots`を呼び出し、取得したスポットデータを`useState`で管理します。ローディング状態も管理してください。取得したデータを`SpotMap`コンポーネントに渡します。
    - **`src/app/(tabs)/list.tsx` (リスト画面)**: 同様に`getSpots`でデータを取得し、ローディング中はインジケーターを表示します。取得したデータを`@shopify/flash-list`に渡し、`renderItem`で`SpotListItem`コンポーネントを描画します。

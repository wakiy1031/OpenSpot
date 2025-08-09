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
export type SpotCategory = 'public' | 'commercial' | 'outdoor';

/**
 * 電源コンセントの利用可能性
 * none: 利用不可
 * some: 一部の席で利用可能
 * plentiful: 多くの席で利用可能
 */
export type PowerOutletLevel = 'none' | 'some' | 'plentiful';

/**
 * 飲食に関するポリシー
 * none: 飲食不可
 * drinks_only: 蓋付きの飲み物のみ可
 * bento_ok: 弁当などの持ち込み可
 */
export type FoodPolicy = 'none' | 'drinks_only' | 'bento_ok';

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

app/ # Expo Router のルーティング定義（ルート直下に固定）
src/
├── components/
│ ├── ui/ # 基本 UI (Atoms)
│ └── modules/ # 複合 UI (Molecules/Organisms)
├── constants/ # 定数（色、API エンドポイントなど）
├── hooks/ # カスタム React フック (例: useSpots.ts)
├── lib/ # UI に依存しないビジネスロジック (例: api.ts)
├── store/ # グローバル状態（Zustand など）
├── types/ # TypeScript の型定義 (例: spot.ts)
├── i18n/ # 多言語（辞書/初期化）
└── utils/ # 横断ユーティリティ

```
- **命名規則**:
- コンポーネントファイル: `PascalCase.tsx` (例: `SpotDetailCard.tsx`)
- フック: `use`プレフィックスを付けた`camelCase.ts` (例: `useSpots.ts`)

## 3. コンポーネント設計
- **Props**: コンポーネントのPropsは、ファイル内で`type`または`interface`を用いて明示的に型定義してください。
- **スタイリング**: `StyleSheet.create`を使用してスタイルを定義し、インラインスタイルはパフォーマンス上の理由がある場合を除き避けてください。
- **状態管理**: コンポーネント固有の単純な状態は`useState`を使用します。複数のコンポーネントで共有される状態や非同期ロジックは、Zustand（`src/store/`）と TanStack Query（`src/lib/`）に分離します。

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
      arrowParens: 'always',
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

---

## Part 4: ブランチ戦略（GitHub Flow ベース）

### 方針

- `main`: 常にデプロイ可能な安定ブランチ（保護設定、直接 push 禁止）
- 機能/作業単位で短命のトピックブランチを作成し、PR 経由で `main` にマージ
- PR 必須要件: CI（lint/test）成功、コードレビュー 1 名以上の承認

### ブランチ命名規則

- `feature/<短い要約>`: 新機能（例: `feature/map-view`）
- `fix/<短い要約>`: 不具合修正（例: `fix/ios-startup-localhost`）
- `chore/<短い要約>`: 依存更新/整備/構成変更（例: `chore/setup-foundation`）
- `docs/<短い要約>`: ドキュメントのみ変更（例: `docs/branch-strategy`）

### コミット規約（概要）

- Conventional Commits を準拠: `feat: ... / fix: ... / chore: ... / docs: ... / refactor: ...`
- スコープ推奨: `feat(map): ...` のように、領域を括弧で付記

### リリース/タグ

- マイルストーンに合わせて `vX.Y.Z` タグを作成
- 互換性破壊がある場合は `MAJOR` を上げる（SemVer）

### CI/CD

- GitHub Actions: `lint` と `test` を PR/`main` push 時に実行
- 将来的に EAS（ビルド/Submit）を release タグで自動化予定

### SDK アップグレード運用

- Expo SDK のメジャー更新は数週間様子見し、互換性と依存の対応状況を確認後に反映
- 参考: SDK 追従は慎重に進める実務上の推奨 [Qiita 記事](https://qiita.com/nakapon9517/items/6b99adc29e4597ed47e1#sdk%E3%82%A2%E3%83%83%E3%83%97%E3%82%B0%E3%83%AC%E3%83%BC%E3%83%89%E3%81%B8%E3%81%AE%E8%BF%BD%E5%BE%93%E6%99%82%E3%81%AE%E6%B3%A8%E6%84%8F%E7%82%B9)

### 現在の作業ブランチ

- `chore/setup-foundation`: 基盤導入（Zustand、TanStack Query、react-hook-form、i18n、husky+lint-staged、CI）

# OpenSpot

このリポジトリは Expo（expo-router）で構築された React Native アプリです。開発・起動の最小手順のみ記載しています。詳細な設計・計画は `.docs/` を参照してください。

## 起動手順
- npm install
- npm run start  # 推奨: localhost
- npm run ios / npm run android / npm run web

## 接続が不安定な場合
- LAN モード: `npm run start:lan`
- トンネルモード: `npm run start:tunnel`

## ディレクトリ概要
- `app/`: 画面・ルーティング（expo-router）
- `assets/`: 画像・フォント
- `.docs/`: 詳細ドキュメント（GitHub 上では目立たせない保管用）
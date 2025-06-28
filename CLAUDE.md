# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

「わたしの御朱印」 - 御朱印（寺社の朱印）を共有・収集するための日本のソーシャルメディアプラットフォーム。現在はNext.js 15のフロントエンドアプリケーションのみで、将来的にバックエンドを実装予定。

## 必須コマンド

```bash
# フロントエンド開発 (/src/frontend ディレクトリから実行)
npm run dev          # 開発サーバー起動 (http://localhost:3000)
npm run build        # 本番ビルド（静的エクスポート）
npm run start        # 本番ビルドのサーブ
npm run lint         # ESLint実行（ビルド時は警告を無視）

# Docker開発 (/src ディレクトリから実行)
docker-compose up    # ルートとフロントエンドのコンテナを起動
```

## アーキテクチャ概要

### リポジトリ構造
- `/src/documents/` - 機能と技術選定に関する日本語ドキュメント
- `/src/frontend/` - Next.js 15アプリケーション（メインコードベース）
  - 静的エクスポート設定（SSR/APIルートなし）
  - TypeScript strictモード
  - Tailwind CSS + Shadcn/uiコンポーネントライブラリ
  - 全データは `lib/mock-data.ts` でモック化

### 主要な技術的決定事項
- **フロントエンド**: Next.js 15
- **バックエンド**: FastAPI（将来実装予定）
- **データベース**: PostgreSQL（Supabase使用）
- **認証**: Supabase Auth（NextAuth.jsは使用しない）
- **静的エクスポート**: サーバーなしでCDNデプロイ可能
- **コンポーネントライブラリ**: 一貫性のあるアクセシブルなUIのためShadcn/ui使用
- **フォーム処理**: React Hook Form + Zodでバリデーション
- **スタイリング**: Tailwind CSSのみ使用（CSSモジュールなし）

### コア機能
1. **認証フロー** - ログインUI（モック認証）
2. **コンテンツフィード** - 投稿を表示するダッシュボード
3. **コンテンツ作成** - 画像アップロード付き投稿作成
4. **ソーシャル機能** - プロフィール、ランキング、フォローシステム
5. **発見機能** - 神社を探すマップビュー

### 開発パターン

修正前に `/src/frontend/CLAUDE.md` を確認し、以下のガイドラインに従うこと。

修正前に `/src/documents/` のドキュメントを確認し、要件を満たすこと。

コンポーネント修正時:
- 新規作成前に `/src/frontend/components/ui/` の既存Shadcnコンポーネントを確認
- クライアントサイドの対話性が必要な場合のみ `"use client"` ディレクティブを使用
- 一貫性のため隣接ファイルの既存パターンに従う

フォーム作業時:
- Zodスキーマと共にReact Hook Formを使用（既存フォームのパターンを参照）
- 一貫したスタイリングのためShadcn/uiフォームコンポーネントを利用

新機能追加時:
- `/src/frontend/lib/mock-data.ts` のモックデータを更新
- `/src/frontend/types/index.ts` で定義されたTypeScript型に従う
- 静的エクスポート互換性を維持（動的サーバー機能は使用不可）

## 重要な注意事項

- テストフレームワーク未設定 - 手動テストのみ
- 本番ビルド時はESLint警告を無視
- 静的エクスポート要件により画像は非最適化
- 全ドキュメントは日本語（一貫性のため維持）
- フロントエンドには詳細なコンポーネントガイダンスを含む独自のCLAUDE.mdが `/src/frontend/CLAUDE.md` に存在
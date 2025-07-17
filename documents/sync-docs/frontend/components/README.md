# Components

再利用可能なReactコンポーネント。

## ディレクトリ構造

### /auth
認証関連のコンポーネント：
- **ProtectedRoute** - 認証が必要なルートの保護
- **AuthWrapper** - 認証状態の表示ラッパー

### /ui
Shadcn/uiコンポーネントライブラリ：
- 基本的なUIコンポーネント（Button、Card、Input等）
- 一貫性のあるデザインシステム
- アクセシビリティ対応

## コンポーネント開発ガイドライン

1. Shadcn/uiコンポーネントを優先使用
2. クライアントサイドの対話性が必要な場合のみ`"use client"`を使用
3. PropsはTypeScriptで型定義
4. Tailwind CSSでスタイリング
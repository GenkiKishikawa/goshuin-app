# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code) へのガイダンスを提供します。

## プロジェクト概要

これは「わたしの御朱印」のNext.js 15アプリケーションで、御朱印（寺社の朱印）を共有・収集するための日本のソーシャルメディアプラットフォームです。アプリは静的エクスポート用に設定されており、strictモードのTypeScriptを使用しています。

## 必須コマンド

```bash
# 開発
npm run dev          # 開発サーバーを起動 http://localhost:3000

# 本番環境
npm run build        # 本番用ビルド（静的エクスポート）
npm run start        # 本番ビルドを配信

# コード品質
npm run lint         # ESLintを実行（開発中はチェック、ビルド時は無視）
```

## アーキテクチャ概要

### 技術スタック
- **Next.js 15.3.4** App Routerと静的エクスポート
- **TypeScript 5.2.2** strictモード
- **Supabase** 認証とデータベース
- **Tailwind CSS** カスタムアニメーション付き
- **Shadcn/ui** コンポーネントライブラリ（50以上のビルド済みコンポーネント）
- **React Hook Form + Zod** フォーム処理とバリデーション

### コアデータモデル (src/types/index.ts)
- **User**: 統計情報付きプロファイル（訪問数、収集数、いいね、フォロワー）
- **Shrine**: 名前、住所、座標を含む場所データ
- **Goshuin**: メタデータ付きの寺社朱印
- **Post**: 神社と御朱印をリンクするユーザー生成コンテンツ
- **Comment**: 投稿へのソーシャルインタラクション

### 主要機能
1. **認証**: ログインフロー (src/app/login)
2. **ダッシュボード**: メインユーザーフィード (src/app/dashboard)
3. **コンテンツ作成**: 画像アップロード付き投稿作成 (src/app/post)
4. **ソーシャル機能**: ユーザープロファイル、ランキング、フォローシステム
5. **発見**: 神社を見つけるためのマップビュー (src/app/map)

### コンポーネント構造
- **src/components/ui/**: Shadcn/uiライブラリコンポーネント - 一貫性のためにこれらを使用
- **src/components/**: 機能固有のコンポーネント（Header、PostCard、RankingCard）
- コンポーネントはインタラクティビティが必要な場合に "use client" ディレクティブを使用

### スタイリングアプローチ
- すべてのスタイリングにTailwind CSSを使用
- tailwind.config.tsでカスタムテーマ拡張
- src/app/globals.cssでグローバルスタイル
- コンポーネント固有のスタイルはcn()ユーティリティでTailwindクラスを使用

## 開発上の注意点

### 静的エクスポート設定
アプリはnext.config.jsで `output: 'export'` に設定されており、以下を意味します：
- サーバーサイドレンダリングやAPIルートなし
- 画像は非最適化（静的エクスポートに必要）
- すべてのデータは現在src/lib/mock-data.tsでモック化

### フォーム処理パターン
フォームはZodスキーマでReact Hook Formを使用：
```typescript
const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: { ... }
})
```

### UIコンポーネントの使用
新しいコンポーネントを作成する前に、必ずsrc/components/ui/で既存のコンポーネントを確認してください。プロジェクトは一貫したパターンとアクセシビリティ標準に従うShadcn/uiコンポーネントを使用しています。
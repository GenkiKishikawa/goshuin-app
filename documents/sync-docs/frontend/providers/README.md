# Providers

React Context Providers。

## 主要Provider

### auth-provider.tsx
認証プロバイダー：
- 認証状態の管理
- ログイン・サインアップ機能
- Google OAuth連携
- パスワードリセット
- セッション管理
- 自動トークンリフレッシュ

## Provider開発ガイドライン

1. Context APIを使用
2. useReducerで複雑な状態管理
3. 子コンポーネントへの最適化（memo化）
4. エラー境界の実装
5. TypeScriptで型安全なContext
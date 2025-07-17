# Custom Hooks

カスタムReactフック。

## 主要なフック

### useAuthState
認証状態へのアクセス：
- `useAuthState()` - 認証状態と派生値
- `useAuthActions()` - 認証アクション（ログイン、ログアウト等）
- `useAuthLoading()` - ローディング状態

### useAuthGuard
ルート保護用フック：
- 未認証ユーザーのリダイレクト
- メール確認要件の処理

## フック開発ガイドライン

1. `use`プレフィックスを使用
2. 単一責任の原則に従う
3. エラーハンドリングを含める
4. TypeScriptで戻り値を型定義
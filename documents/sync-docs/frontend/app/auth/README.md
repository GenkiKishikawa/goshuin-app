# Auth Routes

認証関連のルート。Supabase Authとの連携を処理。

## サブルート

### /auth/callback
- OAuth認証のコールバック処理
- PKCEフローの完了
- 認証成功後のリダイレクト

### /auth/reset-password
- パスワードリセットフォーム
- メールで送信されたリセットトークンを使用

### /auth/verify-email
- メールアドレス確認ページ
- 確認メールの再送信機能
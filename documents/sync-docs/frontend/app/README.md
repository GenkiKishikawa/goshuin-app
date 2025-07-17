# App Directory

Next.js 15のApp Routerディレクトリ。各サブディレクトリがルートに対応。

## ルート構造

- **/** - ホームページ
- **/api/** - APIルート（現在は静的エクスポートのため未使用）
- **/auth/** - 認証関連ページ
  - **/callback** - OAuth認証コールバック
  - **/reset-password** - パスワードリセット
  - **/verify-email** - メール確認
- **/dashboard/** - ダッシュボード（メインフィード）
- **/login/** - ログイン・サインアップページ
- **/map/** - 神社マップ
- **/post/** - 投稿詳細ページ
- **/profile/** - ユーザープロフィール
- **/rankings/** - ランキングページ
- **/register/** - 新規神社・御朱印登録
- **/user-profile/** - ユーザープロフィール編集
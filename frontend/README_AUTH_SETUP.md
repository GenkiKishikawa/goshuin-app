# 認証セットアップガイド

## 環境変数の設定

1. `.env.local`ファイルを作成します：
```bash
cp .env.local.example .env.local
```

2. NEXTAUTH_SECRETを生成します：
```bash
openssl rand -base64 32
```

## 各プロバイダーの設定

### Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成または既存のプロジェクトを選択
3. 「APIとサービス」→「認証情報」→「認証情報を作成」→「OAuth クライアント ID」
4. アプリケーションタイプ：「ウェブアプリケーション」
5. 承認済みのリダイレクトURI：`http://localhost:3000/api/auth/callback/google`
6. クライアントIDとクライアントシークレットを`.env.local`に設定

### Twitter OAuth

1. [Twitter Developer Portal](https://developer.twitter.com/)にアクセス
2. アプリを作成
3. OAuth 2.0を有効化
4. Callback URL：`http://localhost:3000/api/auth/callback/twitter`
5. クライアントIDとクライアントシークレットを`.env.local`に設定

### LINE OAuth

1. [LINE Developers Console](https://developers.line.biz/console/)にアクセス
2. 新しいチャネルを作成（LINE Login）
3. Callback URL：`http://localhost:3000/api/auth/callback/line`
4. チャネルIDとチャネルシークレットを`.env.local`に設定

## 本番環境での設定

本番環境では以下を変更してください：

1. `NEXTAUTH_URL`を本番URLに変更
2. 各プロバイダーのコールバックURLを本番URLに変更
3. `NEXTAUTH_SECRET`を安全な値に設定

## トラブルシューティング

### エラー：「Try signing in with a different account」
- 環境変数が正しく設定されているか確認
- プロバイダーのコールバックURLが正しいか確認

### エラー：「OAuth callback error」
- クライアントIDとシークレットが正しいか確認
- プロバイダー側でアプリが有効になっているか確認
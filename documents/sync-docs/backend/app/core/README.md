# Core Functionality

アプリケーションのコア機能。

## 主要モジュール

### config.py
アプリケーション設定：
- 環境変数の管理
- データベース接続設定
- Supabase設定

### security.py
セキュリティ関連：
- パスワードハッシュ化
- JWTトークン管理
- 認証ミドルウェア

### dependencies.py
依存性注入：
- 認証の依存性
- データベースセッション
- 現在のユーザー取得

### database.py
データベース設定：
- SQLAlchemyエンジン
- セッション管理
- ベースモデル定義
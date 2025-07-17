# API Endpoints

APIエンドポイントの定義。

## 主要エンドポイント

### auth.py
認証関連エンドポイント：
- POST /auth/login - ログイン
- POST /auth/logout - ログアウト
- POST /auth/refresh - トークンリフレッシュ
- GET /auth/me - 現在のユーザー情報

### users.py
ユーザー管理：
- GET /users - ユーザー一覧
- GET /users/{id} - ユーザー詳細
- PUT /users/{id} - ユーザー更新
- DELETE /users/{id} - ユーザー削除

### posts.py
投稿管理：
- GET /posts - 投稿一覧
- POST /posts - 新規投稿
- GET /posts/{id} - 投稿詳細
- PUT /posts/{id} - 投稿更新
- DELETE /posts/{id} - 投稿削除

## APIデザインガイドライン

1. RESTful設計原則に従う
2. 適切なHTTPステータスコードを返す
3. Pydanticでリクエスト/レスポンスを検証
4. 認証が必要なエンドポイントには依存性注入を使用
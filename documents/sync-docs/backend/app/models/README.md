# Models

データベースモデルとPydanticスキーマ。

## SQLAlchemyモデル

### user.py
ユーザーモデル：
- id, email, username
- created_at, updated_at
- リレーション定義

### post.py
投稿モデル：
- id, title, content
- user_id (外部キー)
- created_at, updated_at

### temple.py
神社モデル：
- id, name, address
- location (地理情報)
- description

## Pydanticスキーマ

各モデルに対応するスキーマ：
- リクエスト用スキーマ（Create, Update）
- レスポンス用スキーマ
- バリデーションルール
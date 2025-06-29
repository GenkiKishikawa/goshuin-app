# わたしの御朱印

御朱印を共有・収集するための日本のソーシャルメディアプラットフォーム。

## プロジェクト構成

```
/src
├── frontend/          # Next.js 15 フロントエンドアプリケーション
├── backend/           # FastAPI バックエンドAPI
├── documents/         # 技術選定・機能仕様ドキュメント
└── docker-compose.yml # Docker開発環境
```

## 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 15 (静的エクスポート)
- **スタイリング**: Tailwind CSS + Shadcn/ui
- **認証**: Supabase Auth

### バックエンド
- **フレームワーク**: FastAPI (Python)
- **データベース**: PostgreSQL (Supabase)
- **認証**: Supabase Auth

## セットアップ

### 1. 環境変数の設定

```bash
# バックエンド用
cd backend
cp .env.example .env
# .envファイルを編集してSupabaseの認証情報を設定
```

### 2. Docker環境での起動

```bash
# プロジェクトルートから
docker-compose up
```

これにより以下のサービスが起動します：
- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:8000
- PostgreSQLデータベース: localhost:5432

### 3. ローカル開発

#### フロントエンド
```bash
cd frontend
npm install
npm run dev
```

#### バックエンド
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 主要機能

1. **認証・ユーザー管理**
   - ユーザー登録・ログイン
   - プロフィール管理

2. **投稿機能**
   - 御朱印画像付き投稿
   - いいね・コメント

3. **神社・寺院管理**
   - 神社・寺院の登録
   - 位置情報ベースの検索

4. **御朱印コレクション**
   - 御朱印の登録・管理
   - 受領記録

5. **ソーシャル機能**
   - フォロー・フォロワー
   - ランキング

## APIドキュメント

バックエンドAPIの仕様は以下で確認できます：
- Swagger UI: http://localhost:8000/api/v1/docs
- ReDoc: http://localhost:8000/api/v1/redoc

## 開発ガイドライン

詳細な開発ガイドラインは各ディレクトリのCLAUDE.mdを参照してください：
- `/src/CLAUDE.md` - プロジェクト全体のガイドライン
- `/src/frontend/CLAUDE.md` - フロントエンド開発ガイド

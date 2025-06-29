# わたしの御朱印 Backend API

FastAPIを使用した「わたしの御朱印」のバックエンドAPIサーバー。

## セットアップ

### 1. 環境変数の設定

```bash
cp .env.example .env
# .envファイルを編集してSupabaseの認証情報を設定
```

### 2. 依存関係のインストール

```bash
pip install -r requirements.txt
```

### 3. 開発サーバーの起動

```bash
# ローカル環境
uvicorn app.main:app --reload --port 8000

# Dockerを使用
docker-compose up backend
```

## API仕様

APIドキュメントは以下のURLで確認できます：
- Swagger UI: http://localhost:8000/api/v1/docs
- ReDoc: http://localhost:8000/api/v1/redoc

## プロジェクト構造

```
backend/
├── app/
│   ├── api/            # APIエンドポイント
│   ├── core/           # 設定・セキュリティ
│   ├── db/             # データベース接続
│   ├── models/         # SQLAlchemyモデル
│   ├── schemas/        # Pydanticスキーマ
│   ├── services/       # ビジネスロジック
│   └── main.py         # アプリケーションエントリポイント
├── tests/              # テスト
├── requirements.txt    # Python依存関係
└── Dockerfile         # Dockerイメージ定義
```
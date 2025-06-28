# Supabase認証セットアップガイド

## Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com/)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトのURL、匿名キー、サービスロールキーを確認

## 環境変数の設定

1. `.env.local`ファイルを作成します：
```bash
cp .env.local.example .env.local
```

2. Supabaseの環境変数を設定します：
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 認証の設定

### Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成または既存のプロジェクトを選択
3. 「APIとサービス」→「認証情報」→「認証情報を作成」→「OAuth クライアント ID」
4. アプリケーションタイプ：「ウェブアプリケーション」
5. 承認済みのリダイレクトURI：
   - 開発環境：`http://localhost:3000/auth/callback`
   - 本番環境：`https://your-domain.com/auth/callback`
6. Supabaseダッシュボードで「Authentication」→「Providers」→「Google」を有効化
7. Google OAuth設定でClient IDとClient Secretを設定

### Email認証

Supabaseのメール認証は追加設定なしで動作します。

### 匿名認証（ゲストユーザー）

Supabaseダッシュボードで「Authentication」→「Settings」→「Enable anonymous sign-ins」を有効化

## データベース設定

### Row Level Security (RLS)

ユーザー投稿データに対してRLSを設定：

```sql
-- ユーザーテーブル
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 自分のプロフィールのみ更新可能
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 全員がプロフィールを閲覧可能
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);
```

## 本番環境での設定

1. Supabase本番プロジェクトを作成
2. カスタムドメインを設定（オプション）
3. 環境変数を本番値に更新
4. Google OAuthのリダイレクトURIを本番URLに更新

## トラブルシューティング

### エラー：「Invalid API key」
- `NEXT_PUBLIC_SUPABASE_URL`と`NEXT_PUBLIC_SUPABASE_ANON_KEY`が正しく設定されているか確認

### エラー：「OAuth callback error」
- Google OAuthのリダイレクトURIが正しいか確認
- Supabase側のGoogle OAuth設定が正しいか確認

### エラー：「Row Level Security policy violation」
- RLSポリシーが正しく設定されているか確認
- ユーザーが認証されているか確認
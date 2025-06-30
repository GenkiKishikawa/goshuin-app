from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    アプリケーションの設定クラス
    
    環境変数から設定を読み込み、
    アプリケーション全体で使用する設定値を管理する。
    """
    # API設定
    PROJECT_NAME: str = "わたしの御朱印 API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Supabase設定 - 認証とデータベースアクセス用
    SUPABASE_URL: str  # SupabaseプロジェクトのURL
    SUPABASE_KEY: str  # Supabaseの匿名公開キー
    SUPABASE_SERVICE_KEY: str  # Supabaseのサービスロールキー（管理用）
    
    # データベース設定
    DATABASE_URL: str  # PostgreSQL接続URL
    
    # JWT設定 - トークン生成と検証用
    SECRET_KEY: str  # JWT署名用の秘密鍵
    ALGORITHM: str = "HS256"  # JWT署名アルゴリズム
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # アクセストークンの有効期限（分）
    
    # CORS設定
    FRONTEND_URL: str = "http://localhost:3000"  # フロントエンドのURL
    
    # 環境設定
    ENVIRONMENT: str = "development"  # 実行環境（development/staging/production）
    
    class Config:
        """
        Pydantic設定クラス
        
        環境変数の読み込み方法を定義
        """
        env_file = ".env"  # 環境変数ファイルのパス
        case_sensitive = True  # 環境変数名の大文字・小文字を区別


# 設定インスタンスを作成（シングルトン）
settings = Settings()
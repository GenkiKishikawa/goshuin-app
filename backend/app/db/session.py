"""
データベースセッション管理

SQLAlchemyのセッション設定とSupabase接続の管理
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from supabase import create_client, Client

from app.core.config import settings

# SQLAlchemyエンジンの作成
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # 接続の健全性チェック
    pool_size=10,        # コネクションプールサイズ
    max_overflow=20      # 最大オーバーフロー接続数
)

# セッションローカルクラスの作成
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Supabaseクライアントの作成
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
supabase_admin: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
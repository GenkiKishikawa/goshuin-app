from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # API設定
    PROJECT_NAME: str = "わたしの御朱印 API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Supabase設定
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SERVICE_KEY: str
    
    # データベース設定
    DATABASE_URL: str
    
    # JWT設定
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS設定
    FRONTEND_URL: str = "http://localhost:3000"
    
    # 環境設定
    ENVIRONMENT: str = "development"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
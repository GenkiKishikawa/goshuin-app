from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr

# 認証関連のAPIエンドポイントを定義するルーター
router = APIRouter()


class UserLogin(BaseModel):
    """ログイン時のリクエストボディ"""
    email: EmailStr
    password: str


class UserRegister(BaseModel):
    """ユーザー登録時のリクエストボディ"""
    email: EmailStr
    password: str
    username: str


class Token(BaseModel):
    """認証トークンのレスポンスモデル"""
    access_token: str
    token_type: str = "bearer"


@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """
    ユーザーログイン処理
    
    メールアドレスとパスワードで認証を行い、
    認証成功時にはJWTトークンを返却する。
    
    Args:
        user_credentials: メールアドレスとパスワード
        
    Returns:
        Token: アクセストークンとトークンタイプ
    """
    # TODO: Supabase認証の実装
    return Token(access_token="mock_token")


@router.post("/register", response_model=Token)
async def register(user_data: UserRegister):
    """
    新規ユーザー登録処理
    
    メールアドレス、パスワード、ユーザー名で新規登録を行い、
    登録成功時には自動的にログインしてJWTトークンを返却する。
    
    Args:
        user_data: 登録に必要なユーザー情報
        
    Returns:
        Token: アクセストークンとトークンタイプ
    """
    # TODO: Supabase認証の実装
    return Token(access_token="mock_token")


@router.post("/logout")
async def logout():
    """
    ログアウト処理
    
    現在のセッションを終了し、トークンを無効化する。
    
    Returns:
        dict: ログアウト完了メッセージ
    """
    # TODO: トークンの無効化処理
    return {"message": "ログアウトしました"}
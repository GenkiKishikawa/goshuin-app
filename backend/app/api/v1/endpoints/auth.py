from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr

router = APIRouter()


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    username: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """ユーザーログイン"""
    # TODO: Supabase認証の実装
    return Token(access_token="mock_token")


@router.post("/register", response_model=Token)
async def register(user_data: UserRegister):
    """新規ユーザー登録"""
    # TODO: Supabase認証の実装
    return Token(access_token="mock_token")


@router.post("/logout")
async def logout():
    """ログアウト"""
    # TODO: トークンの無効化処理
    return {"message": "ログアウトしました"}
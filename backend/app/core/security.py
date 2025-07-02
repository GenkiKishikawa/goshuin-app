"""
セキュリティ関連のユーティリティ

JWT認証とSupabase Auth連携の処理
"""
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import jwt
from jwt import PyJWTError
from passlib.context import CryptContext

from app.core.config import settings

# パスワードハッシュコンテキスト
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    アクセストークンの生成
    
    Args:
        data: トークンに含めるデータ
        expires_delta: 有効期限の指定（デフォルトは設定値）
    
    Returns:
        JWTトークン文字列
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """
    トークンの検証
    
    Args:
        token: JWTトークン文字列
    
    Returns:
        トークンのペイロード（検証成功時）、None（検証失敗時）
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except PyJWTError:
        return None


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    パスワードの検証
    
    Args:
        plain_password: 平文パスワード
        hashed_password: ハッシュ化されたパスワード
    
    Returns:
        検証結果
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    パスワードのハッシュ化
    
    Args:
        password: 平文パスワード
    
    Returns:
        ハッシュ化されたパスワード
    """
    return pwd_context.hash(password)
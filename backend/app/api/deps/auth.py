"""
認証関連の依存性注入

FastAPIのDependency Injectionシステムで使用する認証関連の関数
"""
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.security import verify_token
from app.db.session import SessionLocal, supabase
from app.models.user import User

# HTTPベアラー認証スキーム
security = HTTPBearer()


def get_db() -> Session:
    """
    データベースセッションの取得
    
    Yields:
        データベースセッション
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """
    現在のユーザーIDを取得（Supabase Auth）
    
    Args:
        credentials: HTTPベアラートークン
    
    Returns:
        ユーザーID（Supabase UID）
    
    Raises:
        HTTPException: 認証エラー
    """
    token = credentials.credentials
    
    try:
        # Supabase Authでトークンを検証
        user_response = supabase.auth.get_user(token)
        if not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="無効な認証情報です",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_response.user.id
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="認証トークンの検証に失敗しました",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
) -> User:
    """
    現在のユーザー情報を取得
    
    Args:
        user_id: Supabase UID
        db: データベースセッション
    
    Returns:
        ユーザーモデル
    
    Raises:
        HTTPException: ユーザーが見つからない場合
    """
    user = db.query(User).filter(User.uid == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ユーザーが見つかりません"
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="アカウントが無効化されています"
        )
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    アクティブなユーザーのみを取得
    
    Args:
        current_user: 現在のユーザー
    
    Returns:
        アクティブなユーザーモデル
    
    Raises:
        HTTPException: ユーザーが無効な場合
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="アカウントが無効化されています"
        )
    return current_user


async def get_current_admin_user(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> User:
    """
    管理者ユーザーのみを取得
    
    Args:
        current_user: 現在のユーザー
        db: データベースセッション
    
    Returns:
        管理者ユーザーモデル
    
    Raises:
        HTTPException: 管理者権限がない場合
    """
    from app.models.user import AdminUser, UserRole
    
    admin = db.query(AdminUser).filter(AdminUser.user_id == current_user.id).first()
    if not admin or admin.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="管理者権限が必要です"
        )
    return current_user


async def get_optional_current_user(
    authorization: Optional[str] = None,
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    オプショナルな認証（ログインしていなくてもOK）
    
    Args:
        authorization: Authorizationヘッダー
        db: データベースセッション
    
    Returns:
        ユーザーモデル（ログインしている場合）、None（ログインしていない場合）
    """
    if not authorization:
        return None
    
    try:
        # "Bearer " プレフィックスを削除
        token = authorization.replace("Bearer ", "")
        user_response = supabase.auth.get_user(token)
        if not user_response.user:
            return None
        
        user = db.query(User).filter(User.uid == user_response.user.id).first()
        return user if user and user.is_active else None
    except Exception:
        return None
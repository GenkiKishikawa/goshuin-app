from typing import List
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

# ユーザー関連のAPIエンドポイントを定義するルーター
router = APIRouter()


class UserProfile(BaseModel):
    """ユーザープロフィール情報のレスポンスモデル"""
    id: str
    username: str
    display_name: str
    bio: str
    avatar_url: str
    followers_count: int
    following_count: int
    posts_count: int


class UserUpdate(BaseModel):
    """ユーザー情報更新時のリクエストボディ"""
    display_name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None


@router.get("/me", response_model=UserProfile)
async def get_current_user():
    """
    現在ログイン中のユーザー情報を取得
    
    認証トークンから現在のユーザーを特定し、
    そのユーザーのプロフィール情報を返却する。
    
    Returns:
        UserProfile: ログイン中のユーザーのプロフィール情報
    """
    # TODO: 認証済みユーザーの情報を取得
    return UserProfile(
        id="user_1",
        username="test_user",
        display_name="テストユーザー",
        bio="御朱印集めが趣味です",
        avatar_url="/avatars/user1.jpg",
        followers_count=10,
        following_count=20,
        posts_count=5
    )


@router.get("/{user_id}", response_model=UserProfile)
async def get_user(user_id: str):
    """
    指定されたユーザーの情報を取得
    
    ユーザーIDを元に該当ユーザーのプロフィール情報を取得する。
    プライバシー設定により一部情報が制限される場合がある。
    
    Args:
        user_id: 取得対象のユーザーID
        
    Returns:
        UserProfile: 指定ユーザーのプロフィール情報
    """
    # TODO: データベースからユーザー情報を取得
    return UserProfile(
        id=user_id,
        username="other_user",
        display_name="他のユーザー",
        bio="神社めぐりが好きです",
        avatar_url="/avatars/user2.jpg",
        followers_count=50,
        following_count=30,
        posts_count=100
    )


@router.put("/me", response_model=UserProfile)
async def update_user(user_update: UserUpdate):
    """
    現在のユーザー情報を更新
    
    ログイン中のユーザーのプロフィール情報（表示名、自己紹介、アバター）を更新する。
    指定されたフィールドのみ更新され、未指定のフィールドは変更されない。
    
    Args:
        user_update: 更新する情報（部分更新可能）
        
    Returns:
        UserProfile: 更新後のユーザープロフィール情報
    """
    # TODO: ユーザー情報の更新処理
    return UserProfile(
        id="user_1",
        username="test_user",
        display_name=user_update.display_name or "テストユーザー",
        bio=user_update.bio or "御朱印集めが趣味です",
        avatar_url=user_update.avatar_url or "/avatars/user1.jpg",
        followers_count=10,
        following_count=20,
        posts_count=5
    )


@router.post("/{user_id}/follow")
async def follow_user(user_id: str):
    """
    指定したユーザーをフォロー
    
    対象ユーザーをフォローし、フォロー関係を確立する。
    既にフォロー済みの場合はエラーを返す。
    
    Args:
        user_id: フォロー対象のユーザーID
        
    Returns:
        dict: フォロー完了メッセージ
    """
    # TODO: フォロー処理の実装
    return {"message": f"ユーザー {user_id} をフォローしました"}


@router.delete("/{user_id}/follow")
async def unfollow_user(user_id: str):
    """
    指定したユーザーのフォローを解除
    
    対象ユーザーとのフォロー関係を解除する。
    フォローしていない場合はエラーを返す。
    
    Args:
        user_id: フォロー解除対象のユーザーID
        
    Returns:
        dict: フォロー解除完了メッセージ
    """
    # TODO: フォロー解除処理の実装
    return {"message": f"ユーザー {user_id} のフォローを解除しました"}
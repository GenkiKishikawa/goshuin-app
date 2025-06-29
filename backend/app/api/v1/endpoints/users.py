from typing import List
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter()


class UserProfile(BaseModel):
    id: str
    username: str
    display_name: str
    bio: str
    avatar_url: str
    followers_count: int
    following_count: int
    posts_count: int


class UserUpdate(BaseModel):
    display_name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None


@router.get("/me", response_model=UserProfile)
async def get_current_user():
    """現在のユーザー情報を取得"""
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
    """指定されたユーザーの情報を取得"""
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
    """ユーザー情報を更新"""
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
    """ユーザーをフォロー"""
    # TODO: フォロー処理の実装
    return {"message": f"ユーザー {user_id} をフォローしました"}


@router.delete("/{user_id}/follow")
async def unfollow_user(user_id: str):
    """ユーザーのフォローを解除"""
    # TODO: フォロー解除処理の実装
    return {"message": f"ユーザー {user_id} のフォローを解除しました"}
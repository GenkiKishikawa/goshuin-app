"""
ユーザー関連のPydanticスキーマ
"""
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    """ユーザーの基本情報スキーマ"""
    display_name: str
    bio: Optional[str] = None
    profile_image_url: Optional[str] = None


class UserCreate(UserBase):
    """ユーザー作成スキーマ"""
    uid: str
    email: Optional[EmailStr] = None


class UserUpdate(BaseModel):
    """ユーザー更新スキーマ"""
    display_name: Optional[str] = None
    bio: Optional[str] = None
    profile_image_url: Optional[str] = None


class UserStatsResponse(BaseModel):
    """ユーザー統計レスポンススキーマ"""
    post_count: int
    total_likes_received: int
    visited_shrine_count: int
    collected_goshuin_count: int
    registered_shrine_count: int
    registered_goshuin_count: int
    follower_count: int
    following_count: int
    
    class Config:
        from_attributes = True


class BadgeResponse(BaseModel):
    """バッジレスポンススキーマ"""
    id: int
    badge_type: str
    achieved_at: datetime
    
    class Config:
        from_attributes = True


class UserResponse(UserBase):
    """ユーザーレスポンススキーマ"""
    id: int
    uid: str
    email: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime
    stats: Optional[UserStatsResponse] = None
    badges: List[BadgeResponse] = []
    
    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    """ユーザー一覧レスポンススキーマ"""
    id: int
    display_name: str
    profile_image_url: Optional[str]
    stats: Optional[UserStatsResponse]
    
    class Config:
        from_attributes = True


class FollowRequest(BaseModel):
    """フォローリクエストスキーマ"""
    following_user_id: int


class FollowResponse(BaseModel):
    """フォローレスポンススキーマ"""
    follower_user_id: int
    following_user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class NotificationResponse(BaseModel):
    """通知レスポンススキーマ"""
    id: int
    type: str
    message: str
    is_read: bool
    created_at: datetime
    read_at: Optional[datetime]
    related_user_id: Optional[int]
    related_post_id: Optional[int]
    
    class Config:
        from_attributes = True
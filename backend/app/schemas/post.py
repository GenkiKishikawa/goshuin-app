"""
投稿関連のPydanticスキーマ
"""
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel


class PostBase(BaseModel):
    """投稿の基本情報スキーマ"""
    content: str
    image_urls: List[str] = []


class PostCreate(PostBase):
    """投稿作成スキーマ"""
    shrine_id: Optional[int] = None
    goshuin_type_id: Optional[int] = None


class PostUpdate(BaseModel):
    """投稿更新スキーマ"""
    content: Optional[str] = None
    image_urls: Optional[List[str]] = None


class PostImageResponse(BaseModel):
    """投稿画像レスポンススキーマ"""
    id: int
    image_url: str
    
    class Config:
        from_attributes = True


class PostLikeResponse(BaseModel):
    """いいねレスポンススキーマ"""
    user_id: int
    post_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class PostCommentResponse(BaseModel):
    """コメントレスポンススキーマ"""
    id: int
    user_id: int
    content: str
    created_at: datetime
    user_display_name: str
    user_profile_image_url: Optional[str]
    
    class Config:
        from_attributes = True


class PostResponse(PostBase):
    """投稿レスポンススキーマ"""
    id: int
    user_id: int
    shrine_id: Optional[int]
    goshuin_type_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    like_count: int = 0
    comment_count: int = 0
    user_display_name: str
    user_profile_image_url: Optional[str]
    shrine_name: Optional[str]
    goshuin_type_name: Optional[str]
    images: List[PostImageResponse] = []
    likes: List[PostLikeResponse] = []
    comments: List[PostCommentResponse] = []
    is_liked: bool = False  # 現在のユーザーがいいねしているか
    
    class Config:
        from_attributes = True


class PostListResponse(BaseModel):
    """投稿一覧レスポンススキーマ"""
    id: int
    user_id: int
    content: str
    created_at: datetime
    like_count: int
    comment_count: int
    user_display_name: str
    user_profile_image_url: Optional[str]
    shrine_name: Optional[str]
    first_image_url: Optional[str]
    is_liked: bool = False
    
    class Config:
        from_attributes = True


class CommentCreate(BaseModel):
    """コメント作成スキーマ"""
    content: str


class LikeRequest(BaseModel):
    """いいねリクエストスキーマ"""
    pass
from typing import List
from datetime import datetime
from fastapi import APIRouter, Query, status
from pydantic import BaseModel

router = APIRouter()


class Post(BaseModel):
    id: str
    user_id: str
    username: str
    user_avatar: str
    content: str
    images: List[str]
    temple_id: str | None
    temple_name: str | None
    goshuin_id: str | None
    likes_count: int
    comments_count: int
    created_at: datetime
    is_liked: bool = False


class PostCreate(BaseModel):
    content: str
    images: List[str]
    temple_id: str | None = None
    goshuin_id: str | None = None


class PostsResponse(BaseModel):
    posts: List[Post]
    total: int
    page: int
    per_page: int


@router.get("/", response_model=PostsResponse)
async def get_posts(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100)
):
    """投稿一覧を取得"""
    # TODO: データベースから投稿を取得
    mock_posts = [
        Post(
            id=f"post_{i}",
            user_id="user_1",
            username="test_user",
            user_avatar="/avatars/user1.jpg",
            content=f"素晴らしい御朱印をいただきました！ #{i}",
            images=[f"/images/goshuin_{i}.jpg"],
            temple_id="temple_1",
            temple_name="浅草寺",
            goshuin_id=f"goshuin_{i}",
            likes_count=10 + i,
            comments_count=5,
            created_at=datetime.now(),
            is_liked=False
        )
        for i in range(1, 6)
    ]
    
    return PostsResponse(
        posts=mock_posts,
        total=100,
        page=page,
        per_page=per_page
    )


@router.post("/", response_model=Post, status_code=status.HTTP_201_CREATED)
async def create_post(post_data: PostCreate):
    """新規投稿を作成"""
    # TODO: 投稿の作成処理
    return Post(
        id="new_post_1",
        user_id="user_1",
        username="test_user",
        user_avatar="/avatars/user1.jpg",
        content=post_data.content,
        images=post_data.images,
        temple_id=post_data.temple_id,
        temple_name="浅草寺" if post_data.temple_id else None,
        goshuin_id=post_data.goshuin_id,
        likes_count=0,
        comments_count=0,
        created_at=datetime.now(),
        is_liked=False
    )


@router.get("/{post_id}", response_model=Post)
async def get_post(post_id: str):
    """指定された投稿を取得"""
    # TODO: 投稿の詳細を取得
    return Post(
        id=post_id,
        user_id="user_1",
        username="test_user",
        user_avatar="/avatars/user1.jpg",
        content="素晴らしい御朱印をいただきました！",
        images=["/images/goshuin_1.jpg"],
        temple_id="temple_1",
        temple_name="浅草寺",
        goshuin_id="goshuin_1",
        likes_count=42,
        comments_count=8,
        created_at=datetime.now(),
        is_liked=False
    )


@router.post("/{post_id}/like")
async def like_post(post_id: str):
    """投稿にいいねをつける"""
    # TODO: いいね処理の実装
    return {"message": f"投稿 {post_id} にいいねしました"}


@router.delete("/{post_id}/like")
async def unlike_post(post_id: str):
    """投稿のいいねを取り消す"""
    # TODO: いいね取り消し処理の実装
    return {"message": f"投稿 {post_id} のいいねを取り消しました"}
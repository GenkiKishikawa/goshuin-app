from typing import List
from datetime import datetime
from fastapi import APIRouter, Query, status
from pydantic import BaseModel

# 投稿関連のAPIエンドポイントを定義するルーター
router = APIRouter()


class Post(BaseModel):
    """投稿情報のレスポンスモデル"""
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
    is_liked: bool = False  # 現在のユーザーがいいね済みかどうか


class PostCreate(BaseModel):
    """投稿作成時のリクエストボディ"""
    content: str
    images: List[str]
    temple_id: str | None = None
    goshuin_id: str | None = None


class PostsResponse(BaseModel):
    """投稿一覧のページネーション付きレスポンスモデル"""
    posts: List[Post]
    total: int
    page: int
    per_page: int


@router.get("/", response_model=PostsResponse)
async def get_posts(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100)
):
    """
    投稿一覧を取得
    
    ページネーションを使用して投稿の一覧を取得する。
    デフォルトでは最新の投稿から表示される。
    
    Args:
        page: ページ番号（1から開始）
        per_page: 1ページあたりの投稿数（1-100）
        
    Returns:
        PostsResponse: 投稿一覧とページネーション情報
    """
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
    """
    新規投稿を作成
    
    ユーザーが御朱印の画像や情報を投稿する。
    神社・寺院や御朱印の情報を紐付けることができる。
    
    Args:
        post_data: 投稿内容、画像、関連情報
        
    Returns:
        Post: 作成された投稿情報
    """
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
    """
    指定された投稿の詳細を取得
    
    投稿IDを元に特定の投稿の詳細情報を取得する。
    いいね状態は現在のユーザーに基づいて設定される。
    
    Args:
        post_id: 取得対象の投稿ID
        
    Returns:
        Post: 投稿の詳細情報
    """
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
    """
    投稿にいいねをつける
    
    指定された投稿に現在のユーザーがいいねをつける。
    既にいいね済みの場合はエラーを返す。
    
    Args:
        post_id: いいね対象の投稿ID
        
    Returns:
        dict: いいね完了メッセージ
    """
    # TODO: いいね処理の実装
    return {"message": f"投稿 {post_id} にいいねしました"}


@router.delete("/{post_id}/like")
async def unlike_post(post_id: str):
    """
    投稿のいいねを取り消す
    
    指定された投稿から現在のユーザーのいいねを取り消す。
    いいねしていない場合はエラーを返す。
    
    Args:
        post_id: いいね取り消し対象の投稿ID
        
    Returns:
        dict: いいね取り消し完了メッセージ
    """
    # TODO: いいね取り消し処理の実装
    return {"message": f"投稿 {post_id} のいいねを取り消しました"}
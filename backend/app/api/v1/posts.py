"""
投稿関連のAPIエンドポイント
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from app.api.deps import (
    get_db,
    get_current_user,
    get_current_active_user,
    get_optional_current_user
)
from app.models.post import Post, PostImage, PostLike, PostComment
from app.models.user import User
from app.models.shrine import Shrine, GoshuinType
from app.schemas.post import (
    PostCreate,
    PostUpdate,
    PostResponse,
    PostListResponse,
    CommentCreate,
    PostCommentResponse,
    LikeRequest
)

router = APIRouter()


@router.get("/", response_model=List[PostListResponse])
async def get_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    user_id: Optional[int] = Query(None),
    shrine_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    投稿一覧を取得する
    
    Args:
        skip: スキップする件数
        limit: 取得する件数
        user_id: 特定ユーザーの投稿のみ取得
        shrine_id: 特定神社の投稿のみ取得
        db: データベースセッション
        current_user: 現在のユーザー（オプション）
    
    Returns:
        投稿一覧
    """
    query = db.query(Post).join(User)
    
    # フィルタ条件を適用
    if user_id:
        query = query.filter(Post.user_id == user_id)
    if shrine_id:
        query = query.filter(Post.shrine_id == shrine_id)
    
    # 最新順で取得
    posts = query.order_by(desc(Post.created_at)).offset(skip).limit(limit).all()
    
    post_list = []
    for post in posts:
        # ユーザー情報を取得
        user = db.query(User).filter(User.id == post.user_id).first()
        
        # 神社情報を取得
        shrine = None
        if post.shrine_id:
            shrine = db.query(Shrine).filter(Shrine.id == post.shrine_id).first()
        
        # いいね数・コメント数を取得
        like_count = db.query(PostLike).filter(PostLike.post_id == post.id).count()
        comment_count = db.query(PostComment).filter(PostComment.post_id == post.id).count()
        
        # 最初の画像を取得
        first_image = db.query(PostImage).filter(PostImage.post_id == post.id).first()
        
        # 現在のユーザーがいいねしているかチェック
        is_liked = False
        if current_user:
            is_liked = db.query(PostLike).filter(
                PostLike.post_id == post.id,
                PostLike.user_id == current_user.id
            ).first() is not None
        
        post_data = {
            "id": post.id,
            "user_id": post.user_id,
            "content": post.content,
            "created_at": post.created_at,
            "like_count": like_count,
            "comment_count": comment_count,
            "user_display_name": user.display_name,
            "user_profile_image_url": user.profile_image_url,
            "shrine_name": shrine.name if shrine else None,
            "first_image_url": first_image.image_url if first_image else None,
            "is_liked": is_liked
        }
        post_list.append(PostListResponse(**post_data))
    
    return post_list


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    投稿詳細を取得する
    
    Args:
        post_id: 投稿ID
        db: データベースセッション
        current_user: 現在のユーザー（オプション）
    
    Returns:
        投稿詳細情報
    
    Raises:
        HTTPException: 投稿が見つからない場合
    """
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="投稿が見つかりません"
        )
    
    # 関連データを取得
    user = db.query(User).filter(User.id == post.user_id).first()
    shrine = None
    goshuin_type = None
    
    if post.shrine_id:
        shrine = db.query(Shrine).filter(Shrine.id == post.shrine_id).first()
    if post.goshuin_type_id:
        goshuin_type = db.query(GoshuinType).filter(GoshuinType.id == post.goshuin_type_id).first()
    
    # 画像、いいね、コメントを取得
    images = db.query(PostImage).filter(PostImage.post_id == post.id).all()
    likes = db.query(PostLike).filter(PostLike.post_id == post.id).all()
    
    comments = db.query(PostComment, User)\
        .join(User, PostComment.user_id == User.id)\
        .filter(PostComment.post_id == post.id)\
        .order_by(PostComment.created_at)\
        .all()
    
    # 現在のユーザーがいいねしているかチェック
    is_liked = False
    if current_user:
        is_liked = any(like.user_id == current_user.id for like in likes)
    
    # コメントデータを構築
    comment_list = []
    for comment, comment_user in comments:
        comment_data = {
            "id": comment.id,
            "user_id": comment.user_id,
            "content": comment.content,
            "created_at": comment.created_at,
            "user_display_name": comment_user.display_name,
            "user_profile_image_url": comment_user.profile_image_url
        }
        comment_list.append(PostCommentResponse(**comment_data))
    
    post_data = {
        **post.__dict__,
        "like_count": len(likes),
        "comment_count": len(comments),
        "user_display_name": user.display_name,
        "user_profile_image_url": user.profile_image_url,
        "shrine_name": shrine.name if shrine else None,
        "goshuin_type_name": goshuin_type.name if goshuin_type else None,
        "images": images,
        "likes": likes,
        "comments": comment_list,
        "is_liked": is_liked
    }
    
    return PostResponse(**post_data)


@router.post("/", response_model=PostResponse)
async def create_post(
    post_create: PostCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    新しい投稿を作成する
    
    Args:
        post_create: 投稿作成データ
        current_user: 現在のユーザー
        db: データベースセッション
    
    Returns:
        作成された投稿情報
    
    Raises:
        HTTPException: 神社または御朱印種別が見つからない場合
    """
    # 神社と御朱印種別の存在確認
    if post_create.shrine_id:
        shrine = db.query(Shrine).filter(Shrine.id == post_create.shrine_id).first()
        if not shrine:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="神社が見つかりません"
            )
    
    if post_create.goshuin_type_id:
        goshuin_type = db.query(GoshuinType).filter(GoshuinType.id == post_create.goshuin_type_id).first()
        if not goshuin_type:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="御朱印種別が見つかりません"
            )
    
    # 投稿を作成
    post = Post(
        user_id=current_user.id,
        content=post_create.content,
        shrine_id=post_create.shrine_id,
        goshuin_type_id=post_create.goshuin_type_id
    )
    
    db.add(post)
    db.commit()
    db.refresh(post)
    
    # 画像を追加
    for image_url in post_create.image_urls:
        post_image = PostImage(
            post_id=post.id,
            image_url=image_url
        )
        db.add(post_image)
    
    db.commit()
    
    # 作成された投稿を取得して返す
    return await get_post(post.id, db, current_user)


@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    post_update: PostUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    投稿を更新する
    
    Args:
        post_id: 投稿ID
        post_update: 更新データ
        current_user: 現在のユーザー
        db: データベースセッション
    
    Returns:
        更新された投稿情報
    
    Raises:
        HTTPException: 投稿が見つからない場合や権限がない場合
    """
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="投稿が見つかりません"
        )
    
    # 投稿者のみ更新可能
    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="この投稿を更新する権限がありません"
        )
    
    # 更新可能なフィールドのみを更新
    update_data = post_update.dict(exclude_unset=True)
    
    # 画像を更新する場合は既存の画像を削除
    if "image_urls" in update_data:
        db.query(PostImage).filter(PostImage.post_id == post.id).delete()
        for image_url in update_data["image_urls"]:
            post_image = PostImage(
                post_id=post.id,
                image_url=image_url
            )
            db.add(post_image)
        del update_data["image_urls"]
    
    # その他のフィールドを更新
    for field, value in update_data.items():
        setattr(post, field, value)
    
    db.commit()
    db.refresh(post)
    
    return await get_post(post.id, db, current_user)


@router.delete("/{post_id}")
async def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    投稿を削除する
    
    Args:
        post_id: 投稿ID
        current_user: 現在のユーザー
        db: データベースセッション
    
    Raises:
        HTTPException: 投稿が見つからない場合や権限がない場合
    """
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="投稿が見つかりません"
        )
    
    # 投稿者のみ削除可能  
    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="この投稿を削除する権限がありません"
        )
    
    db.delete(post)
    db.commit()
    
    return {"message": "投稿を削除しました"}


@router.post("/{post_id}/like")
async def like_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    投稿にいいねする
    
    Args:
        post_id: 投稿ID
        current_user: 現在のユーザー
        db: データベースセッション
    
    Raises:
        HTTPException: 投稿が見つからない場合や既にいいね済みの場合
    """
    # 投稿の存在確認
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="投稿が見つかりません"
        )
    
    # 既にいいねしているかチェック
    existing_like = db.query(PostLike).filter(
        PostLike.post_id == post_id,
        PostLike.user_id == current_user.id
    ).first()
    
    if existing_like:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="既にいいねしています"
        )
    
    # いいねを作成
    like = PostLike(
        post_id=post_id,
        user_id=current_user.id
    )
    
    db.add(like)
    db.commit()
    
    return {"message": "いいねしました"}


@router.delete("/{post_id}/like")
async def unlike_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    投稿のいいねを取り消す
    
    Args:
        post_id: 投稿ID
        current_user: 現在のユーザー
        db: データベースセッション
    
    Raises:
        HTTPException: いいねが見つからない場合
    """
    like = db.query(PostLike).filter(
        PostLike.post_id == post_id,
        PostLike.user_id == current_user.id
    ).first()
    
    if not like:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="いいねが見つかりません"
        )
    
    db.delete(like)
    db.commit()
    
    return {"message": "いいねを取り消しました"}


@router.post("/{post_id}/comments", response_model=PostCommentResponse)
async def create_comment(
    post_id: int,
    comment_create: CommentCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    投稿にコメントする
    
    Args:
        post_id: 投稿ID
        comment_create: コメント作成データ
        current_user: 現在のユーザー
        db: データベースセッション
    
    Returns:
        作成されたコメント情報
    
    Raises:
        HTTPException: 投稿が見つからない場合
    """
    # 投稿の存在確認
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="投稿が見つかりません"
        )
    
    # コメントを作成
    comment = PostComment(
        post_id=post_id,
        user_id=current_user.id,
        content=comment_create.content
    )
    
    db.add(comment)
    db.commit()
    db.refresh(comment)
    
    # レスポンス用データを構築
    comment_data = {
        "id": comment.id,
        "user_id": comment.user_id,
        "content": comment.content,
        "created_at": comment.created_at,
        "user_display_name": current_user.display_name,
        "user_profile_image_url": current_user.profile_image_url
    }
    
    return PostCommentResponse(**comment_data)


@router.delete("/comments/{comment_id}")
async def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    コメントを削除する
    
    Args:
        comment_id: コメントID
        current_user: 現在のユーザー
        db: データベースセッション
    
    Raises:
        HTTPException: コメントが見つからない場合や権限がない場合
    """
    comment = db.query(PostComment).filter(PostComment.id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="コメントが見つかりません"
        )
    
    # コメント投稿者のみ削除可能
    if comment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="このコメントを削除する権限がありません"
        )
    
    db.delete(comment)
    db.commit()
    
    return {"message": "コメントを削除しました"}
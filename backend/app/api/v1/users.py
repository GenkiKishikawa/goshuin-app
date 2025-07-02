"""
ユーザー関連のAPIエンドポイント
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.api.deps import (
    get_db,
    get_current_user,
    get_current_active_user,
    get_optional_current_user
)
from app.models.user import User, Follow, UserStats, Badge
from app.schemas.user import (
    UserResponse,
    UserUpdate,
    UserListResponse,
    FollowRequest,
    FollowResponse
)

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)     
):
    """
    現在のユーザープロフィールを取得する
    
    Args:
        current_user: 現在のユーザー
        db: データベースセッション
    
    Returns:
        ユーザープロフィール情報
    """
    # 統計情報を取得
    stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()
    
    # バッジ情報を取得
    badges = db.query(Badge).filter(Badge.user_id == current_user.id).all()
    
    # レスポンス用データを構築
    user_data = {
        **current_user.__dict__,
        "stats": stats,
        "badges": badges
    }
    
    return UserResponse(**user_data)


@router.put("/me", response_model=UserResponse)
async def update_current_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user), 
    db: Session = Depends(get_db)
):
    """
    現在のユーザープロフィールを更新する
    
    Args:
        user_update: 更新するユーザー情報
        current_user: 現在のユーザー
        db: データベースセッション
    
    Returns:
        更新されたユーザープロフィール情報
    """
    # 更新可能なフィールドのみを更新
    update_data = user_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    # 統計情報とバッジを取得
    stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()
    badges = db.query(Badge).filter(Badge.user_id == current_user.id).all()
    
    user_data = {
        **current_user.__dict__,
        "stats": stats,
        "badges": badges
    }
    
    return UserResponse(**user_data)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    指定したユーザーのプロフィールを取得する
    
    Args:
        user_id: ユーザーID 
        db: データベースセッション
        current_user: 現在のユーザー（オプション）
    
    Returns:
        ユーザープロフィール情報
    
    Raises:
        HTTPException: ユーザーが見つからない場合
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ユーザーが見つかりません"
        )
    
    # 統計情報とバッジを取得
    stats = db.query(UserStats).filter(UserStats.user_id == user.id).first()
    badges = db.query(Badge).filter(Badge.user_id == user.id).all()
    
    user_data = {
        **user.__dict__,
        "stats": stats,
        "badges": badges
    }
    
    return UserResponse(**user_data)


@router.get("/", response_model=List[UserListResponse])
async def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    ユーザー一覧を取得する
    
    Args:
        skip: スキップする件数
        limit: 取得する件数（最大100）
        db: データベースセッション
    
    Returns:
        ユーザー一覧
    """
    users = db.query(User)\
        .filter(User.is_active == True)\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    # 各ユーザーの統計情報を取得
    user_list = []
    for user in users:
        stats = db.query(UserStats).filter(UserStats.user_id == user.id).first()
        user_data = {
            "id": user.id,
            "display_name": user.display_name,
            "profile_image_url": user.profile_image_url,
            "stats": stats
        }
        user_list.append(UserListResponse(**user_data))
    
    return user_list


@router.post("/follow", response_model=FollowResponse)
async def follow_user(
    follow_request: FollowRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """ 
    ユーザーをフォローする
    
    Args:
        follow_request: フォローリクエスト
        current_user: 現在のユーザー
        db: データベースセッション
    
    Returns:
        フォロー情報
    
    Raises:
        HTTPException: 無効なリクエスト時
    """
    # 自分自身をフォローしようとした場合
    if follow_request.following_user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="自分自身をフォローすることはできません"
        )
    
    # フォロー対象のユーザーが存在するかチェック
    target_user = db.query(User).filter(User.id == follow_request.following_user_id).first()
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="フォロー対象のユーザーが見つかりません"
        )
    
    # 既にフォローしているかチェック
    existing_follow = db.query(Follow).filter(
        Follow.follower_user_id == current_user.id,
        Follow.following_user_id == follow_request.following_user_id
    ).first()
    
    if existing_follow:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="既にフォローしています"
        ) 
    
    # フォロー関係を作成
    follow = Follow(
        follower_user_id=current_user.id,
        following_user_id=follow_request.following_user_id
    )
    
    db.add(follow)
    db.commit()
    db.refresh(follow)
    
    return FollowResponse(**follow.__dict__)


@router.delete("/unfollow/{user_id}")
async def unfollow_user(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    ユーザーのフォローを解除する
    
    Args:
        user_id: フォロー解除するユーザーID
        current_user: 現在のユーザー
        db: データベースセッション
    
    Raises:
        HTTPException: フォロー関係が見つからない場合
    """
    follow = db.query(Follow).filter(
        Follow.follower_user_id == current_user.id,
        Follow.following_user_id == user_id
    ).first()
    
    if not follow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="フォロー関係が見つかりません"
        )
    
    db.delete(follow)
    db.commit()
    
    return {"message": "フォローを解除しました"}


@router.get("/{user_id}/followers", response_model=List[UserListResponse])
async def get_user_followers(
    user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    指定したユーザーのフォロワー一覧を取得する
    
    Args:
        user_id: ユーザーID
        skip: スキップする件数
        limit: 取得する件数
        db: データベースセッション
    
    Returns:
        フォロワー一覧
    """
    followers = db.query(User)\
        .join(Follow, User.id == Follow.follower_user_id)\
        .filter(Follow.following_user_id == user_id)\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    follower_list = []
    for user in followers:
        stats = db.query(UserStats).filter(UserStats.user_id == user.id).first()
        user_data = {
            "id": user.id,
            "display_name": user.display_name,
            "profile_image_url": user.profile_image_url,
            "stats": stats
        }
        follower_list.append(UserListResponse(**user_data))
    
    return follower_list


@router.get("/{user_id}/following", response_model=List[UserListResponse])
async def get_user_following(
    user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    指定したユーザーのフォロー中一覧を取得する
    
    Args:
        user_id: ユーザーID
        skip: スキップする件数
        limit: 取得する件数
        db: データベースセッション
    
    Returns:
        フォロー中一覧
    """
    following = db.query(User)\
        .join(Follow, User.id == Follow.following_user_id)\
        .filter(Follow.follower_user_id == user_id)\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    following_list = []
    for user in following:
        stats = db.query(UserStats).filter(UserStats.user_id == user.id).first()
        user_data = {
            "id": user.id,
            "display_name": user.display_name,
            "profile_image_url": user.profile_image_url,
            "stats": stats
        }
        following_list.append(UserListResponse(**user_data))
    
    return following_list
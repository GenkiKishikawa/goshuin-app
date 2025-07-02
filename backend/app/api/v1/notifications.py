"""
通知関連のAPIエンドポイント
"""
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.api.deps import get_db, get_current_active_user
from app.models.user import User, Notification
from app.schemas.user import NotificationResponse

router = APIRouter()


@router.get("/", response_model=List[NotificationResponse])
async def get_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    unread_only: bool = Query(False),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    通知一覧を取得する
    
    Args:
        skip: スキップする件数
        limit: 取得する件数
        unread_only: 未読のみを取得するか
        current_user: 現在のユーザー
        db: データベースセッション
    
    Returns:
        通知一覧
    """
    query = db.query(Notification).filter(Notification.user_id == current_user.id)
    
    if unread_only:
        query = query.filter(Notification.is_read == False)
    
    notifications = query.order_by(desc(Notification.created_at))\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    return [NotificationResponse(**notification.__dict__) for notification in notifications]


@router.put("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_as_read(
    notification_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    通知を既読にする
    
    Args:
        notification_id: 通知ID
        current_user: 現在のユーザー
        db: データベースセッション
    
    Returns:
        更新された通知情報
    
    Raises:
        HTTPException: 通知が見つからない場合や権限がない場合
    """
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="通知が見つかりません"
        )
    
    notification.is_read = True
    notification.read_at = datetime.utcnow()
    
    db.commit()
    db.refresh(notification)
    
    return NotificationResponse(**notification.__dict__)


@router.put("/read-all")
async def mark_all_notifications_as_read(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    すべての通知を既読にする
    
    Args:
        current_user: 現在のユーザー
        db: データベースセッション
    
    Returns:
        処理件数
    """
    updated_count = db.query(Notification)\
        .filter(Notification.user_id == current_user.id)\
        .filter(Notification.is_read == False)\
        .update({
            "is_read": True,
            "read_at": datetime.utcnow()
        })
    
    db.commit()
    
    return {"message": f"{updated_count}件の通知を既読にしました"}


@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    通知を削除する
    
    Args:
        notification_id: 通知ID
        current_user: 現在のユーザー
        db: データベースセッション
    
    Raises:
        HTTPException: 通知が見つからない場合や権限がない場合
    """
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="通知が見つかりません"
        )
    
    db.delete(notification)
    db.commit()
    
    return {"message": "通知を削除しました"}


@router.get("/count", response_model=dict)
async def get_notification_count(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    通知数を取得する
    
    Args:
        current_user: 現在のユーザー
        db: データベースセッション
    
    Returns:
        通知数統計
    """
    total_count = db.query(Notification)\
        .filter(Notification.user_id == current_user.id)\
        .count()
    
    unread_count = db.query(Notification)\
        .filter(Notification.user_id == current_user.id)\
        .filter(Notification.is_read == False)\
        .count()
    
    return {
        "total_count": total_count,
        "unread_count": unread_count
    }
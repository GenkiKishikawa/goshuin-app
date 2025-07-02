"""
ランキング関連のAPIエンドポイント
"""
from typing import List, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, func, and_

from app.api.deps import get_db
from app.models.user import User, UserStats
from app.models.shrine import Shrine
from app.models.post import Post, PostLike
from app.schemas.ranking import (
    UserRankingResponse,
    ShrineRankingResponse,
    RankingPeriod,
    BadgeStats
)

router = APIRouter()


@router.get("/users", response_model=List[UserRankingResponse])
async def get_user_ranking(
    period: str = Query("monthly", regex="^(weekly|monthly|yearly|all_time)$"),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    ユーザーランキングを取得する
    
    Args:
        period: ランキング期間 (weekly, monthly, yearly, all_time)
        limit: 取得件数
        db: データベースセッション
    
    Returns:
        ユーザーランキング一覧
    """
    # 期間の開始日を計算
    now = datetime.utcnow()
    start_date = None
    
    if period == "weekly":
        start_date = now - timedelta(days=7)
    elif period == "monthly":
        start_date = now - timedelta(days=30)
    elif period == "yearly":
        start_date = now - timedelta(days=365)
    # all_timeの場合はstart_date = None（全期間）
    
    # ベーススコア計算のためのクエリ
    if start_date:
        # 期間指定がある場合は期間内の活動をスコア化
        query = db.query(
            User.id,
            User.display_name,
            User.profile_image_url,
            UserStats.post_count,
            UserStats.total_likes_received,
            UserStats.visited_shrine_count,
            UserStats.collected_goshuin_count,
            # 期間内の投稿数
            func.count(Post.id).label("period_posts"),
            # 期間内のいいね数
            func.count(PostLike.id).label("period_likes")
        ).join(UserStats, User.id == UserStats.user_id)\
         .outerjoin(Post, and_(Post.user_id == User.id, Post.created_at >= start_date))\
         .outerjoin(PostLike, and_(PostLike.post_id == Post.id, PostLike.created_at >= start_date))\
         .filter(User.is_active == True)\
         .group_by(
             User.id, User.display_name, User.profile_image_url,
             UserStats.post_count, UserStats.total_likes_received,
             UserStats.visited_shrine_count, UserStats.collected_goshuin_count
         )
    else:
        # 全期間の場合は統計データをそのまま使用
        query = db.query(
            User.id,
            User.display_name, 
            User.profile_image_url,
            UserStats.post_count,
            UserStats.total_likes_received,
            UserStats.visited_shrine_count,
            UserStats.collected_goshuin_count,
            UserStats.post_count.label("period_posts"),
            UserStats.total_likes_received.label("period_likes")
        ).join(UserStats, User.id == UserStats.user_id)\
         .filter(User.is_active == True)
    
    results = query.all()
    
    # スコア計算とランキング作成
    user_scores = []
    for result in results:
        # スコア計算（投稿数 × 10 + いいね数 × 5 + 神社訪問数 × 3 + 御朱印収集数 × 2）
        if start_date:
            score = (result.period_posts * 10 + 
                    result.period_likes * 5 + 
                    result.visited_shrine_count * 3 + 
                    result.collected_goshuin_count * 2)
        else:
            score = (result.post_count * 10 + 
                    result.total_likes_received * 5 + 
                    result.visited_shrine_count * 3 + 
                    result.collected_goshuin_count * 2)
        
        user_scores.append({
            "user_id": result.id,
            "display_name": result.display_name,
            "profile_image_url": result.profile_image_url,
            "post_count": result.post_count,
            "total_likes_received": result.total_likes_received,
            "visited_shrine_count": result.visited_shrine_count,
            "collected_goshuin_count": result.collected_goshuin_count,
            "score": score
        })
    
    # スコアでソート
    user_scores.sort(key=lambda x: x["score"], reverse=True)
    
    # ランキング作成
    ranking = []
    for rank, user_data in enumerate(user_scores[:limit], 1):
        ranking_data = {
            "rank": rank,
            **user_data
        }
        ranking.append(UserRankingResponse(**ranking_data))
    
    return ranking


@router.get("/shrines", response_model=List[ShrineRankingResponse])
async def get_shrine_ranking(
    period: str = Query("monthly", regex="^(weekly|monthly|yearly|all_time)$"),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    神社ランキングを取得する
    
    Args:
        period: ランキング期間 (weekly, monthly, yearly, all_time)
        limit: 取得件数
        db: データベースセッション
    
    Returns:
        神社ランキング一覧
    """
    # 期間の開始日を計算
    now = datetime.utcnow()
    start_date = None
    
    if period == "weekly":
        start_date = now - timedelta(days=7)
    elif period == "monthly":
        start_date = now - timedelta(days=30)
    elif period == "yearly":
        start_date = now - timedelta(days=365)
    
    # 神社ランキングクエリ
    if start_date:
        # 期間内の投稿数でランキング
        query = db.query(
            Shrine.id,
            Shrine.name,
            Shrine.address,
            func.count(Post.id).label("post_count")
        ).outerjoin(Post, and_(Post.shrine_id == Shrine.id, Post.created_at >= start_date))\
         .filter(Shrine.status == "approved")\
         .group_by(Shrine.id, Shrine.name, Shrine.address)\
         .order_by(desc(func.count(Post.id)))
    else:
        # 全期間の投稿数でランキング
        query = db.query(
            Shrine.id,
            Shrine.name,
            Shrine.address,
            func.count(Post.id).label("post_count")
        ).outerjoin(Post, Post.shrine_id == Shrine.id)\
         .filter(Shrine.status == "approved")\
         .group_by(Shrine.id, Shrine.name, Shrine.address)\
         .order_by(desc(func.count(Post.id)))
    
    results = query.limit(limit).all()
    
    # ランキング作成
    ranking = []
    from app.models.shrine import GoshuinType
    
    for rank, result in enumerate(results, 1):
        # 各神社の詳細統計を取得
        visit_count = db.query(func.count(func.distinct(Post.user_id)))\
            .filter(Post.shrine_id == result.id)\
            .scalar() or 0
        
        goshuin_type_count = db.query(GoshuinType)\
            .filter(GoshuinType.shrine_id == result.id)\
            .filter(GoshuinType.status == "approved")\
            .count()
        
        ranking_data = {
            "rank": rank,
            "shrine_id": result.id,
            "name": result.name,
            "address": result.address,
            "post_count": result.post_count or 0,
            "visit_count": visit_count,
            "goshuin_type_count": goshuin_type_count
        }
        ranking.append(ShrineRankingResponse(**ranking_data))
    
    return ranking


@router.get("/badges", response_model=List[BadgeStats])
async def get_badge_stats(
    db: Session = Depends(get_db)
):
    """
    バッジ統計を取得する
    
    Args:
        db: データベースセッション
    
    Returns:
        バッジ統計一覧
    """
    from app.models.user import Badge
    
    # 30日前の日付
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    
    # バッジタイプごとの統計を取得
    badge_types = [
        ("first_post", "初投稿"),
        ("shrine_10", "神社10社"),
        ("shrine_50", "神社50社"),
        ("shrine_100", "神社100社"),
        ("goshuin_10", "御朱印10個"),
        ("goshuin_50", "御朱印50個"),
        ("goshuin_100", "御朱印100個"),
        ("likes_100", "いいね100個"),
        ("likes_500", "いいね500個"),
        ("contributor", "コントリビューター")
    ]
    
    badge_stats = []
    for badge_type, badge_name in badge_types:
        # 全体の授与数
        total_awarded = db.query(Badge)\
            .filter(Badge.badge_type == badge_type)\
            .count()
        
        # 直近30日の授与数
        recent_awarded = db.query(Badge)\
            .filter(Badge.badge_type == badge_type)\
            .filter(Badge.achieved_at >= thirty_days_ago)\
            .count()
        
        badge_stats.append(BadgeStats(
            badge_type=badge_type,
            badge_name=badge_name,
            total_awarded=total_awarded,
            recent_awarded=recent_awarded
        ))
    
    return badge_stats


@router.get("/activity", response_model=dict)
async def get_activity_stats(
    period: str = Query("monthly", regex="^(weekly|monthly|yearly)$"),
    db: Session = Depends(get_db)
):
    """
    アクティビティ統計を取得する
    
    Args:
        period: 統計期間 (weekly, monthly, yearly)
        db: データベースセッション
    
    Returns:
        アクティビティ統計
    """
    # 期間の開始日を計算
    now = datetime.utcnow()
    
    if period == "weekly":
        start_date = now - timedelta(days=7)
    elif period == "monthly":
        start_date = now - timedelta(days=30)
    elif period == "yearly":
        start_date = now - timedelta(days=365)
    
    # 各種統計を取得
    total_posts = db.query(Post)\
        .filter(Post.created_at >= start_date)\
        .count()
    
    total_likes = db.query(PostLike)\
        .filter(PostLike.created_at >= start_date)\
        .count()
    
    active_users = db.query(func.count(func.distinct(Post.user_id)))\
        .filter(Post.created_at >= start_date)\
        .scalar() or 0
    
    new_shrines = db.query(Shrine)\
        .filter(Shrine.created_at >= start_date)\
        .count()
    
    return {
        "period": period,
        "start_date": start_date.isoformat(),
        "end_date": now.isoformat(),
        "total_posts": total_posts,
        "total_likes": total_likes,
        "active_users": active_users,
        "new_shrines": new_shrines
    }
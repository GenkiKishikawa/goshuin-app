"""
データベースモデルのエクスポート
"""
from app.models.user import User, UserAuthProvider, UserStats, Follow, UserBadge, AdminUser, UserRole
from app.models.shrine import Shrine, ShrineImage, GoshuinType, ApprovalStatus
from app.models.post import Post, PostImage, PostShrine, PostGoshuin, PostLike
from app.models.ranking import RankingSnapshot, RankingEntry, RankingType, PeriodType

__all__ = [
    # ユーザー関連
    "User",
    "UserAuthProvider",
    "UserStats",
    "Follow",
    "UserBadge",
    "AdminUser",
    "UserRole",
    # 神社・御朱印関連
    "Shrine",
    "ShrineImage",
    "GoshuinType",
    "ApprovalStatus",
    # 投稿関連
    "Post",
    "PostImage",
    "PostShrine",
    "PostGoshuin",
    "PostLike",
    # ランキング関連
    "RankingSnapshot",
    "RankingEntry",
    "RankingType",
    "PeriodType"
]
"""
Pydanticスキーマのモジュール
"""
from app.schemas.user import (
    UserBase,
    UserCreate,
    UserUpdate,
    UserResponse,
    UserListResponse,
    UserStatsResponse,
    BadgeResponse,
    FollowRequest,
    FollowResponse,
    NotificationResponse
)
from app.schemas.shrine import (
    ShrineBase,
    ShrineCreate,
    ShrineUpdate,
    ShrineResponse,
    ShrineListResponse,
    ShrineImageResponse,
    GoshuinTypeBase,
    GoshuinTypeCreate,
    GoshuinTypeUpdate,
    GoshuinTypeResponse,
    ApprovalRequest
)
from app.schemas.post import (
    PostBase,
    PostCreate,
    PostUpdate,
    PostResponse,
    PostListResponse,
    PostImageResponse,
    PostLikeResponse,
    PostCommentResponse,
    CommentCreate,
    LikeRequest
)
from app.schemas.ranking import (
    UserRankingResponse,
    ShrineRankingResponse,
    RankingPeriod,
    BadgeStats
)

__all__ = [
    # User schemas
    "UserBase",
    "UserCreate", 
    "UserUpdate",
    "UserResponse",
    "UserListResponse",
    "UserStatsResponse",
    "BadgeResponse",
    "FollowRequest",
    "FollowResponse",
    "NotificationResponse",
    
    # Shrine schemas
    "ShrineBase",
    "ShrineCreate",
    "ShrineUpdate", 
    "ShrineResponse",
    "ShrineListResponse",
    "ShrineImageResponse",
    "GoshuinTypeBase",
    "GoshuinTypeCreate",
    "GoshuinTypeUpdate",
    "GoshuinTypeResponse",
    "ApprovalRequest",
    
    # Post schemas
    "PostBase",
    "PostCreate",
    "PostUpdate",
    "PostResponse", 
    "PostListResponse",
    "PostImageResponse",
    "PostLikeResponse",
    "PostCommentResponse",
    "CommentCreate",
    "LikeRequest",
    
    # Ranking schemas
    "UserRankingResponse",
    "ShrineRankingResponse",
    "RankingPeriod",
    "BadgeStats"
]
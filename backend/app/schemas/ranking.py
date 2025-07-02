"""
ランキング関連のPydanticスキーマ
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class UserRankingResponse(BaseModel):
    """ユーザーランキングレスポンススキーマ"""
    rank: int
    user_id: int
    display_name: str
    profile_image_url: Optional[str]
    score: int
    post_count: int
    total_likes_received: int
    visited_shrine_count: int
    collected_goshuin_count: int
    
    class Config:
        from_attributes = True


class ShrineRankingResponse(BaseModel):
    """神社ランキングレスポンススキーマ"""
    rank: int
    shrine_id: int
    name: str
    address: Optional[str]
    post_count: int
    visit_count: int
    goshuin_type_count: int
    
    class Config:
        from_attributes = True


class RankingPeriod(BaseModel):
    """ランキング期間スキーマ"""
    period: str  # 'weekly', 'monthly', 'yearly', 'all_time'
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class BadgeStats(BaseModel):
    """バッジ統計スキーマ"""
    badge_type: str
    badge_name: str
    total_awarded: int
    recent_awarded: int  # 直近30日での授与数
    
    class Config:
        from_attributes = True
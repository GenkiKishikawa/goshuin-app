"""
ランキング関連のデータベースモデル
"""
from sqlalchemy import Column, String, Integer, ForeignKey, Date, Enum
from sqlalchemy.orm import relationship
import enum

from app.db.base import Base


class RankingType(str, enum.Enum):
    """ランキング種別"""
    VISITED_SHRINES = "visited_shrines"
    COLLECTED_GOSHUIN = "collected_goshuin"
    REGISTERED_SHRINES = "registered_shrines"
    REGISTERED_GOSHUIN = "registered_goshuin"
    TOTAL_LIKES = "total_likes"


class PeriodType(str, enum.Enum):
    """期間種別"""
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"
    ALL_TIME = "all_time"


class RankingSnapshot(Base):
    """ランキングスナップショット"""
    __tablename__ = "ranking_snapshots"
    
    id = Column(Integer, primary_key=True, index=True)
    ranking_type = Column(Enum(RankingType), nullable=False, index=True)
    period_type = Column(Enum(PeriodType), nullable=False, index=True)
    period_start = Column(Date, nullable=False, index=True)
    period_end = Column(Date, nullable=False)
    
    # リレーション
    entries = relationship("RankingEntry", back_populates="snapshot")


class RankingEntry(Base):
    """ランキングエントリー"""
    __tablename__ = "ranking_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    snapshot_id = Column(Integer, ForeignKey("ranking_snapshots.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    rank = Column(Integer, nullable=False)
    score = Column(Integer, nullable=False)
    
    # リレーション
    snapshot = relationship("RankingSnapshot", back_populates="entries")
    user = relationship("User")
"""
神社・御朱印関連のデータベースモデル
"""
from sqlalchemy import Column, String, Integer, Boolean, Text, ForeignKey, TIMESTAMP, Enum, Numeric, Date
import enum

from app.db.base import Base
from sqlalchemy.orm import relationship


class ApprovalStatus(str, enum.Enum):
    """承認ステータス"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class Shrine(Base):
    """神社モデル"""
    __tablename__ = "shrines"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    name_kana = Column(String(255))
    description = Column(Text)
    address = Column(Text)
    latitude = Column(Numeric(10, 8))
    longitude = Column(Numeric(11, 8))
    phone = Column(String(20))
    website_url = Column(Text)
    created_by_user_id = Column(Integer, ForeignKey("users.id"))
    status = Column(Enum(ApprovalStatus), default=ApprovalStatus.PENDING, index=True)
    approved_at = Column(TIMESTAMP)
    approved_by_user_id = Column(Integer, ForeignKey("users.id"))
    
    # リレーション
    created_by = relationship("User", foreign_keys=[created_by_user_id])
    approved_by = relationship("User", foreign_keys=[approved_by_user_id])
    images = relationship("ShrineImage", back_populates="shrine")
    goshuin_types = relationship("GoshuinType", back_populates="shrine")
    posts = relationship("PostShrine", back_populates="shrine")


class ShrineImage(Base):
    """神社画像"""
    __tablename__ = "shrine_images"
    
    id = Column(Integer, primary_key=True, index=True)
    shrine_id = Column(Integer, ForeignKey("shrines.id"), nullable=False, index=True)
    image_url = Column(Text, nullable=False)
    is_primary = Column(Boolean, default=False)
    uploaded_by_user_id = Column(Integer, ForeignKey("users.id"))
    
    # リレーション
    shrine = relationship("Shrine", back_populates="images")
    uploaded_by = relationship("User")


class GoshuinType(Base):
    """御朱印種別"""
    __tablename__ = "goshuin_types"
    
    id = Column(Integer, primary_key=True, index=True)
    shrine_id = Column(Integer, ForeignKey("shrines.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(Integer)
    is_limited = Column(Boolean, default=False)
    available_from = Column(Date)
    available_to = Column(Date)
    created_by_user_id = Column(Integer, ForeignKey("users.id"))
    status = Column(Enum(ApprovalStatus), default=ApprovalStatus.PENDING, index=True)
    approved_at = Column(TIMESTAMP)
    approved_by_user_id = Column(Integer, ForeignKey("users.id"))
    
    # リレーション
    shrine = relationship("Shrine", back_populates="goshuin_types")
    created_by = relationship("User", foreign_keys=[created_by_user_id])
    approved_by = relationship("User", foreign_keys=[approved_by_user_id])
    post_goshuin = relationship("PostGoshuin", back_populates="goshuin_type")
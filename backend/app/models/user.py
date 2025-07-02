"""
ユーザー関連のデータベースモデル
"""
from sqlalchemy import Column, String, Integer, Boolean, Text, ForeignKey, TIMESTAMP, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum

from app.db.base import Base


class UserRole(str, enum.Enum):
    """ユーザーロールの定義"""
    USER = "user"
    MODERATOR = "moderator"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"


class User(Base):
    """ユーザーモデル"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    uid = Column(String(255), unique=True, nullable=False, index=True)  # Supabase Auth UID
    email = Column(String(255), unique=True, index=True)
    display_name = Column(String(100), nullable=False)
    profile_image_url = Column(Text)
    bio = Column(Text)
    is_active = Column(Boolean, default=True)
    
    # リレーション
    auth_providers = relationship("UserAuthProvider", back_populates="user")
    stats = relationship("UserStats", back_populates="user", uselist=False)
    posts = relationship("Post", back_populates="user")
    badges = relationship("UserBadge", back_populates="user")
    
    # フォロー関係（自己参照）
    followers = relationship(
        "Follow",
        foreign_keys="Follow.following_user_id",
        back_populates="following_user"
    )
    following = relationship(
        "Follow",
        foreign_keys="Follow.follower_user_id",
        back_populates="follower_user"
    )


class UserAuthProvider(Base):
    """認証プロバイダー情報"""
    __tablename__ = "user_auth_providers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider = Column(String(50), nullable=False)  # google, twitter等
    provider_user_id = Column(String(255), nullable=False)
    
    # リレーション
    user = relationship("User", back_populates="auth_providers")
    
    # 複合ユニークインデックス
    __table_args__ = (
        {"schema": "public"}
    )


class UserStats(Base):
    """ユーザー統計情報"""
    __tablename__ = "user_stats"
    
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    post_count = Column(Integer, default=0)
    total_likes_received = Column(Integer, default=0)
    visited_shrine_count = Column(Integer, default=0)
    collected_goshuin_count = Column(Integer, default=0)
    registered_shrine_count = Column(Integer, default=0)
    registered_goshuin_count = Column(Integer, default=0)
    follower_count = Column(Integer, default=0)
    following_count = Column(Integer, default=0)
    
    # リレーション
    user = relationship("User", back_populates="stats")


class Follow(Base):
    """フォロー関係"""
    __tablename__ = "follows"
    
    follower_user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    following_user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    
    # リレーション
    follower_user = relationship("User", foreign_keys=[follower_user_id])
    following_user = relationship("User", foreign_keys=[following_user_id])


class UserBadge(Base):
    """ユーザーバッジ"""
    __tablename__ = "user_badges"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    badge_type = Column(String(50), nullable=False)
    achieved_at = Column(TIMESTAMP, nullable=False)
    
    # リレーション
    user = relationship("User", back_populates="badges")
    
    # 複合ユニークインデックス
    __table_args__ = (
        {"schema": "public"}
    )


class AdminUser(Base):
    """管理者権限"""
    __tablename__ = "admin_users"
    
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    role = Column(Enum(UserRole), nullable=False)
    granted_at = Column(TIMESTAMP, nullable=False)
    granted_by_user_id = Column(Integer, ForeignKey("users.id"))
    
    # リレーション
    user = relationship("User", foreign_keys=[user_id])
    granted_by = relationship("User", foreign_keys=[granted_by_user_id])
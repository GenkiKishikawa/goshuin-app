"""
投稿関連のデータベースモデル
"""
from sqlalchemy import Column, String, Integer, Boolean, Text, ForeignKey, TIMESTAMP, Date
from sqlalchemy.orm import relationship

from app.db.base import Base


class Post(Base):
    """投稿モデル"""
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    content = Column(Text)
    visit_date = Column(Date, index=True)
    is_published = Column(Boolean, default=True)
    
    # リレーション
    user = relationship("User", back_populates="posts")
    images = relationship("PostImage", back_populates="post")
    shrines = relationship("PostShrine", back_populates="post")
    goshuin = relationship("PostGoshuin", back_populates="post")
    likes = relationship("PostLike", back_populates="post")


class PostImage(Base):
    """投稿画像"""
    __tablename__ = "post_images"
    
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False, index=True)
    image_url = Column(Text, nullable=False)
    display_order = Column(Integer, default=0)
    
    # リレーション
    post = relationship("Post", back_populates="images")


class PostShrine(Base):
    """投稿-神社紐付け"""
    __tablename__ = "post_shrines"
    
    post_id = Column(Integer, ForeignKey("posts.id"), primary_key=True)
    shrine_id = Column(Integer, ForeignKey("shrines.id"), primary_key=True)
    
    # リレーション
    post = relationship("Post", back_populates="shrines")
    shrine = relationship("Shrine", back_populates="posts")


class PostGoshuin(Base):
    """投稿-御朱印紐付け"""
    __tablename__ = "post_goshuin"
    
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False, index=True)
    goshuin_type_id = Column(Integer, ForeignKey("goshuin_types.id"), nullable=False, index=True)
    image_url = Column(Text)
    received_date = Column(Date)
    
    # リレーション
    post = relationship("Post", back_populates="goshuin")
    goshuin_type = relationship("GoshuinType", back_populates="post_goshuin")


class PostLike(Base):
    """いいね"""
    __tablename__ = "post_likes"
    
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    post_id = Column(Integer, ForeignKey("posts.id"), primary_key=True)
    
    # リレーション
    user = relationship("User")
    post = relationship("Post", back_populates="likes")
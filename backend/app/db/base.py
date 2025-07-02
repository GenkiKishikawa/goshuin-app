"""
データベースベースクラスの定義

SQLAlchemyのベースクラスと共通のカラムを定義
"""
from datetime import datetime
from sqlalchemy import Column, DateTime
from sqlalchemy.ext.declarative import as_declarative, declared_attr


@as_declarative()
class Base:
    """
    すべてのモデルの基底クラス
    
    テーブル名の自動生成とタイムスタンプフィールドを提供
    """
    id: any
    __name__: str
    
    @declared_attr
    def __tablename__(cls) -> str:
        """テーブル名をクラス名から自動生成（スネークケース）"""
        return cls.__name__.lower()
    
    # タイムスタンプフィールド
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
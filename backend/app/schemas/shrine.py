"""
神社・御朱印関連のPydanticスキーマ
"""
from typing import List, Optional
from datetime import datetime, date
from decimal import Decimal
from pydantic import BaseModel

from app.models.shrine import ApprovalStatus


class ShrineBase(BaseModel):
    """神社の基本情報スキーマ"""
    name: str
    name_kana: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    phone: Optional[str] = None
    website_url: Optional[str] = None


class ShrineCreate(ShrineBase):
    """神社作成スキーマ"""
    pass


class ShrineUpdate(BaseModel):
    """神社更新スキーマ"""
    name: Optional[str] = None
    name_kana: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    phone: Optional[str] = None
    website_url: Optional[str] = None


class ShrineImageResponse(BaseModel):
    """神社画像レスポンススキーマ"""
    id: int
    image_url: str
    is_primary: bool
    
    class Config:
        from_attributes = True


class GoshuinTypeResponse(BaseModel):
    """御朱印種別レスポンススキーマ"""
    id: int
    name: str
    description: Optional[str]
    price: Optional[int]
    is_limited: bool
    available_from: Optional[date]
    available_to: Optional[date]
    status: ApprovalStatus
    
    class Config:
        from_attributes = True


class ShrineResponse(ShrineBase):
    """神社レスポンススキーマ"""
    id: int
    status: ApprovalStatus
    created_at: datetime
    updated_at: datetime
    approved_at: Optional[datetime]
    images: List[ShrineImageResponse] = []
    goshuin_types: List[GoshuinTypeResponse] = []
    
    class Config:
        from_attributes = True


class ShrineListResponse(BaseModel):
    """神社一覧レスポンススキーマ"""
    id: int
    name: str
    address: Optional[str]
    latitude: Optional[Decimal]
    longitude: Optional[Decimal]
    status: ApprovalStatus
    goshuin_count: int = 0
    
    class Config:
        from_attributes = True


class GoshuinTypeBase(BaseModel):
    """御朱印種別の基本情報スキーマ"""
    name: str
    description: Optional[str] = None
    price: Optional[int] = None
    is_limited: bool = False
    available_from: Optional[date] = None
    available_to: Optional[date] = None


class GoshuinTypeCreate(GoshuinTypeBase):
    """御朱印種別作成スキーマ"""
    shrine_id: int


class GoshuinTypeUpdate(BaseModel):
    """御朱印種別更新スキーマ"""
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    is_limited: Optional[bool] = None
    available_from: Optional[date] = None
    available_to: Optional[date] = None


class ApprovalRequest(BaseModel):
    """承認リクエストスキーマ"""
    status: ApprovalStatus
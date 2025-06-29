from typing import List
from datetime import datetime
from fastapi import APIRouter, Query
from pydantic import BaseModel

router = APIRouter()


class Goshuin(BaseModel):
    id: str
    temple_id: str
    temple_name: str
    name: str
    description: str
    image_url: str
    received_date: datetime | None
    is_received: bool
    user_count: int


class GoshuinCreate(BaseModel):
    temple_id: str
    name: str
    description: str
    image_url: str


class GoshuinReceive(BaseModel):
    received_date: datetime


class GoshuinResponse(BaseModel):
    goshuin: List[Goshuin]
    total: int
    page: int
    per_page: int


@router.get("/", response_model=GoshuinResponse)
async def get_goshuin_list(
    temple_id: str | None = None,
    user_id: str | None = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100)
):
    """御朱印一覧を取得"""
    # TODO: 検索条件に基づいて御朱印を取得
    mock_goshuin = [
        Goshuin(
            id=f"goshuin_{i}",
            temple_id="temple_1",
            temple_name="浅草寺",
            name=f"御朱印 {i}",
            description="浅草寺の御朱印です",
            image_url=f"/images/goshuin_{i}.jpg",
            received_date=datetime.now() if i % 2 == 0 else None,
            is_received=i % 2 == 0,
            user_count=50 + i * 10
        )
        for i in range(1, 6)
    ]
    
    return GoshuinResponse(
        goshuin=mock_goshuin,
        total=50,
        page=page,
        per_page=per_page
    )


@router.post("/", response_model=Goshuin)
async def create_goshuin(goshuin_data: GoshuinCreate):
    """新規御朱印を登録"""
    # TODO: 御朱印の登録処理
    return Goshuin(
        id="new_goshuin_1",
        temple_id=goshuin_data.temple_id,
        temple_name="浅草寺",
        name=goshuin_data.name,
        description=goshuin_data.description,
        image_url=goshuin_data.image_url,
        received_date=None,
        is_received=False,
        user_count=0
    )


@router.get("/{goshuin_id}", response_model=Goshuin)
async def get_goshuin_detail(goshuin_id: str):
    """指定された御朱印の詳細を取得"""
    # TODO: 御朱印の詳細取得
    return Goshuin(
        id=goshuin_id,
        temple_id="temple_1",
        temple_name="浅草寺",
        name="観音様御朱印",
        description="浅草寺の観音様の御朱印です。特別な日にのみいただけます。",
        image_url="/images/goshuin_special.jpg",
        received_date=datetime.now(),
        is_received=True,
        user_count=150
    )


@router.post("/{goshuin_id}/receive", response_model=Goshuin)
async def receive_goshuin(goshuin_id: str, receive_data: GoshuinReceive):
    """御朱印を受領済みにする"""
    # TODO: 受領処理の実装
    return Goshuin(
        id=goshuin_id,
        temple_id="temple_1",
        temple_name="浅草寺",
        name="観音様御朱印",
        description="浅草寺の観音様の御朱印です。",
        image_url="/images/goshuin_special.jpg",
        received_date=receive_data.received_date,
        is_received=True,
        user_count=151
    )


@router.delete("/{goshuin_id}/receive")
async def cancel_receive_goshuin(goshuin_id: str):
    """御朱印の受領を取り消す"""
    # TODO: 受領取り消し処理の実装
    return {"message": f"御朱印 {goshuin_id} の受領を取り消しました"}
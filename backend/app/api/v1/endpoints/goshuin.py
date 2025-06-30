from typing import List
from datetime import datetime
from fastapi import APIRouter, Query
from pydantic import BaseModel

# 御朱印関連のAPIエンドポイントを定義するルーター
router = APIRouter()


class Goshuin(BaseModel):
    """御朱印情報のレスポンスモデル"""
    id: str
    temple_id: str
    temple_name: str
    name: str
    description: str
    image_url: str
    received_date: datetime | None  # ユーザーが受領した日付
    is_received: bool  # 現在のユーザーが受領済みかどうか
    user_count: int  # この御朱印を受領したユーザー数


class GoshuinCreate(BaseModel):
    """御朱印登録時のリクエストボディ"""
    temple_id: str
    name: str
    description: str
    image_url: str


class GoshuinReceive(BaseModel):
    """御朱印受領登録時のリクエストボディ"""
    received_date: datetime


class GoshuinResponse(BaseModel):
    """御朱印一覧のページネーション付きレスポンスモデル"""
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
    """
    御朱印一覧を取得
    
    神社・寺院やユーザーでフィルタリングして御朱印一覧を取得する。
    ユーザーIDを指定した場合は、そのユーザーが受領した御朱印のみ表示。
    
    Args:
        temple_id: 特定の神社・寺院の御朱印のみフィルタリング
        user_id: 特定のユーザーが受領した御朱印のみフィルタリング
        page: ページ番号（1から開始）
        per_page: 1ページあたりの件数（1-100）
        
    Returns:
        GoshuinResponse: 御朱印一覧とページネーション情報
    """
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
    """
    新規御朱印を登録
    
    神社・寺院に新しい御朱印情報を登録する。
    他のユーザーも同じ御朱印を受領登録できるようになる。
    
    Args:
        goshuin_data: 御朱印の詳細情報
        
    Returns:
        Goshuin: 登録された御朱印情報
    """
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
    """
    指定された御朱印の詳細を取得
    
    御朱印IDを元に詳細情報を取得する。
    現在のユーザーの受領状態も含めて返却する。
    
    Args:
        goshuin_id: 取得対象の御朱印ID
        
    Returns:
        Goshuin: 御朱印の詳細情報
    """
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
    """
    御朱印を受領済みにする
    
    現在のユーザーが指定した御朱印を受領したことを登録する。
    受領日付を記録し、コレクションに追加される。
    
    Args:
        goshuin_id: 受領登録する御朱印ID
        receive_data: 受領日付情報
        
    Returns:
        Goshuin: 更新後の御朱印情報
    """
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
    """
    御朱印の受領を取り消す
    
    現在のユーザーが登録した御朱印の受領を取り消す。
    コレクションから削除され、受領数が1つ減る。
    
    Args:
        goshuin_id: 受領取り消し対象の御朱印ID
        
    Returns:
        dict: 受領取り消し完了メッセージ
    """
    # TODO: 受領取り消し処理の実装
    return {"message": f"御朱印 {goshuin_id} の受領を取り消しました"}
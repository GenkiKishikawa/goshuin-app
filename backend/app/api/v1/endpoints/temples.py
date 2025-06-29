from typing import List
from fastapi import APIRouter, Query
from pydantic import BaseModel

router = APIRouter()


class Temple(BaseModel):
    id: str
    name: str
    address: str
    prefecture: str
    city: str
    latitude: float
    longitude: float
    description: str
    image_url: str | None
    goshuin_count: int


class TempleCreate(BaseModel):
    name: str
    address: str
    prefecture: str
    city: str
    latitude: float
    longitude: float
    description: str
    image_url: str | None = None


class TemplesResponse(BaseModel):
    temples: List[Temple]
    total: int
    page: int
    per_page: int


@router.get("/", response_model=TemplesResponse)
async def get_temples(
    prefecture: str | None = None,
    search: str | None = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100)
):
    """神社・寺院一覧を取得"""
    # TODO: データベースから検索条件に基づいて取得
    mock_temples = [
        Temple(
            id="temple_1",
            name="浅草寺",
            address="東京都台東区浅草2-3-1",
            prefecture="東京都",
            city="台東区",
            latitude=35.7147,
            longitude=139.7967,
            description="東京都内最古の寺",
            image_url="/images/sensoji.jpg",
            goshuin_count=150
        ),
        Temple(
            id="temple_2",
            name="明治神宮",
            address="東京都渋谷区代々木神園町1-1",
            prefecture="東京都",
            city="渋谷区",
            latitude=35.6764,
            longitude=139.6993,
            description="明治天皇を祀る神社",
            image_url="/images/meijijingu.jpg",
            goshuin_count=200
        )
    ]
    
    return TemplesResponse(
        temples=mock_temples,
        total=100,
        page=page,
        per_page=per_page
    )


@router.post("/", response_model=Temple)
async def create_temple(temple_data: TempleCreate):
    """新規神社・寺院を登録"""
    # TODO: 神社・寺院の登録処理
    return Temple(
        id="new_temple_1",
        name=temple_data.name,
        address=temple_data.address,
        prefecture=temple_data.prefecture,
        city=temple_data.city,
        latitude=temple_data.latitude,
        longitude=temple_data.longitude,
        description=temple_data.description,
        image_url=temple_data.image_url,
        goshuin_count=0
    )


@router.get("/{temple_id}", response_model=Temple)
async def get_temple(temple_id: str):
    """指定された神社・寺院の詳細を取得"""
    # TODO: 詳細情報の取得
    return Temple(
        id=temple_id,
        name="浅草寺",
        address="東京都台東区浅草2-3-1",
        prefecture="東京都",
        city="台東区",
        latitude=35.7147,
        longitude=139.7967,
        description="東京都内最古の寺。雷門で有名。",
        image_url="/images/sensoji.jpg",
        goshuin_count=150
    )


@router.get("/nearby", response_model=List[Temple])
async def get_nearby_temples(
    lat: float = Query(..., description="緯度"),
    lng: float = Query(..., description="経度"),
    radius: float = Query(5.0, description="検索半径(km)")
):
    """指定座標から近い神社・寺院を取得"""
    # TODO: 位置情報ベースの検索実装
    return [
        Temple(
            id="temple_1",
            name="浅草寺",
            address="東京都台東区浅草2-3-1",
            prefecture="東京都",
            city="台東区",
            latitude=35.7147,
            longitude=139.7967,
            description="東京都内最古の寺",
            image_url="/images/sensoji.jpg",
            goshuin_count=150
        )
    ]
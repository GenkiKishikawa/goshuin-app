from typing import List
from fastapi import APIRouter, Query
from pydantic import BaseModel

# 神社・寺院関連のAPIエンドポイントを定義するルーター
router = APIRouter()


class Temple(BaseModel):
    """神社・寺院情報のレスポンスモデル"""
    id: str
    name: str
    address: str
    prefecture: str
    city: str
    latitude: float
    longitude: float
    description: str
    image_url: str | None
    goshuin_count: int  # この神社・寺院の御朱印登録数


class TempleCreate(BaseModel):
    """神社・寺院登録時のリクエストボディ"""
    name: str
    address: str
    prefecture: str
    city: str
    latitude: float
    longitude: float
    description: str
    image_url: str | None = None


class TemplesResponse(BaseModel):
    """神社・寺院一覧のページネーション付きレスポンスモデル"""
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
    """
    神社・寺院一覧を取得
    
    都道府県やキーワードで絞り込み検索が可能。
    ページネーションをサポートしている。
    
    Args:
        prefecture: 都道府県名でフィルタリング
        search: 名前や説明を検索するキーワード
        page: ページ番号（1から開始）
        per_page: 1ページあたりの件数（1-100）
        
    Returns:
        TemplesResponse: 神社・寺院一覧とページネーション情報
    """
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
    """
    新規神社・寺院を登録
    
    ユーザーが新しい神社・寺院をデータベースに登録する。
    位置情報（緯度・経度）も保存され、近くの神社検索で使用される。
    
    Args:
        temple_data: 神社・寺院の詳細情報
        
    Returns:
        Temple: 登録された神社・寺院情報
    """
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
    """
    指定された神社・寺院の詳細を取得
    
    神社・寺院IDを元に詳細情報を取得する。
    御朱印登録数などの統計情報も含まれる。
    
    Args:
        temple_id: 取得対象の神社・寺院ID
        
    Returns:
        Temple: 神社・寺院の詳細情報
    """
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
    """
    指定座標から近い神社・寺院を取得
    
    ユーザーの現在位置または指定地点から近い神社・寺院を検索する。
    PostGISを使用して効率的に距離計算を行う予定。
    
    Args:
        lat: 検索中心の緯度
        lng: 検索中心の経度
        radius: 検索半径（キロメートル、デフォルト5km）
        
    Returns:
        List[Temple]: 指定範囲内の神社・寺院リスト
    """
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
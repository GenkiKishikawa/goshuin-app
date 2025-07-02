"""
神社・御朱印関連のAPIエンドポイント
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.api.deps import (
    get_db,
    get_current_user,
    get_current_active_user,
    get_current_admin_user,
    get_optional_current_user
)
from app.models.shrine import Shrine, GoshuinType, ShrineImage, ApprovalStatus
from app.schemas.shrine import (
    ShrineCreate,
    ShrineUpdate,
    ShrineResponse,
    ShrineListResponse,
    GoshuinTypeCreate,
    GoshuinTypeUpdate,
    GoshuinTypeResponse,
    ApprovalRequest
)

router = APIRouter()


@router.get("/", response_model=List[ShrineListResponse])
async def get_shrines(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[ApprovalStatus] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    神社一覧を取得する
    
    Args:
        skip: スキップする件数
        limit: 取得する件数
        status: 承認状態でフィルタ
        search: 検索キーワード（神社名・住所）
        db: データベースセッション
    
    Returns:
        神社一覧
    """
    query = db.query(Shrine)
    
    # 承認状態でフィルタ（指定されていない場合は承認済みのみ）
    if status:
        query = query.filter(Shrine.status == status)
    else:
        query = query.filter(Shrine.status == ApprovalStatus.APPROVED)
    
    # 検索キーワードでフィルタ
    if search:
        query = query.filter(
            (Shrine.name.contains(search)) | 
            (Shrine.address.contains(search))
        )
    
    shrines = query.offset(skip).limit(limit).all()
    
    # 各神社の御朱印数を計算
    shrine_list = []
    for shrine in shrines:
        goshuin_count = db.query(GoshuinType)\
            .filter(GoshuinType.shrine_id == shrine.id)\
            .filter(GoshuinType.status == ApprovalStatus.APPROVED)\
            .count()
        
        shrine_data = {
            **shrine.__dict__,
            "goshuin_count": goshuin_count
        }
        shrine_list.append(ShrineListResponse(**shrine_data))
    
    return shrine_list


@router.get("/{shrine_id}", response_model=ShrineResponse)
async def get_shrine(
    shrine_id: int,
    db: Session = Depends(get_db)
):
    """
    神社詳細を取得する
    
    Args:
        shrine_id: 神社ID
        db: データベースセッション
    
    Returns:
        神社詳細情報
    
    Raises:
        HTTPException: 神社が見つからない場合
    """
    shrine = db.query(Shrine).filter(Shrine.id == shrine_id).first()
    if not shrine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="神社が見つかりません"
        )
    
    # 関連する画像と御朱印種別を取得
    images = db.query(ShrineImage).filter(ShrineImage.shrine_id == shrine.id).all()
    goshuin_types = db.query(GoshuinType)\
        .filter(GoshuinType.shrine_id == shrine.id)\
        .filter(GoshuinType.status == ApprovalStatus.APPROVED)\
        .all()
    
    shrine_data = {
        **shrine.__dict__,
        "images": images,
        "goshuin_types": goshuin_types
    }
    
    return ShrineResponse(**shrine_data)


@router.post("/", response_model=ShrineResponse)
async def create_shrine(
    shrine_create: ShrineCreate,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    新しい神社を登録する（承認待ち状態）
    
    Args:
        shrine_create: 神社作成データ
        current_user: 現在のユーザー
        db: データベースセッション
    
    Returns:
        作成された神社情報
    """
    shrine = Shrine(
        **shrine_create.dict(),
        submitted_by=current_user.id,
        status=ApprovalStatus.PENDING
    )
    
    db.add(shrine)
    db.commit()
    db.refresh(shrine)
    
    return ShrineResponse(**shrine.__dict__)


@router.put("/{shrine_id}", response_model=ShrineResponse)
async def update_shrine(
    shrine_id: int,
    shrine_update: ShrineUpdate,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    神社情報を更新する（管理者のみ）
    
    Args:
        shrine_id: 神社ID
        shrine_update: 更新データ
        current_user: 現在のユーザー（管理者）
        db: データベースセッション
    
    Returns:
        更新された神社情報
    
    Raises:
        HTTPException: 神社が見つからない場合
    """
    shrine = db.query(Shrine).filter(Shrine.id == shrine_id).first()
    if not shrine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="神社が見つかりません"
        )
    
    # 更新可能なフィールドのみを更新
    update_data = shrine_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(shrine, field, value)
    
    db.commit()
    db.refresh(shrine)
    
    return ShrineResponse(**shrine.__dict__)


@router.put("/{shrine_id}/approval", response_model=ShrineResponse)
async def update_shrine_approval(
    shrine_id: int,
    approval: ApprovalRequest,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    神社の承認状態を更新する（管理者のみ）
    
    Args:
        shrine_id: 神社ID
        approval: 承認リクエスト
        current_user: 現在のユーザー（管理者）
        db: データベースセッション
    
    Returns:
        更新された神社情報
    
    Raises:
        HTTPException: 神社が見つからない場合
    """
    shrine = db.query(Shrine).filter(Shrine.id == shrine_id).first()
    if not shrine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="神社が見つかりません"
        )
    
    shrine.status = approval.status
    shrine.approved_by = current_user.id if approval.status == ApprovalStatus.APPROVED else None
    
    db.commit()
    db.refresh(shrine)
    
    return ShrineResponse(**shrine.__dict__)


@router.get("/{shrine_id}/goshuin-types", response_model=List[GoshuinTypeResponse])
async def get_goshuin_types(
    shrine_id: int,
    status: Optional[ApprovalStatus] = Query(None),
    db: Session = Depends(get_db)
):
    """
    神社の御朱印種別一覧を取得する
    
    Args:
        shrine_id: 神社ID
        status: 承認状態でフィルタ
        db: データベースセッション
    
    Returns:
        御朱印種別一覧
    """
    query = db.query(GoshuinType).filter(GoshuinType.shrine_id == shrine_id)
    
    # 承認状態でフィルタ（指定されていない場合は承認済みのみ）
    if status:
        query = query.filter(GoshuinType.status == status)
    else:
        query = query.filter(GoshuinType.status == ApprovalStatus.APPROVED)
    
    goshuin_types = query.all()
    return [GoshuinTypeResponse(**gt.__dict__) for gt in goshuin_types]


@router.post("/{shrine_id}/goshuin-types", response_model=GoshuinTypeResponse)
async def create_goshuin_type(
    shrine_id: int,
    goshuin_create: GoshuinTypeCreate,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    御朱印種別を登録する（承認待ち状態）
    
    Args:
        shrine_id: 神社ID
        goshuin_create: 御朱印種別作成データ
        current_user: 現在のユーザー
        db: データベースセッション
    
    Returns:
        作成された御朱印種別情報
    
    Raises:
        HTTPException: 神社が見つからない場合
    """
    # 神社の存在確認
    shrine = db.query(Shrine).filter(Shrine.id == shrine_id).first()
    if not shrine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="神社が見つかりません"
        )
    
    goshuin_type = GoshuinType(
        **goshuin_create.dict(),
        shrine_id=shrine_id,
        submitted_by=current_user.id,
        status=ApprovalStatus.PENDING
    )
    
    db.add(goshuin_type)
    db.commit()
    db.refresh(goshuin_type)
    
    return GoshuinTypeResponse(**goshuin_type.__dict__)


@router.put("/goshuin-types/{goshuin_type_id}", response_model=GoshuinTypeResponse)
async def update_goshuin_type(
    goshuin_type_id: int,
    goshuin_update: GoshuinTypeUpdate,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    御朱印種別を更新する（管理者のみ）
    
    Args:
        goshuin_type_id: 御朱印種別ID
        goshuin_update: 更新データ
        current_user: 現在のユーザー（管理者）
        db: データベースセッション
    
    Returns:
        更新された御朱印種別情報
    
    Raises:
        HTTPException: 御朱印種別が見つからない場合
    """
    goshuin_type = db.query(GoshuinType).filter(GoshuinType.id == goshuin_type_id).first()
    if not goshuin_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="御朱印種別が見つかりません"
        )
    
    # 更新可能なフィールドのみを更新
    update_data = goshuin_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(goshuin_type, field, value)
    
    db.commit()
    db.refresh(goshuin_type)
    
    return GoshuinTypeResponse(**goshuin_type.__dict__)


@router.put("/goshuin-types/{goshuin_type_id}/approval", response_model=GoshuinTypeResponse)
async def update_goshuin_type_approval(
    goshuin_type_id: int,
    approval: ApprovalRequest,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    御朱印種別の承認状態を更新する（管理者のみ）
    
    Args:
        goshuin_type_id: 御朱印種別ID
        approval: 承認リクエスト
        current_user: 現在のユーザー（管理者）
        db: データベースセッション
    
    Returns:
        更新された御朱印種別情報
    
    Raises:
        HTTPException: 御朱印種別が見つからない場合
    """
    goshuin_type = db.query(GoshuinType).filter(GoshuinType.id == goshuin_type_id).first()
    if not goshuin_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="御朱印種別が見つかりません"
        )
    
    goshuin_type.status = approval.status
    goshuin_type.approved_by = current_user.id if approval.status == ApprovalStatus.APPROVED else None
    
    db.commit()
    db.refresh(goshuin_type)
    
    return GoshuinTypeResponse(**goshuin_type.__dict__)
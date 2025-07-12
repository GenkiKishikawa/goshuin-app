from fastapi import APIRouter, Depends, HTTPException
from app.core.dependencies import require_admin, require_moderator
from app.services.supabase import supabase_client
from pydantic import BaseModel
from typing import Dict, Optional
from datetime import datetime

router = APIRouter(prefix="/api/admin", tags=["admin"])

class UpdateUserRoleRequest(BaseModel):
    user_id: str
    new_role_id: int

@router.get("/stats", dependencies=[Depends(require_admin)])
async def get_stats(current_user: Dict = Depends(require_admin)):
    """統計情報を取得（管理者のみ）"""
    # 各種統計情報を取得
    stats = {
        "total_users": supabase_client.table("users").select("id", count="exact").execute().count,
        "total_posts": supabase_client.table("posts").select("id", count="exact").execute().count,
        "total_shrines": supabase_client.table("shrines").select("id", count="exact").execute().count,
        "total_goshuin": supabase_client.table("goshuin_types").select("id", count="exact").execute().count
    }
    
    return stats

@router.put("/users/{user_id}/role", dependencies=[Depends(require_admin)])
async def update_user_role(
    user_id: str,
    request: UpdateUserRoleRequest,
    current_user: Dict = Depends(require_admin)
):
    """ユーザーのロールを更新（管理者のみ）"""
    # ロールの存在確認
    role = supabase_client.table("roles").select("*").eq("id", request.new_role_id).single().execute()
    
    if not role.data:
        raise HTTPException(status_code=404, detail="Role not found")
    
    # ユーザーのロール更新
    update_response = supabase_client.table("users").update({
        "role_id": request.new_role_id
    }).eq("id", user_id).execute()
    
    if not update_response.data:
        raise HTTPException(status_code=404, detail="User not found")
    
    # 監査ログに記録
    supabase_client.table("audit_logs").insert({
        "user_id": current_user["id"],
        "action": "update_user_role",
        "table_name": "users",
        "record_id": user_id,
        "new_data": {"role_id": request.new_role_id, "role_name": role.data["name"]}
    }).execute()
    
    return {"success": True, "message": "User role updated"}

@router.get("/pending-approvals", dependencies=[Depends(require_moderator)])
async def get_pending_approvals(current_user: Dict = Depends(require_moderator)):
    """承認待ちのコンテンツを取得（モデレーター以上）"""
    # 承認待ちの神社
    pending_shrines = supabase_client.table("shrines").select(
        "id, name, created_at, created_by_user_id"
    ).eq("status", "pending").execute()
    
    # 承認待ちの御朱印
    pending_goshuin = supabase_client.table("goshuin_types").select(
        "id, name, shrine_id, created_at, created_by_user_id"
    ).eq("status", "pending").execute()
    
    return {
        "pending_shrines": pending_shrines.data,
        "pending_goshuin": pending_goshuin.data
    }

@router.post("/approve/{resource_type}/{resource_id}", dependencies=[Depends(require_permission("approve_content"))])
async def approve_resource(
    resource_type: str,
    resource_id: str,
    current_user: Dict = Depends(require_moderator)
):
    """リソースを承認（approve_content権限必須）"""
    if resource_type not in ["shrine", "goshuin_type"]:
        raise HTTPException(status_code=400, detail="Invalid resource type")
    
    table_name = "shrines" if resource_type == "shrine" else "goshuin_types"
    
    # 承認処理
    supabase_client.table(table_name).update({
        "status": "approved",
        "approved_at": datetime.now().isoformat(),
        "approved_by_user_id": current_user["id"]
    }).eq("id", resource_id).execute()
    
    # 監査ログ
    supabase_client.table("audit_logs").insert({
        "user_id": current_user["id"],
        "action": f"approve_{resource_type}",
        "table_name": table_name,
        "record_id": resource_id
    }).execute()
    
    return {"success": True, "message": f"{resource_type} approved"}
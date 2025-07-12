from fastapi import APIRouter, Depends
from app.core.dependencies import allow_anonymous
from app.services.supabase import supabase_client
from typing import Dict, Optional

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.get("/me")
async def get_me(current_user: Optional[Dict] = Depends(allow_anonymous)):
    """現在のユーザー情報を取得（匿名ユーザーも可）"""
    if not current_user.get("is_authenticated", False):
        return {
            "authenticated": False,
            "role": "anonymous",
            "message": "Not authenticated",
        }

    # 連携プロバイダー情報を取得
    providers = (
        supabase_client.table("user_providers")
        .select("provider")
        .eq("user_id", current_user["id"])
        .execute()
    )

    current_user["linked_providers"] = [p["provider"] for p in providers.data]

    return UserDetail(**current_user)


@router.get("/verify")
async def verify_session(current_user: Optional[Dict] = Depends(allow_anonymous)):
    """セッションの有効性を確認"""
    return {
        "authenticated": current_user.get("is_authenticated", False),
        "user_id": current_user.get("id"),
        "role": current_user.get("role", "anonymous"),
        "role_level": current_user.get("role_level", 0),
    }

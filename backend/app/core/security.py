from typing import Optional, Dict, List
from fastapi import HTTPException, Depends, Header
from app.services.supabase import supabase_client
from app.models.role import RoleName, ROLE_LEVELS


async def verify_token(authorization: Optional[str] = Header(None)) -> Dict:
    """
    Supabaseが発行したトークンを検証
    （FastAPIは認証を行わない、検証のみ）
    
    Args:
        authorization: HTTPヘッダーのAuthorizationフィールド
    
    Returns:
        ユーザー情報
    """
    if not authorization:
        # トークンがない = 匿名ユーザー
        return {
            "id": None,
            "role": RoleName.ANONYMOUS,
            "role_level": ROLE_LEVELS[RoleName.ANONYMOUS],
            "is_authenticated": False
        }
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.replace("Bearer ", "")

    try:
        # Supabaseに問い合わせてトークンの有効性を検証
        user_response = supabase_client.auth.get_user(token)
        if not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid token")      

        # ユーザーを取得
        user_response = supabase_client.table("users").select("role").eq(
            "user_id", user_response.user.id
        ).single().execute()

        user = user_response.data

        # ユーザーロールを取得
        role_response = supabase_client.table("roles").select("*").eq(
            "id", user["role_id"]
        ).single().execute()
        
        role = role_response.data
        
        return {
            "id": user.id,
            "email": user.email,
            "role": role["name"],
            "role_level": ROLE_LEVELS.get(role["name"], 0),
            "is_authenticated": True
        }
        
    except Exception as e:
        raise HTTPException(status_code=401, detail="Token verification failed")
    

def check_role_level(user_role_level: int, required_level: int) -> bool:
    """ロールレベルをチェック"""
    return user_role_level >= required_level


def check_permission(user_permissions: Dict, permission: str) -> bool:
    """特定の権限をチェック"""
    if user_permissions.get("all") is True:
        return True
    return user_permissions.get(permission, False) is True
from typing import Optional, Dict, List
from fastapi import Depends, HTTPException, Header
from app.core.security import verify_token, check_role_level, check_permission
from app.models.role import RoleName, ROLE_LEVELS


def require_auth(min_role: RoleName = RoleName.USER):
    """
    認証と最小ロールレベルを要求するデペンデンシー
    """
    async def dependency(
        current_user: Optional[Dict] = Depends(verify_token)
    ) -> Dict:
        if not current_user:
            raise HTTPException(status_code=401, detail="Authentication required")
        
        # 認証されていない場合
        if not current_user.get("is_authenticated", False):
            if min_role != RoleName.ANONYMOUS:
                raise HTTPException(status_code=401, detail="Authentication required")
        
        # アクティブでないユーザーはブロック
        if current_user.get("id") and not current_user.get("is_active", True):
            raise HTTPException(status_code=403, detail="Account is deactivated")
        
        # ロールレベルチェック
        required_level = ROLE_LEVELS[min_role]
        user_level = current_user.get("role_level", 0)
        
        if not check_role_level(user_level, required_level):
            raise HTTPException(
                status_code=403, 
                detail=f"Insufficient permissions. Required role: {min_role}"
            )
        
        return current_user
    
    return dependency

def require_permission(permission: str):
    """
    特定の権限を要求するデペンデンシー
    """
    async def dependency(
        current_user: Dict = Depends(verify_token)
    ) -> Dict:
        if not current_user or not current_user.get("is_authenticated", False):
            raise HTTPException(status_code=401, detail="Authentication required")
        
        user_permissions = current_user.get("role_permissions", {})
        
        if not check_permission(user_permissions, permission):
            raise HTTPException(
                status_code=403,
                detail=f"Missing required permission: {permission}"
            )
        
        return current_user
    
    return dependency

# 便利なエイリアス
allow_anonymous = require_auth(RoleName.ANONYMOUS)
require_user = require_auth(RoleName.USER)
require_premium = require_auth(RoleName.PREMIUM_USER)
require_moderator = require_auth(RoleName.MODERATOR)
require_admin = require_auth(RoleName.ADMIN)
require_super_admin = require_auth(RoleName.SUPER_ADMIN)
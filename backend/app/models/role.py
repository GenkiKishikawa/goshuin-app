from enum import Enum
from pydantic import BaseModel
from typing import Dict, Any


class RoleName(str, Enum):
    ANONYMOUS = "anonymous"
    USER = "user"
    PREMIUM_USER = "premium_user"
    MODERATOR = "moderator"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"


class Role(BaseModel):
    id: int
    name: RoleName
    description: str
    level: int
    permissions: Dict[str, Any]
    is_active: bool


# ロールレベルの定義（ハードコードされた値として保持）
ROLE_LEVELS = {
    RoleName.ANONYMOUS: 0,
    RoleName.USER: 10,
    RoleName.PREMIUM_USER: 20,
    RoleName.MODERATOR: 30,
    RoleName.ADMIN: 40,
    RoleName.SUPER_ADMIN: 50,
}

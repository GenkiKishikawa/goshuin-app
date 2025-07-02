"""
API v1 ����
"""
from fastapi import APIRouter
from app.api.v1 import users, shrines, posts, rankings, notifications

api_router = APIRouter()

# ���ݤ�Ȓ{2
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(shrines.router, prefix="/shrines", tags=["shrines"])  
api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
api_router.include_router(rankings.router, prefix="/rankings", tags=["rankings"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
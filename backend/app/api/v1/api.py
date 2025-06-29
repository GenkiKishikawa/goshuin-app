from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, posts, temples, goshuin

api_router = APIRouter()

# 各エンドポイントのルーターを登録
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
api_router.include_router(temples.router, prefix="/temples", tags=["temples"])
api_router.include_router(goshuin.router, prefix="/goshuin", tags=["goshuin"])
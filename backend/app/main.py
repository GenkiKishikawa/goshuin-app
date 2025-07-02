from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1 import api_router


def create_application() -> FastAPI:
    """
    FastAPIアプリケーションの初期化と設定
    
    FastAPIインスタンスを作成し、必要なミドルウェアや
    ルーターを登録して返却する。
    
    Returns:
        FastAPI: 設定済みのFastAPIアプリケーションインスタンス
    """
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json"
    )
    
    # CORS設定 - フロントエンドからのAPIアクセスを許可
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.FRONTEND_URL],  # 許可するオリジン
        allow_credentials=True,  # Cookieを含むリクエストを許可
        allow_methods=["*"],  # 全てのHTTPメソッドを許可
        allow_headers=["*"],  # 全てのヘッダーを許可
    )
    
    # APIルーターの登録 - v1 APIの全エンドポイントを登録
    app.include_router(api_router, prefix=settings.API_V1_STR)
    
    return app


# FastAPIアプリケーションのインスタンスを作成
app = create_application()


@app.get("/")
async def root():
    """
    ルートエンドポイント - APIの基本情報を返却
    
    APIの稼働確認やバージョン情報、
    ドキュメントのURLを提供する。
    
    Returns:
        dict: API情報（メッセージ、バージョン、ドキュメントURL）
    """
    return {
        "message": "わたしの御朱印 API",
        "version": settings.VERSION,
        "docs": f"{settings.API_V1_STR}/docs"
    }
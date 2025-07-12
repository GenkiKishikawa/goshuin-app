from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
from app.core.config import settings
from app.services.supabase import supabase_client


app = FastAPI(title="goshuin-app-api", version="0.1.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ルーター登録
app.include_router(auth.router)
app.include_router(admin.router)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/debug/connection")
def debug_connection():
    try:
        # テーブル一覧を取得
        response = supabase_client.table("users").select("*").execute()
        return {
            "status": "connected",
            "data_count": len(response.data),
            "raw_response": response
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }
from fastapi import FastAPI
from supabase import create_client, Client
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
from app.core.config import settings

load_dotenv()

app = FastAPI()

supabase: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_ANON_KEY
)

class User(BaseModel):
    id: str
    name: str
    created_at: str

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/users", response_model=List[User])
def get_users():
    try:
        response = supabase.table("users").select("*").execute()
        return response.data
    except Exception as e:
        raise e


@app.get("/debug/connection")
def debug_connection():
    try:
        # テーブル一覧を取得
        response = supabase.table("users").select("*").execute()
        return {
            "status": "connected",
            "data_count": len(response.data),
            "raw_response": response.data
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }
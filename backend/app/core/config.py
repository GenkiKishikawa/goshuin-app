from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    ##  supabase_service_key: str
    ##  stripe_secret_key: str
    ##  stripe_webhook_secret: str

    class Config:
        env_file = ".env"


settings = Settings()

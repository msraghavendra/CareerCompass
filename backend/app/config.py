import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Application Config
    APP_NAME: str = "Career Compass API"
    DEBUG: bool = True
    
    # AI Provider (gemini or openai)
    AI_PROVIDER: str = "gemini"
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    
    # Firebase Service Account (path to json file or JSON string)
    FIREBASE_CREDENTIALS: str = ""

    class Config:
        env_file = ".env"

settings = Settings()

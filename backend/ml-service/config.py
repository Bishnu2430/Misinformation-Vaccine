import os
from pathlib import Path

class Settings:
    """Application settings"""
    
    # Project paths
    BASE_DIR = Path(__file__).resolve().parent.parent.parent
    MODEL_DIR = BASE_DIR / "models" / "distilbert_final"
    
    # API settings
    API_TITLE = "Misinformation-Vaccine ML API"
    API_VERSION = "1.0.0"
    API_DESCRIPTION = "Fake News Detection API using DistilBERT"
    
    # Model settings
    MAX_TEXT_LENGTH = 512
    MIN_TEXT_LENGTH = 50
    
    # CORS settings (for frontend later)
    CORS_ORIGINS = [
        "http://localhost:3000",  # React default
        "http://localhost:5173",  # Vite default
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]

settings = Settings()
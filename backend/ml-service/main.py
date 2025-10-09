from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import time

from config import settings
from schemas import (
    TextPredictRequest, 
    URLPredictRequest, 
    PredictResponse, 
    ErrorResponse,
    HealthResponse
)
from model import model_instance

# Lifespan event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load model
    print("🚀 Starting Misinformation-Vaccine ML API...")
    model_instance.load_model()
    yield
    # Shutdown
    print("👋 Shutting down Misinformation-Vaccine ML API...")

# Create FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description=settings.API_DESCRIPTION,
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "message": "Misinformation-Vaccine ML API",
        "version": settings.API_VERSION,
        "endpoints": {
            "health": "/health",
            "predict_text": "/api/predict/text",
            "predict_url": "/api/predict/url",
            "docs": "/docs"
        }
    }

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model_instance.loaded,
        "version": settings.API_VERSION
    }

@app.post("/api/predict/text", response_model=PredictResponse, tags=["Prediction"])
async def predict_text(request: TextPredictRequest):
    """
    Predict if provided text is fake or true news
    
    - **text**: Article text (minimum 50 words)
    - **title**: Optional article title
    """
    start_time = time.time()
    
    try:
        result = model_instance.analyze_text(request.text, request.title)
        
        if not result['success']:
            raise HTTPException(
                status_code=400,
                detail={
                    "success": False,
                    "error": result['error'],
                    "stage": result.get('stage')
                }
            )
        
        processing_time = time.time() - start_time
        
        return {
            **result,
            "message": f"Processed in {processing_time:.2f}s"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": str(e),
                "stage": "prediction"
            }
        )

@app.post("/api/predict/url", response_model=PredictResponse, tags=["Prediction"])
async def predict_url(request: URLPredictRequest):
    """
    Scrape article from URL and predict if it's fake or true news
    
    - **url**: Article URL to analyze
    """
    start_time = time.time()
    
    try:
        result = model_instance.analyze_url(str(request.url))
        
        if not result['success']:
            raise HTTPException(
                status_code=400,
                detail={
                    "success": False,
                    "error": result['error'],
                    "stage": result.get('stage')
                }
            )
        
        processing_time = time.time() - start_time
        
        return {
            **result,
            "message": f"Processed in {processing_time:.2f}s"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": str(e),
                "stage": result.get('stage', 'unknown')
            }
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
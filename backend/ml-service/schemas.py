from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, List

# Request Models
class TextPredictRequest(BaseModel):
    """Request model for text prediction"""
    text: str = Field(..., min_length=50, description="Article text (minimum 50 characters)")
    title: Optional[str] = Field(None, description="Article title (optional)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "WASHINGTON (Reuters) - The Senate voted today to pass the infrastructure bill...",
                "title": "Senate Passes Infrastructure Bill"
            }
        }

class URLPredictRequest(BaseModel):
    """Request model for URL scraping and prediction"""
    url: HttpUrl = Field(..., description="Article URL to scrape and analyze")
    
    class Config:
        json_schema_extra = {
            "example": {
                "url": "https://www.reuters.com/world/us/senate-passes-bill-2024/"
            }
        }

# Response Models
class PredictionResult(BaseModel):
    """Prediction results"""
    prediction: str = Field(..., description="FAKE or TRUE")
    prediction_label: int = Field(..., description="0=FAKE, 1=TRUE")
    confidence: float = Field(..., description="Confidence percentage")
    probabilities: dict = Field(..., description="Probability breakdown")

class ArticleInfo(BaseModel):
    """Article metadata"""
    title: str
    url: Optional[str] = None
    source: Optional[str] = None
    authors: Optional[List[str]] = None
    publish_date: Optional[str] = None
    word_count: int

class PredictResponse(BaseModel):
    """Complete prediction response"""
    success: bool
    article: ArticleInfo
    prediction: PredictionResult
    message: Optional[str] = None

class ErrorResponse(BaseModel):
    """Error response"""
    success: bool = False
    error: str
    stage: Optional[str] = None
    message: Optional[str] = None

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    model_loaded: bool
    version: str
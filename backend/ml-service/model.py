import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
from config import settings
import sys
import os

# Add scraper to path
sys.path.append(os.path.join(os.path.dirname(__file__), '../scraper'))
from scraper import scrape_article

class FakeNewsModel:
    """DistilBERT model handler for fake news detection"""
    
    def __init__(self):
        self.tokenizer = None
        self.model = None
        self.device = None
        self.loaded = False
    
    def load_model(self):
        """Load the DistilBERT model"""
        try:
            print(f"Loading model from: {settings.MODEL_DIR}")
            
            self.tokenizer = DistilBertTokenizer.from_pretrained(str(settings.MODEL_DIR))
            self.model = DistilBertForSequenceClassification.from_pretrained(str(settings.MODEL_DIR))
            
            # Set device
            self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
            self.model.to(self.device)
            self.model.eval()
            
            self.loaded = True
            print(f"✅ Model loaded successfully on {self.device}")
            
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            raise
    
    def predict(self, text: str) -> dict:
        """
        Predict if text is fake or true news
        
        Args:
            text (str): Article text
            
        Returns:
            dict: Prediction results
        """
        if not self.loaded:
            raise RuntimeError("Model not loaded")
        
        # Tokenize
        inputs = self.tokenizer(
            text,
            truncation=True,
            padding=True,
            max_length=settings.MAX_TEXT_LENGTH,
            return_tensors='pt'
        )
        
        # Move to device
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        
        # Predict
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            probs = torch.softmax(logits, dim=-1)
            prediction = torch.argmax(probs, dim=-1).item()
        
        return {
            'prediction': 'TRUE' if prediction == 1 else 'FAKE',
            'prediction_label': prediction,
            'confidence': float(probs[0][prediction].item() * 100),
            'probabilities': {
                'fake': float(probs[0][0].item() * 100),
                'true': float(probs[0][1].item() * 100)
            }
        }
    
    def analyze_text(self, text: str, title: str = None) -> dict:
        """
        Analyze raw text
        
        Args:
            text (str): Article text
            title (str): Optional title
            
        Returns:
            dict: Complete analysis
        """
        # Validate length
        word_count = len(text.split())
        if word_count < settings.MIN_TEXT_LENGTH:
            return {
                'success': False,
                'error': f'Text too short. Minimum {settings.MIN_TEXT_LENGTH} words required.',
                'stage': 'validation'
            }
        
        # Predict
        prediction_result = self.predict(text)
        
        return {
            'success': True,
            'article': {
                'title': title or 'User provided text',
                'word_count': word_count
            },
            'prediction': prediction_result
        }
    
    def analyze_url(self, url: str) -> dict:
        """
        Scrape URL and analyze
        
        Args:
            url (str): Article URL
            
        Returns:
            dict: Complete analysis
        """
        # Scrape
        scrape_result = scrape_article(url)
        
        if not scrape_result['success']:
            return {
                'success': False,
                'error': scrape_result['error'],
                'stage': 'scraping'
            }
        
        article_data = scrape_result['data']
        
        # Validate
        if article_data['word_count'] < settings.MIN_TEXT_LENGTH:
            return {
                'success': False,
                'error': f'Article too short. Minimum {settings.MIN_TEXT_LENGTH} words required.',
                'stage': 'validation'
            }
        
        # Predict
        prediction_result = self.predict(article_data['text'])
        
        return {
            'success': True,
            'article': {
                'title': article_data['title'],
                'url': url,
                'source': article_data['source_domain'],
                'authors': article_data['authors'],
                'publish_date': article_data['publish_date'],
                'word_count': article_data['word_count']
            },
            'prediction': prediction_result
        }

# Global model instance
model_instance = FakeNewsModel()
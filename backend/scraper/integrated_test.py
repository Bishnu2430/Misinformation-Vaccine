import sys
import os

# Add paths for importing
sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))

import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
from scraper import scrape_article

class FakeNewsDetector:
    """
    Integrated system: Web Scraping + ML Prediction
    """
    
    def __init__(self, model_path):
        """
        Initialize the detector with DistilBERT model
        
        Args:
            model_path (str): Path to the trained model directory
        """
        print("Loading model...")
        self.tokenizer = DistilBertTokenizer.from_pretrained(model_path)
        self.model = DistilBertForSequenceClassification.from_pretrained(model_path)
        
        # Set to evaluation mode
        self.model.eval()
        
        # Check device
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)
        
        print(f"✅ Model loaded on {self.device}")
    
    def predict(self, text):
        """
        Predict if text is fake or true news
        
        Args:
            text (str): Article text
            
        Returns:
            dict: Prediction results
        """
        # Tokenize
        inputs = self.tokenizer(
            text,
            truncation=True,
            padding=True,
            max_length=512,
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
        
        # Format results
        return {
            'prediction': 'TRUE' if prediction == 1 else 'FAKE',
            'prediction_label': prediction,
            'confidence': probs[0][prediction].item() * 100,
            'probabilities': {
                'fake': probs[0][0].item() * 100,
                'true': probs[0][1].item() * 100
            }
        }
    
    def analyze_url(self, url):
        """
        Complete pipeline: Scrape URL and predict
        
        Args:
            url (str): Article URL
            
        Returns:
            dict: Complete analysis results
        """
        print(f"\n🔍 Step 1: Scraping article from URL...")
        
        # Scrape article
        scrape_result = scrape_article(url)
        
        if not scrape_result['success']:
            return {
                'success': False,
                'error': scrape_result['error'],
                'stage': 'scraping'
            }
        
        article_data = scrape_result['data']
        print(f"✅ Article scraped successfully!")
        print(f"   Title: {article_data['title'][:60]}...")
        print(f"   Source: {article_data['source_domain']}")
        print(f"   Word count: {article_data['word_count']}")
        
        # Check if article is long enough
        if article_data['word_count'] < 50:
            return {
                'success': False,
                'error': 'Article too short for reliable prediction (minimum 50 words)',
                'stage': 'validation'
            }
        
        print(f"\n🤖 Step 2: Running AI prediction...")
        
        # Run prediction
        prediction_result = self.predict(article_data['text'])
        
        print(f"✅ Prediction complete!")
        
        # Combine results
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
    
    def analyze_text(self, text, title=None):
        """
        Analyze raw text (no URL)
        
        Args:
            text (str): Article text
            title (str): Optional title
            
        Returns:
            dict: Analysis results
        """
        print(f"\n🤖 Analyzing provided text...")
        
        # Check length
        word_count = len(text.split())
        if word_count < 50:
            return {
                'success': False,
                'error': 'Text too short for reliable prediction (minimum 50 words)',
                'stage': 'validation'
            }
        
        # Run prediction
        prediction_result = self.predict(text)
        
        print(f"✅ Prediction complete!")
        
        return {
            'success': True,
            'article': {
                'title': title or 'User provided text',
                'word_count': word_count
            },
            'prediction': prediction_result
        }


def print_results(result):
    """
    Pretty print the analysis results
    """
    print("\n" + "="*70)
    print("📊 ANALYSIS RESULTS")
    print("="*70)
    
    if not result['success']:
        print(f"\n❌ Analysis Failed")
        print(f"Stage: {result.get('stage', 'unknown')}")
        print(f"Error: {result['error']}")
        return
    
    # Article info
    article = result['article']
    print(f"\n📰 Article Information:")
    print(f"   Title: {article['title']}")
    if 'url' in article:
        print(f"   URL: {article['url']}")
        print(f"   Source: {article['source']}")
    if 'authors' in article and article['authors']:
        print(f"   Authors: {', '.join(article['authors'])}")
    if 'publish_date' in article and article['publish_date']:
        print(f"   Published: {article['publish_date']}")
    print(f"   Word Count: {article['word_count']}")
    
    # Prediction
    prediction = result['prediction']
    print(f"\n🎯 Prediction: {prediction['prediction']}")
    print(f"   Confidence: {prediction['confidence']:.2f}%")
    
    print(f"\n📈 Probability Breakdown:")
    print(f"   Fake News: {prediction['probabilities']['fake']:.2f}%")
    print(f"   True News: {prediction['probabilities']['true']:.2f}%")
    
    # Visual indicator
    if prediction['prediction'] == 'FAKE':
        indicator = "🚨 " * 10
        color = "RED"
    else:
        indicator = "✅ " * 10
        color = "GREEN"
    
    print(f"\n{indicator}")
    print(f"   This article is predicted as: {color} - {prediction['prediction']}")
    print(f"{indicator}")
    
    print("="*70)


def main():
    """
    Main interactive test function
    """
    # Initialize detector
    model_path = '../../models/distilbert_final'
    
    print("="*70)
    print("🔍 TRUTHLENS - FAKE NEWS DETECTOR")
    print("   Integrated Test: Web Scraper + ML Model")
    print("="*70)
    
    try:
        detector = FakeNewsDetector(model_path)
    except Exception as e:
        print(f"\n❌ Error loading model: {e}")
        print(f"\nMake sure the model is at: {model_path}")
        return
    
    print("\n" + "="*70)
    print("Choose input method:")
    print("  1. Analyze article from URL")
    print("  2. Analyze text directly")
    print("  3. Quick test with sample URLs")
    print("="*70)
    
    choice = input("\nEnter choice (1/2/3): ").strip()
    
    if choice == '1':
        # URL input
        print("\nPaste article URL:")
        url = input().strip()
        
        if not url:
            print("❌ No URL provided")
            return
        
        result = detector.analyze_url(url)
        print_results(result)
    
    elif choice == '2':
        # Text input
        print("\nPaste article title (optional, press Enter to skip):")
        title = input().strip()
        
        print("\nPaste article text:")
        text = input().strip()
        
        if not text:
            print("❌ No text provided")
            return
        
        result = detector.analyze_text(text, title or None)
        print_results(result)
    
    elif choice == '3':
        # Quick test with sample URLs
        test_urls = [
            "https://www.reuters.com/world/us/trump-says-he-is-not-planning-fire-federal-reserve-chair-powell-2024-11-07/",
            "https://www.bbc.com/news/world-us-canada-56004868"
        ]
        
        for url in test_urls:
            print(f"\n{'='*70}")
            print(f"Testing URL: {url}")
            print('='*70)
            
            result = detector.analyze_url(url)
            print_results(result)
            
            print("\nContinue to next test? (y/n): ")
            cont = input().strip().lower()
            if cont != 'y':
                break
    
    else:
        print("❌ Invalid choice")


if __name__ == '__main__':
    main()
import requests
from newspaper import Article
from bs4 import BeautifulSoup
from datetime import datetime
import re
from urllib.parse import urlparse

class ArticleScraper:
    """
    Web scraper for extracting article content from URLs
    """
    
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    
    def scrape_article(self, url):
        """
        Main method to scrape article from URL
        
        Args:
            url (str): Article URL
            
        Returns:
            dict: Article data including title, text, author, date, etc.
        """
        try:
            # Validate URL
            if not self._is_valid_url(url):
                return {
                    'success': False,
                    'error': 'Invalid URL format'
                }
            
            # Try newspaper3k first (best for news articles)
            article_data = self._scrape_with_newspaper(url)
            
            if article_data['success']:
                return article_data
            
            # Fallback to BeautifulSoup if newspaper fails
            article_data = self._scrape_with_bs4(url)
            
            return article_data
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Scraping failed: {str(e)}'
            }
    
    def _scrape_with_newspaper(self, url):
        """Scrape using newspaper3k library"""
        try:
            article = Article(url)
            article.download()
            article.parse()
            
            # Try to extract publish date
            try:
                article.nlp()
            except:
                pass
            
            # Extract domain
            domain = urlparse(url).netloc
            domain = domain.replace('www.', '')
            
            # Check if we got meaningful content
            if len(article.text) < 100:
                return {
                    'success': False,
                    'error': 'Article too short or extraction failed'
                }
            
            return {
                'success': True,
                'data': {
                    'title': article.title or 'No title found',
                    'text': article.text,
                    'authors': article.authors,
                    'publish_date': str(article.publish_date) if article.publish_date else None,
                    'url': url,
                    'source_domain': domain,
                    'top_image': article.top_image,
                    'word_count': len(article.text.split()),
                    'extraction_method': 'newspaper3k'
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Newspaper3k failed: {str(e)}'
            }
    
    def _scrape_with_bs4(self, url):
        """Fallback scraper using BeautifulSoup"""
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'lxml')
            
            # Extract title
            title = self._extract_title(soup)
            
            # Extract article text
            text = self._extract_text(soup)
            
            # Extract domain
            domain = urlparse(url).netloc.replace('www.', '')
            
            if len(text) < 100:
                return {
                    'success': False,
                    'error': 'Could not extract meaningful content'
                }
            
            return {
                'success': True,
                'data': {
                    'title': title,
                    'text': text,
                    'authors': [],
                    'publish_date': None,
                    'url': url,
                    'source_domain': domain,
                    'top_image': None,
                    'word_count': len(text.split()),
                    'extraction_method': 'beautifulsoup4'
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'BeautifulSoup failed: {str(e)}'
            }
    
    def _extract_title(self, soup):
        """Extract article title from HTML"""
        # Try multiple methods
        title = None
        
        # Method 1: og:title meta tag
        og_title = soup.find('meta', property='og:title')
        if og_title and og_title.get('content'):
            title = og_title['content']
        
        # Method 2: <title> tag
        if not title:
            title_tag = soup.find('title')
            if title_tag:
                title = title_tag.get_text()
        
        # Method 3: h1 tag
        if not title:
            h1 = soup.find('h1')
            if h1:
                title = h1.get_text()
        
        # Clean title
        if title:
            title = title.strip()
            # Remove site name (often after | or -)
            title = re.split(r'\s+[-|]\s+', title)[0]
        
        return title or 'No title found'
    
    def _extract_text(self, soup):
        """Extract article text from HTML"""
        # Remove script and style elements
        for script in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
            script.decompose()
        
        # Try to find article content
        article_tags = [
            soup.find('article'),
            soup.find('div', class_=re.compile('article|content|post-body|entry-content', re.I)),
            soup.find('div', id=re.compile('article|content|post-body', re.I))
        ]
        
        article_content = None
        for tag in article_tags:
            if tag:
                article_content = tag
                break
        
        # If no article tag found, use body
        if not article_content:
            article_content = soup.find('body')
        
        if not article_content:
            return ''
        
        # Extract paragraphs
        paragraphs = article_content.find_all('p')
        text = '\n\n'.join([p.get_text().strip() for p in paragraphs if len(p.get_text().strip()) > 50])
        
        # Clean text
        text = re.sub(r'\n\s*\n', '\n\n', text)
        text = text.strip()
        
        return text
    
    def _is_valid_url(self, url):
        """Validate URL format"""
        try:
            result = urlparse(url)
            return all([result.scheme, result.netloc])
        except:
            return False


# Helper function for easy import
def scrape_article(url):
    """
    Simple function to scrape an article
    
    Args:
        url (str): Article URL
        
    Returns:
        dict: Scraped article data
    """
    scraper = ArticleScraper()
    return scraper.scrape_article(url)


if __name__ == '__main__':
    # Test the scraper
    print("="*60)
    print("ARTICLE SCRAPER TEST")
    print("="*60)
    
    # Test URLs
    test_urls = [
        'https://www.reuters.com/world/us/trump-says-he-is-not-planning-fire-federal-reserve-chair-powell-2024-11-07/',
        'https://www.bbc.com/news/world-us-canada-56004868',
        'https://apnews.com/article/biden-economy-inflation-jobs-8e3d3e3f4f3e4e3e3e3e3e3e3e3e3e3e'
    ]
    
    for url in test_urls:
        print(f"\nTesting: {url}")
        result = scrape_article(url)
        
        if result['success']:
            data = result['data']
            print(f"✅ Success!")
            print(f"  Title: {data['title'][:80]}...")
            print(f"  Source: {data['source_domain']}")
            print(f"  Word Count: {data['word_count']}")
            print(f"  Method: {data['extraction_method']}")
            print(f"  Text preview: {data['text'][:200]}...")
        else:
            print(f"❌ Failed: {result['error']}")
        
        print("-"*60)
from scraper import scrape_article

def test_scraper():
    """
    Interactive scraper testing
    """
    print("="*60)
    print("ARTICLE SCRAPER - INTERACTIVE TEST")
    print("="*60)
    print("\nPaste article URL (or 'quit' to exit):\n")
    
    url = input().strip()
    
    if url.lower() == 'quit':
        return
    
    print(f"\n🔍 Scraping: {url}\n")
    
    result = scrape_article(url)
    
    if result['success']:
        data = result['data']
        
        print("="*60)
        print("✅ SCRAPING SUCCESSFUL")
        print("="*60)
        print(f"\n📰 Title: {data['title']}")
        print(f"🌐 Source: {data['source_domain']}")
        print(f"📅 Published: {data['publish_date'] or 'Unknown'}")
        print(f"✍️  Authors: {', '.join(data['authors']) if data['authors'] else 'Unknown'}")
        print(f"📊 Word Count: {data['word_count']}")
        print(f"🔧 Method: {data['extraction_method']}")
        
        print(f"\n📄 Article Text (first 500 chars):")
        print("-"*60)
        print(data['text'][:500] + "...")
        print("-"*60)
        
        print(f"\n💾 Full text available: {len(data['text'])} characters")
        
    else:
        print("="*60)
        print("❌ SCRAPING FAILED")
        print("="*60)
        print(f"Error: {result['error']}")
    
    print("\n" + "="*60)

if __name__ == '__main__':
    while True:
        test_scraper()
        print("\n\nTest another URL? (y/n): ")
        choice = input().strip().lower()
        if choice != 'y':
            break
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Articles table (stores scraped articles)
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    url TEXT UNIQUE,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    source_domain VARCHAR(255),
    authors TEXT[],
    publish_date TIMESTAMP,
    word_count INTEGER,
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analysis history table
CREATE TABLE analysis_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    
    -- Input
    input_type VARCHAR(10) CHECK (input_type IN ('url', 'text')),
    input_url TEXT,
    input_text TEXT,
    
    -- Prediction results
    prediction VARCHAR(10) CHECK (prediction IN ('FAKE', 'TRUE')),
    confidence DECIMAL(5,2),
    probability_fake DECIMAL(5,2),
    probability_true DECIMAL(5,2),
    
    -- Metadata
    processing_time_ms INTEGER,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- User feedback (optional)
    user_vote VARCHAR(10) CHECK (user_vote IN ('agree', 'disagree', NULL)),
    user_feedback TEXT
);

-- User votes table (for community features)
CREATE TABLE article_votes (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    vote VARCHAR(10) CHECK (vote IN ('fake', 'true')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(article_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_articles_url ON articles(url);
CREATE INDEX idx_articles_source ON articles(source_domain);
CREATE INDEX idx_analysis_user ON analysis_history(user_id);
CREATE INDEX idx_analysis_article ON analysis_history(article_id);
CREATE INDEX idx_analysis_date ON analysis_history(analyzed_at);
CREATE INDEX idx_votes_article ON article_votes(article_id);
CREATE INDEX idx_votes_user ON article_votes(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
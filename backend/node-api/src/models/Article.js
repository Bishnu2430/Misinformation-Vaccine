const pool = require("../config/database");

class Article {
  /**
   * Create or get existing article
   */
  static async createOrGet(articleData) {
    const {
      url,
      title,
      text,
      source_domain,
      authors,
      publish_date,
      word_count,
    } = articleData;

    // If URL exists, try to find existing article
    if (url) {
      const existing = await this.findByUrl(url);
      if (existing) {
        return existing;
      }
    }

    const query = `
            INSERT INTO articles (url, title, text, source_domain, authors, publish_date, word_count)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;

    const result = await pool.query(query, [
      url || null,
      title,
      text,
      source_domain || null,
      authors || null,
      publish_date || null,
      word_count,
    ]);

    return result.rows[0];
  }

  /**
   * Find article by URL
   */
  static async findByUrl(url) {
    const query = "SELECT * FROM articles WHERE url = $1";
    const result = await pool.query(query, [url]);
    return result.rows[0];
  }

  /**
   * Find article by ID
   */
  static async findById(id) {
    const query = "SELECT * FROM articles WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Get articles by source domain
   */
  static async findBySource(sourceDomain, limit = 10) {
    const query = `
            SELECT * FROM articles 
            WHERE source_domain = $1 
            ORDER BY created_at DESC 
            LIMIT $2
        `;
    const result = await pool.query(query, [sourceDomain, limit]);
    return result.rows;
  }

  /**
   * Get article analysis statistics
   */
  static async getAnalysisStats(articleId) {
    const query = `
            SELECT 
                COUNT(*) as analysis_count,
                COUNT(CASE WHEN prediction = 'FAKE' THEN 1 END) as fake_predictions,
                COUNT(CASE WHEN prediction = 'TRUE' THEN 1 END) as true_predictions,
                AVG(confidence) as avg_confidence
            FROM analysis_history
            WHERE article_id = $1
        `;

    const result = await pool.query(query, [articleId]);
    return result.rows[0];
  }

  /**
   * Get community votes for article
   */
  static async getVotes(articleId) {
    const query = `
            SELECT 
                COUNT(*) as total_votes,
                COUNT(CASE WHEN vote = 'fake' THEN 1 END) as fake_votes,
                COUNT(CASE WHEN vote = 'true' THEN 1 END) as true_votes
            FROM article_votes
            WHERE article_id = $1
        `;

    const result = await pool.query(query, [articleId]);
    return result.rows[0];
  }
}

module.exports = Article;

const pool = require("../config/database");

class AnalysisHistory {
  /**
   * Create analysis record
   */
  static async create(analysisData) {
    const {
      user_id,
      article_id,
      input_type,
      input_url,
      input_text,
      prediction,
      confidence,
      probability_fake,
      probability_true,
      processing_time_ms,
    } = analysisData;

    const query = `
            INSERT INTO analysis_history (
                user_id, article_id, input_type, input_url, input_text,
                prediction, confidence, probability_fake, probability_true,
                processing_time_ms
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;

    const result = await pool.query(query, [
      user_id || null,
      article_id || null,
      input_type,
      input_url || null,
      input_text || null,
      prediction,
      confidence,
      probability_fake,
      probability_true,
      processing_time_ms || null,
    ]);

    return result.rows[0];
  }

  /**
   * Get analysis by ID
   */
  static async findById(id) {
    const query = `
            SELECT 
                ah.*,
                a.title, a.url as article_url, a.source_domain,
                u.username
            FROM analysis_history ah
            LEFT JOIN articles a ON ah.article_id = a.id
            LEFT JOIN users u ON ah.user_id = u.id
            WHERE ah.id = $1
        `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Get recent analyses (global)
   */
  static async getRecent(limit = 10, offset = 0) {
    const query = `
            SELECT 
                ah.id, ah.prediction, ah.confidence, ah.analyzed_at,
                ah.input_type,
                a.title, a.url, a.source_domain,
                u.username
            FROM analysis_history ah
            LEFT JOIN articles a ON ah.article_id = a.id
            LEFT JOIN users u ON ah.user_id = u.id
            ORDER BY ah.analyzed_at DESC
            LIMIT $1 OFFSET $2
        `;

    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  /**
   * Get user's history
   */
  static async getUserHistory(userId, limit = 10, offset = 0) {
    const query = `
            SELECT 
                ah.*,
                a.title, a.url, a.source_domain
            FROM analysis_history ah
            LEFT JOIN articles a ON ah.article_id = a.id
            WHERE ah.user_id = $1
            ORDER BY ah.analyzed_at DESC
            LIMIT $2 OFFSET $3
        `;

    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows;
  }

  /**
   * Add user feedback
   */
  static async addFeedback(analysisId, userId, vote, feedback) {
    const query = `
            UPDATE analysis_history
            SET user_vote = $1, user_feedback = $2
            WHERE id = $3 AND user_id = $4
            RETURNING *
        `;

    const result = await pool.query(query, [
      vote,
      feedback,
      analysisId,
      userId,
    ]);
    return result.rows[0];
  }

  /**
   * Get global statistics
   */
  static async getGlobalStats() {
    const query = `
            SELECT 
                COUNT(*) as total_analyses,
                COUNT(CASE WHEN prediction = 'FAKE' THEN 1 END) as fake_count,
                COUNT(CASE WHEN prediction = 'TRUE' THEN 1 END) as true_count,
                AVG(confidence) as avg_confidence,
                COUNT(DISTINCT user_id) as unique_users,
                COUNT(DISTINCT article_id) as unique_articles
            FROM analysis_history
        `;

    const result = await pool.query(query);
    return result.rows[0];
  }

  /**
   * Get trending sources (most analyzed)
   */
  static async getTrendingSources(limit = 10) {
    const query = `
            SELECT 
                a.source_domain,
                COUNT(*) as analysis_count,
                COUNT(CASE WHEN ah.prediction = 'FAKE' THEN 1 END) as fake_count,
                COUNT(CASE WHEN ah.prediction = 'TRUE' THEN 1 END) as true_count,
                AVG(ah.confidence) as avg_confidence
            FROM analysis_history ah
            JOIN articles a ON ah.article_id = a.id
            WHERE a.source_domain IS NOT NULL
            GROUP BY a.source_domain
            ORDER BY analysis_count DESC
            LIMIT $1
        `;

    const result = await pool.query(query, [limit]);
    return result.rows;
  }
}

module.exports = AnalysisHistory;

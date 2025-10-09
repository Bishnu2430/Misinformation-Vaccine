const pool = require("../config/database");
const bcrypt = require("bcryptjs");

class User {
  /**
   * Create a new user
   */
  static async create(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
            INSERT INTO users (username, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, username, email, created_at
        `;

    const result = await pool.query(query, [username, email, hashedPassword]);
    return result.rows[0];
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  /**
   * Find user by username
   */
  static async findByUsername(username) {
    const query = "SELECT * FROM users WHERE username = $1";
    const result = await pool.query(query, [username]);
    return result.rows[0];
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    const query =
      "SELECT id, username, email, created_at FROM users WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Verify password
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Get user's analysis history
   */
  static async getAnalysisHistory(userId, limit = 10, offset = 0) {
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
   * Get user statistics
   */
  static async getStats(userId) {
    const query = `
            SELECT 
                COUNT(*) as total_analyses,
                COUNT(CASE WHEN prediction = 'FAKE' THEN 1 END) as fake_count,
                COUNT(CASE WHEN prediction = 'TRUE' THEN 1 END) as true_count,
                AVG(confidence) as avg_confidence
            FROM analysis_history
            WHERE user_id = $1
        `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}

module.exports = User;

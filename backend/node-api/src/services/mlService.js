const axios = require("axios");
const config = require("../config/config");

class MLService {
  constructor() {
    this.baseURL = config.mlServiceUrl;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 seconds
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Check if ML service is healthy
   */
  async healthCheck() {
    try {
      const response = await this.client.get("/health");
      return response.data;
    } catch (error) {
      throw new Error(`ML Service health check failed: ${error.message}`);
    }
  }

  /**
   * Predict from text
   */
  async predictText(text, title = null) {
    try {
      const response = await this.client.post("/api/predict/text", {
        text,
        title,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          `ML Service error: ${
            error.response.data.detail?.error || error.message
          }`
        );
      }
      throw new Error(`ML Service connection failed: ${error.message}`);
    }
  }

  /**
   * Predict from URL
   */
  async predictUrl(url) {
    try {
      const response = await this.client.post("/api/predict/url", {
        url,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          `ML Service error: ${
            error.response.data.detail?.error || error.message
          }`
        );
      }
      throw new Error(`ML Service connection failed: ${error.message}`);
    }
  }
}

module.exports = new MLService();

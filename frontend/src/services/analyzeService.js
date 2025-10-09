import api from "./api";

const analyzeService = {
  /**
   * Analyze article from URL
   */
  async analyzeUrl(url) {
    const response = await api.post("/api/analyze/url", { url });
    return response.data;
  },

  /**
   * Analyze article from text
   */
  async analyzeText(text, title = "") {
    const response = await api.post("/api/analyze/text", {
      text,
      title: title || undefined,
    });
    return response.data;
  },

  /**
   * Check ML service health
   */
  async checkHealth() {
    const response = await api.get("/api/analyze/health");
    return response.data;
  },
};

export default analyzeService;

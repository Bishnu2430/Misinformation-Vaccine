import api from "./api";

const historyService = {
  /**
   * Get user's analysis history
   */
  async getMyHistory(limit = 10, offset = 0) {
    const response = await api.get("/api/history/my", {
      params: { limit, offset },
    });
    return response.data;
  },

  /**
   * Get recent analyses (global)
   */
  async getRecentAnalyses(limit = 10, offset = 0) {
    const response = await api.get("/api/history/recent", {
      params: { limit, offset },
    });
    return response.data;
  },

  /**
   * Get single analysis by ID
   */
  async getAnalysisById(id) {
    const response = await api.get(`/api/history/${id}`);
    return response.data;
  },

  /**
   * Add feedback to analysis
   */
  async addFeedback(analysisId, vote, feedback) {
    const response = await api.post(`/api/history/${analysisId}/feedback`, {
      vote,
      feedback,
    });
    return response.data;
  },

  /**
   * Get global statistics
   */
  async getGlobalStats() {
    const response = await api.get("/api/history/stats/global");
    return response.data;
  },
};

export default historyService;

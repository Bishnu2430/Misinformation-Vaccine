import api from "./api";

const userService = {
  /**
   * Get user profile with stats
   */
  async getProfile() {
    const response = await api.get("/api/users/profile");
    return response.data;
  },

  /**
   * Get user's analysis history
   */
  async getUserHistory(limit = 10, offset = 0) {
    const response = await api.get("/api/users/history", {
      params: { limit, offset },
    });
    return response.data;
  },
};

export default userService;

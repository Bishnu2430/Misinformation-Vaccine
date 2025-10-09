import api from "./api";

const authService = {
  /**
   * Register new user
   */
  async register(username, email, password) {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });

    if (response.data.success) {
      const { token, user } = response.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { token, user };
    }

    throw new Error(response.data.error || "Registration failed");
  },

  /**
   * Login user
   */
  async login(email, password) {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    if (response.data.success) {
      const { token, user } = response.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { token, user };
    }

    throw new Error(response.data.error || "Login failed");
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  /**
   * Get current user from token
   */
  async getCurrentUser() {
    const response = await api.get("/api/auth/me");

    if (response.data.success) {
      const user = response.data.data;
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    }

    throw new Error("Failed to get user");
  },

  /**
   * Get stored user from localStorage
   */
  getStoredUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem("token");
  },
};

export default authService;

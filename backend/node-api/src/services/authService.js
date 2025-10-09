const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/User");

class AuthService {
  /**
   * Generate JWT token
   */
  generateToken(userId) {
    return jwt.sign({ userId }, config.jwt.secret, {
      expiresIn: config.jwt.expire,
    });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  /**
   * Register new user
   */
  async register(username, email, password) {
    // Check if user exists
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      throw new Error("Email already registered");
    }

    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      throw new Error("Username already taken");
    }

    // Create user
    const user = await User.create(username, email, password);

    // Generate token
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    };
  }

  /**
   * Login user
   */
  async login(email, password) {
    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Verify password
    const isValid = await User.verifyPassword(password, user.password_hash);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    // Generate token
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    };
  }
}

module.exports = new AuthService();

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authenticate } = require("../middleware/auth");

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile with stats
 * @access  Private
 */
router.get("/profile", authenticate, async (req, res, next) => {
  try {
    const stats = await User.getStats(req.user.id);

    res.json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          username: req.user.username,
          email: req.user.email,
          created_at: req.user.created_at,
        },
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users/history
 * @desc    Get user's analysis history
 * @access  Private
 */
router.get("/history", authenticate, async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const history = await User.getAnalysisHistory(req.user.id, limit, offset);

    res.json({
      success: true,
      data: {
        history,
        pagination: {
          limit,
          offset,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const AnalysisHistory = require("../models/AnalysisHistory");
const { authenticate, optionalAuth } = require("../middleware/auth");

/**
 * @route   GET /api/history/my
 * @desc    Get user's analysis history
 * @access  Private
 */
router.get("/my", authenticate, async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const history = await AnalysisHistory.getUserHistory(
      req.user.id,
      limit,
      offset
    );

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

/**
 * @route   GET /api/history/recent
 * @desc    Get recent analyses (global)
 * @access  Public
 */
router.get("/recent", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const history = await AnalysisHistory.getRecent(limit, offset);

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

/**
 * @route   GET /api/history/:id
 * @desc    Get single analysis by ID
 * @access  Public
 */
router.get("/:id", async (req, res, next) => {
  try {
    const analysis = await AnalysisHistory.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: "Analysis not found",
      });
    }

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/history/:id/feedback
 * @desc    Add feedback to analysis
 * @access  Private
 */
router.post("/:id/feedback", authenticate, async (req, res, next) => {
  try {
    const { vote, feedback } = req.body;

    if (vote && !["agree", "disagree"].includes(vote)) {
      return res.status(400).json({
        success: false,
        error: 'Vote must be "agree" or "disagree"',
      });
    }

    const updated = await AnalysisHistory.addFeedback(
      req.params.id,
      req.user.id,
      vote || null,
      feedback || null
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "Analysis not found or unauthorized",
      });
    }

    res.json({
      success: true,
      message: "Feedback added",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/history/stats/global
 * @desc    Get global statistics
 * @access  Public
 */
router.get("/stats/global", async (req, res, next) => {
  try {
    const stats = await AnalysisHistory.getGlobalStats();
    const trending = await AnalysisHistory.getTrendingSources(10);

    res.json({
      success: true,
      data: {
        stats,
        trending_sources: trending,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

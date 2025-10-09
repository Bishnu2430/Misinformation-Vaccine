const express = require("express");
const router = express.Router();
const articleService = require("../services/articleService");
const mlService = require("../services/mlService");
const { optionalAuth } = require("../middleware/auth");
const {
  validateTextAnalysis,
  validateUrlAnalysis,
} = require("../middleware/validator");

/**
 * @route   POST /api/analyze/text
 * @desc    Analyze article from text
 * @access  Public (optionally authenticated)
 */
router.post(
  "/text",
  optionalAuth,
  validateTextAnalysis,
  async (req, res, next) => {
    try {
      const { text, title } = req.body;
      const userId = req.user ? req.user.id : null;

      const result = await articleService.analyzeText(text, title, userId);

      res.json({
        success: true,
        message: "Analysis completed",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/analyze/url
 * @desc    Analyze article from URL
 * @access  Public (optionally authenticated)
 */
router.post(
  "/url",
  optionalAuth,
  validateUrlAnalysis,
  async (req, res, next) => {
    try {
      const { url } = req.body;
      const userId = req.user ? req.user.id : null;

      const result = await articleService.analyzeUrl(url, userId);

      res.json({
        success: true,
        message: "Analysis completed",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/analyze/health
 * @desc    Check ML service health
 * @access  Public
 */
router.get("/health", async (req, res, next) => {
  try {
    const health = await mlService.healthCheck();

    res.json({
      success: true,
      data: health,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

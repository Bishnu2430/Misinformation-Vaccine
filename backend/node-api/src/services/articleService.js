const Article = require("../models/Article");
const AnalysisHistory = require("../models/AnalysisHistory");
const mlService = require("./mlService");

class ArticleService {
  /**
   * Analyze article from URL
   */
  async analyzeUrl(url, userId = null) {
    const startTime = Date.now();

    try {
      // Call ML service
      const mlResult = await mlService.predictUrl(url);

      if (!mlResult.success) {
        throw new Error(mlResult.error || "Analysis failed");
      }

      // Store article
      const articleData = {
        url: mlResult.article.url,
        title: mlResult.article.title,
        text: "", // We don't store full text from ML service
        source_domain: mlResult.article.source,
        authors: mlResult.article.authors,
        publish_date: mlResult.article.publish_date,
        word_count: mlResult.article.word_count,
      };

      const article = await Article.createOrGet(articleData);

      // Store analysis history
      const processingTime = Date.now() - startTime;

      const historyData = {
        user_id: userId,
        article_id: article.id,
        input_type: "url",
        input_url: url,
        prediction: mlResult.prediction.prediction,
        confidence: mlResult.prediction.confidence,
        probability_fake: mlResult.prediction.probabilities.fake,
        probability_true: mlResult.prediction.probabilities.true,
        processing_time_ms: processingTime,
      };

      const history = await AnalysisHistory.create(historyData);

      return {
        success: true,
        analysis_id: history.id,
        article: mlResult.article,
        prediction: mlResult.prediction,
        processing_time_ms: processingTime,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Analyze raw text
   */
  async analyzeText(text, title, userId = null) {
    const startTime = Date.now();

    try {
      // Call ML service
      const mlResult = await mlService.predictText(text, title);

      if (!mlResult.success) {
        throw new Error(mlResult.error || "Analysis failed");
      }

      // Store as article (no URL)
      const articleData = {
        url: null,
        title: title || "User provided text",
        text: text.substring(0, 1000), // Store first 1000 chars
        source_domain: null,
        authors: null,
        publish_date: null,
        word_count: mlResult.article.word_count,
      };

      const article = await Article.createOrGet(articleData);

      // Store analysis history
      const processingTime = Date.now() - startTime;

      const historyData = {
        user_id: userId,
        article_id: article.id,
        input_type: "text",
        input_text: text.substring(0, 500), // Store first 500 chars
        prediction: mlResult.prediction.prediction,
        confidence: mlResult.prediction.confidence,
        probability_fake: mlResult.prediction.probabilities.fake,
        probability_true: mlResult.prediction.probabilities.true,
        processing_time_ms: processingTime,
      };

      const history = await AnalysisHistory.create(historyData);

      return {
        success: true,
        analysis_id: history.id,
        article: mlResult.article,
        prediction: mlResult.prediction,
        processing_time_ms: processingTime,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ArticleService();

/**
 * Validate registration data
 */
const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;

  const errors = [];

  // Username validation
  if (!username || username.trim().length < 3) {
    errors.push("Username must be at least 3 characters");
  }

  if (username && username.length > 50) {
    errors.push("Username must be less than 50 characters");
  }

  if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push("Username can only contain letters, numbers, and underscores");
  }

  // Email validation
  if (!email || !isValidEmail(email)) {
    errors.push("Valid email is required");
  }

  // Password validation
  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      errors,
    });
  }

  next();
};

/**
 * Validate login data
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  const errors = [];

  if (!email || !isValidEmail(email)) {
    errors.push("Valid email is required");
  }

  if (!password) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      errors,
    });
  }

  next();
};

/**
 * Validate text analysis request
 */
const validateTextAnalysis = (req, res, next) => {
  const { text } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({
      success: false,
      error: "Text is required",
    });
  }

  if (text.trim().length < 50) {
    return res.status(400).json({
      success: false,
      error: "Text must be at least 50 characters",
    });
  }

  if (text.length > 50000) {
    return res.status(400).json({
      success: false,
      error: "Text must be less than 50,000 characters",
    });
  }

  next();
};

/**
 * Validate URL analysis request
 */
const validateUrlAnalysis = (req, res, next) => {
  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({
      success: false,
      error: "URL is required",
    });
  }

  if (!isValidUrl(url)) {
    return res.status(400).json({
      success: false,
      error: "Invalid URL format",
    });
  }

  next();
};

// Helper functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  validateRegister,
  validateLogin,
  validateTextAnalysis,
  validateUrlAnalysis,
};

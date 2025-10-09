const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const config = require("./config/config");
const pool = require("./config/database");
const { errorHandler, notFound } = require("./middleware/errorHandler");

// Import routes
const authRoutes = require("./routes/auth");
const analyzeRoutes = require("./routes/analyze");
const historyRoutes = require("./routes/history");
const userRoutes = require("./routes/users");

// Create Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: config.allowedOrigins,
    credentials: true,
  })
);
app.use(morgan("dev")); // Logging
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded

// Test database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Database connected at:", res.rows[0].now);
  }
});

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Misinformation Vaccine API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      analyze: "/api/analyze",
      history: "/api/history",
      users: "/api/users",
    },
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/users", userRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("🚀 Misinformation Vaccine API Server");
  console.log("=".repeat(50));
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 API: http://localhost:${PORT}`);
  console.log(`🤖 ML Service: ${config.mlServiceUrl}`);
  console.log("=".repeat(50));
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

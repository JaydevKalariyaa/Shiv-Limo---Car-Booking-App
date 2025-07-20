require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectToDatabase, isDatabaseConnected } = require("./config/database");
const app = express();

// Import routes
const bookingRoutes = require("./routes/bookingRoutes");
const stripeRoutes = require("./routes/stripeRoutes");

// Initialize database connection
connectToDatabase()
  .then(() => console.log("Database connection initialized"))
  .catch((err) => console.error("Database connection error:", err));

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    // Ensure database is connected before processing requests
    if (!isDatabaseConnected()) {
      console.log("Database not connected, attempting to reconnect...");
      await connectToDatabase();
    }
    next();
  } catch (error) {
    console.error("Database connection middleware error:", error);
    res.status(503).json({
      success: false,
      error: "Database connection error. Please try again.",
    });
  }
});

// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/stripe", stripeRoutes);

// Health check endpoint
app.get("/ping", async (req, res) => {
  try {
    const dbConnected = isDatabaseConnected();
    res.json({
      message: "pong",
      database: dbConnected ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      message: "error",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Something went wrong!",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

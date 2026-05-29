import express from "express";
import config from "./src/config/index.js";
const app = express();

// Health Check
app.get("/", (req, res, next) => {
  res.send("Server Is Running");
});

// Middleware
// Routes
// Error Handler
// 404 Route Handler

const PORT = config.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Running On ${PORT}`);
});

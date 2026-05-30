import express from "express";
import config from "./src/config/index.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errroHandler, handle404 } from "./src/middleware/errorHandler.js";
import router from "./src/routes/index.js";
import { dbConnect } from "./src/config/db.js";
const app = express();

// Middleware
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Health Check
app.get("/", (req, res, next) => {
  res.send("Server Is Running");
});

// Routes
app.use("/api", router);

// Error Handler
app.use(errroHandler); // Globle Error Handler
app.use("/", handle404); // 404 route Handler

const PORT = config.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Running On ${PORT}`);
  dbConnect();
});

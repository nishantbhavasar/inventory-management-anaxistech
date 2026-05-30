import express from "express";
import inventoryRouter from "./inventory.routes.js";
const router = express.Router();

router.use("/items", inventoryRouter);

export default router;

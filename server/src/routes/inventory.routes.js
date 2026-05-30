import express from "express";
import InventoryController from "../controller/inventory.controller.js";
import sendResponse from "../utils/responseGenerator.js";
import { validateId, validatePayload } from "../middleware/validator.js";
import {
  createInventory,
  updateInventory,
} from "../validators/inventory.validator.js";
const inventoryRouter = express.Router();

const inventoryController = new InventoryController();

// Get All Inventory Items
inventoryRouter.get("/", async (req, res, next) => {
  try {
    const response = await inventoryController.getAllInventoryItems(req.query);
    sendResponse({
      res,
      ...response,
    });
    return;
  } catch (error) {
    next(error);
  }
});

// Get inventory Item by ID
inventoryRouter.get("/:id", validateId, async (req, res, next) => {
  try {
    const response = await inventoryController.getInventoryItem(
      req?.params?.id,
    );
    sendResponse({
      res,
      ...response,
    });
    return;
  } catch (error) {
    next(error);
  }
});

// Create inventory Item
inventoryRouter.post(
  "/",
  validatePayload(createInventory),
  async (req, res, next) => {
    try {
      const response = await inventoryController.createInventoryItem(req?.body);
      sendResponse({
        res,
        ...response,
      });
      return;
    } catch (error) {
      next(error);
    }
  },
);

// Update inventory Item
inventoryRouter.put(
  "/:id",
  validatePayload(updateInventory),
  validateId,
  async (req, res, next) => {
    try {
      const response = await inventoryController.updateInventoryItem(
        req?.params?.id,
        req.body,
      );
      sendResponse({
        res,
        ...response,
      });
      return;
    } catch (error) {
      next(error);
    }
  },
);

// Delete inventory Item
inventoryRouter.delete("/:id", validateId, async (req, res, next) => {
  try {
    const response = await inventoryController.deleteInventoryItem(
      req?.params?.id,
    );
    sendResponse({
      res,
      ...response,
    });
    return;
  } catch (error) {
    next(error);
  }
});

export default inventoryRouter;

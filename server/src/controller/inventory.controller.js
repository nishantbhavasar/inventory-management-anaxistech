import InventoryItemsModel from "../models/inventory.model.js";

export default class InventoryController {
  async getAllInventoryItems(query) {
    try {
      const page = query?.page ?? 1;
      const limit = query?.limit ?? 10;
      const offset = (page - 1) * limit;
      const search = query?.search?.trim() ?? "";
      const regEx = new RegExp(search, "i");
      const findQuery = search
        ? {
            name: { $regex: regEx },
            isDeleted: false,
          }
        : { isDeleted: false };
      console.log(page, limit, offset, search);
      const inventoryItems = await InventoryItemsModel.find(findQuery)
        .skip(offset)
        .limit(limit)
        .lean();
      const count = await InventoryItemsModel.countDocuments(findQuery);

      return {
        message: "Items Fetched Successfully",
        success: true,
        data: {
          count,
          rows: inventoryItems,
        },
        statusCode: 200,
      };
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async getInventoryItem(id) {
    try {
      const inventoryItem = await InventoryItemsModel.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!inventoryItem) {
        return {
          message: "Item With Given Id Not Exist",
          success: false,
          data: null,
          statusCode: 400,
        };
      }

      return {
        message: "Item Fetched Successfully",
        success: true,
        data: inventoryItem,
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw new Error(error?.message);
    }
  }

  async createInventoryItem(body) {
    try {
      const inventory = await InventoryItemsModel.create(body);

      if (!inventory) {
        return {
          message: "Item Not Created",
          success: false,
          data: null,
          statusCode: 400,
        };
      }

      return {
        message: "Item Created Successfully",
        success: true,
        data: inventory,
        statusCode: 201,
      };
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async updateInventoryItem(id, body) {
    try {
      // Check If Invetnory isExists
      const inventory = await InventoryItemsModel.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!inventory) {
        return {
          message: "Item With Given Id not Exists",
          success: false,
          data: null,
          statusCode: 400,
        };
      }

      // update Inventory Item
      const updatedInventoryItem = await InventoryItemsModel.updateOne(body);

      return {
        message: "Item Updated Successfully",
        success: true,
        data: { updated: updatedInventoryItem?.acknowledged },
        statusCode: 201,
      };
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async deleteInventoryItem(id) {
    try {
      // Check Is inventory Exist
      const inventory = await InventoryItemsModel.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!inventory) {
        return {
          message: "Item Not Exists With Given ID",
          success: false,
          data: null,
          statusCode: 400,
        };
      }

      // Soft Delete Inventory Item
      await InventoryItemsModel.updateOne(
        {
          _id: id,
        },
        { isDeleted: true },
      );

      return {
        message: "Item Deleted Successfully",
        success: true,
        data: {},
        statusCode: 200,
      };
    } catch (error) {
      throw new Error(error?.message);
    }
  }
}

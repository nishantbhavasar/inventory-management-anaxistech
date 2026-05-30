import mongoose from "mongoose";

const inventoryItemsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["Electronic", "Food", "Drink", "Accessories", "Home", "Medicine"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 0,
    },

    purchasePrice: {
      type: Number,
      required: true,
    },

    sellingPrice: {
      type: Number,
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const InventoryItemsModel = mongoose.model("items", inventoryItemsSchema);
export default InventoryItemsModel;

export interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  createdAt: string;
}

export interface InventoryListData {
  count: number;
  rows: InventoryItem[];
}

export type { InventoryFormValues } from "../schemas/inventory.schema";

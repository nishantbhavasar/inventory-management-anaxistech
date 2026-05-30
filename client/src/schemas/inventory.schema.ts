import { z } from "zod";
import { InventoryCategory } from "../config/constant";

const requiredNumber = (label: string) =>
  z
    .number({ message: `${label} is required` })
    .refine((n) => !Number.isNaN(n), { message: `${label} is required` });

export const inventoryFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50,'Name must be lessthen 50 characters'),
  category: z
    .string()
    .min(1, "Category is required")
    .refine((val) => InventoryCategory.includes(val as (typeof InventoryCategory)[number]), {
      message: "Please select a valid category",
    }),
  quantity: requiredNumber("Quantity").min(1, "Quantity must be at least 1"),
  purchasePrice: requiredNumber("Purchase price").min(
    1,
    "Purchase price cannot be negative",
  ),
  sellingPrice: requiredNumber("Selling price").min(
    1,
    "Selling price cannot be negative",
  ),
});

export type InventoryFormValues = z.infer<typeof inventoryFormSchema>;

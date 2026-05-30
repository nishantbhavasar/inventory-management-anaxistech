import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
import InventoryApi from "../api/inventory.api";
import { InventoryCategory } from "../config/constant";
import {
  inventoryFormSchema,
  type InventoryFormValues,
} from "../schemas/inventory.schema";
import Button from "./Button";
import SideDrawer from "./Drawer";
import InputField from "./Input";
import InputSelect from "./Select";

interface InventoryFormDrawerProps {
  isOpen: boolean;
  mode: "create" | "edit";
  itemId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

const inventoryApi = new InventoryApi();

const defaultValues: InventoryFormValues = {
  name: "",
  category: "",
  quantity: 0,
  purchasePrice: 0,
  sellingPrice: 0,
};

const InventoryFormDrawer: React.FC<InventoryFormDrawerProps> = ({
  isOpen,
  mode,
  itemId,
  onClose,
  onSuccess,
}) => {
  const [fetchLoading, setFetchLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const categoryOptions = useMemo(
    () =>
      InventoryCategory.map((cat) => ({
        label: cat,
        value: cat,
      })),
    [],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!isOpen) {
      reset(defaultValues);
      setApiError(null);
      return;
    }

    if (mode === "create") {
      reset(defaultValues);
      setApiError(null);
      return;
    }

    if (mode === "edit" && itemId) {
      const fetchItem = async () => {
        setFetchLoading(true);
        setApiError(null);
        const response = await inventoryApi.getInventory(itemId);
        setFetchLoading(false);

        if (response.success && response.data) {
          reset({
            name: response.data.name,
            category: response.data.category,
            quantity: response.data.quantity,
            purchasePrice: response.data.purchasePrice,
            sellingPrice: response.data.sellingPrice,
          });
        } else {
          setApiError(response.message);
        }
      };

      fetchItem();
    }
  }, [isOpen, mode, itemId, reset]);

  const onSubmit = async (values: InventoryFormValues) => {
    const editId = itemId;
    if (mode === "edit" && !editId) return;

    setSubmitLoading(true);
    setApiError(null);

    const response =
      mode === "create"
        ? await inventoryApi.createInventory(values)
        : await inventoryApi.updateInventory(editId!, values);

    setSubmitLoading(false);

    if (response.success) {
      onSuccess();
      onClose();
    } else {
      setApiError(response.message);
    }
  };

  const title = mode === "create" ? "Create inventory item" : "Edit inventory item";

  return (
    <SideDrawer isOpen={isOpen} onClose={onClose} title={title}>
      {fetchLoading ? (
        <div className="flex items-center justify-center min-h-75">
          <LoaderCircle height={36} width={36} className="animate-spin text-[#FFA033]" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {apiError && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-md p-3">
              {apiError}
            </p>
          )}

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <InputField
                label="Name"
                placeholder="Enter item name"
                field={field}
                required
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <InputSelect
                label="Category"
                placeholder="Select category"
                options={categoryOptions}
                required
                field={{
                  ...field,
                  value:
                    categoryOptions.find((opt) => opt.value === field.value) ??
                    null,
                  onChange: (opt: { value: string } | null) =>
                    field.onChange(opt?.value ?? ""),
                }}
                errorMessage={errors.category?.message}
              />
            )}
          />

          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <InputField
                label="Quantity"
                type="number"
                placeholder="Enter quantity"
                field={field}
                required
                errorMessage={errors.quantity?.message}
                onChange={(e) =>
                  field.onChange(
                    (e.target as HTMLInputElement).valueAsNumber || "",
                  )
                }
              />
            )}
          />

          <Controller
            name="purchasePrice"
            control={control}
            render={({ field }) => (
              <InputField
                label="Purchase price"
                type="number"
                placeholder="Enter purchase price"
                field={field}
                required
                errorMessage={errors.purchasePrice?.message}
                onChange={(e) =>
                  field.onChange(
                    (e.target as HTMLInputElement).valueAsNumber || "",
                  )
                }
              />
            )}
          />

          <Controller
            name="sellingPrice"
            control={control}
            render={({ field }) => (
              <InputField
                label="Selling price"
                type="number"
                placeholder="Enter selling price"
                field={field}
                required
                errorMessage={errors.sellingPrice?.message}
                onChange={(e) =>
                  field.onChange(
                    (e.target as HTMLInputElement).valueAsNumber || "",
                  )
                }
              />
            )}
          />

          <div className="flex gap-3 pt-4">
            <Button
              text="Cancel"
              variant="outline"
              type="button"
              width="w-1/2"
              onClick={onClose}
              disabled={submitLoading}
            />
            <Button
              text={mode === "create" ? "Create" : "Update"}
              type="submit"
              width="w-1/2"
              loading={submitLoading}
              disabled={submitLoading}
            />
          </div>
        </form>
      )}
    </SideDrawer>
  );
};

export default InventoryFormDrawer;

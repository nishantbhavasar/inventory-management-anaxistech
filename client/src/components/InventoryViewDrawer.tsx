import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import InventoryApi from "../api/inventory.api";
import type { InventoryItem } from "../types/inventory";
import SideDrawer from "./Drawer";

interface InventoryViewDrawerProps {
  isOpen: boolean;
  itemId: string | null;
  onClose: () => void;
}

const inventoryApi = new InventoryApi();

const formatDate = (date: string) =>
  new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex flex-col gap-1 border-b border-gray-100 pb-3">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <span className="text-base text-black">{value}</span>
  </div>
);

const InventoryViewDrawer: React.FC<InventoryViewDrawerProps> = ({
  isOpen,
  itemId,
  onClose,
}) => {
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !itemId) {
      setItem(null);
      setError(null);
      return;
    }

    const fetchItem = async () => {
      setLoading(true);
      setError(null);
      const response = await inventoryApi.getInventory(itemId);
      setLoading(false);

      if (response.success && response.data) {
        setItem(response.data);
      } else {
        setItem(null);
        setError(response.message);
      }
    };

    fetchItem();
  }, [isOpen, itemId]);

  return (
    <SideDrawer isOpen={isOpen} onClose={onClose} title="View inventory item">
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <LoaderCircle height={36} width={36} className="animate-spin text-[#FFA033]" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-sm text-center py-10">{error}</p>
      ) : item ? (
        <div className="flex flex-col gap-4">
          <DetailRow label="Name" value={item.name} />
          <DetailRow label="Category" value={item.category} />
          <DetailRow label="Quantity" value={item.quantity} />
          <DetailRow label="Purchase price" value={item.purchasePrice} />
          <DetailRow label="Selling price" value={item.sellingPrice} />
          <DetailRow label="Created at" value={formatDate(item.createdAt)} />
        </div>
      ) : null}
    </SideDrawer>
  );
};

export default InventoryViewDrawer;

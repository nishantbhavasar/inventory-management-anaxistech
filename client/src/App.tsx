import { useCallback, useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import InventoryApi from "./api/inventory.api";
import Button from "./components/Button";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import InventoryFormDrawer from "./components/InventoryFormDrawer";
import InventoryViewDrawer from "./components/InventoryViewDrawer";
import InputField from "./components/Input";
import DataTable from "./components/Table";
import { useDebounce } from "./hooks/useDebounce";
import type { InventoryItem } from "./types/inventory";

const PAGE_LIMIT = 10;
const inventoryApi = new InventoryApi();

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function App() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  const [viewDrawer, setViewDrawer] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });
  const [formDrawer, setFormDrawer] = useState<{
    open: boolean;
    mode: "create" | "edit";
    id: string | null;
  }>({ open: false, mode: "create", id: null });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / PAGE_LIMIT)),
    [totalCount],
  );

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setListError(null);

    const response = await inventoryApi.getAllInventories({
      page,
      limit: PAGE_LIMIT,
      search: debouncedSearch || undefined,
    });

    setLoading(false);

    if (response.success && response.data) {
      setItems(response.data.rows);
      setTotalCount(response.data.count);
    } else {
      setItems([]);
      setTotalCount(0);
      setListError(response.message);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleDelete = async () => {
    if (!deleteDialog.id) return;

    setDeleteLoading(true);
    const response = await inventoryApi.deleteInventory(deleteDialog.id);
    setDeleteLoading(false);

    if (response.success) {
      setDeleteDialog({ open: false, id: null });
      fetchItems();
    }
  };

  const columns = useMemo<ColumnDef<InventoryItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 160,
        enableSorting:false,
      },
      {
        accessorKey: "category",
        header: "Category",
        size: 140,
        enableSorting:false,
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        size: 100,
        enableSorting:false,
      },
      {
        accessorKey: "purchasePrice",
        header: "Purchase price",
        size: 140,
        enableSorting:false,
      },
      {
        accessorKey: "sellingPrice",
        header: "Selling price",
        size: 140,
        enableSorting:false,
      },
      {
        accessorKey: "createdAt",
        header: "Created at",
        size: 140,
        enableSorting:false,
        cell: ({ getValue }) => formatDate(getValue() as string),
      },
      {
        id: "actions",
        header: "Action",
        size: 120,
        cell: ({ row }) => (
          <div
            className="flex items-center gap-3"
            data-prevent-row-click="true"
          >
            <button
              type="button"
              title="View"
              className="text-gray-600 hover:text-[#FFA033] transition-colors cursor-pointer"
              onClick={() =>
                setViewDrawer({ open: true, id: row.original._id })
              }
            >
              <Eye size={18} />
            </button>
            <button
              type="button"
              title="Edit"
              className="text-gray-600 hover:text-[#FFA033] transition-colors cursor-pointer"
              onClick={() =>
                setFormDrawer({
                  open: true,
                  mode: "edit",
                  id: row.original._id,
                })
              }
            >
              <Pencil size={18} />
            </button>
            <button
              type="button"
              title="Delete"
              className="text-gray-600 hover:text-red-500 transition-colors cursor-pointer"
              onClick={() =>
                setDeleteDialog({ open: true, id: row.original._id })
              }
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <h1 className="text-2xl md:text-3xl font-bold text-black text-center">
          Inventory Management System
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end justify-between">
          <div className="flex-1 max-w-md">
            <InputField
              label="Search"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            text="Create item"
            width="w-auto"
            className="!px-6 shrink-0"
            onClick={() =>
              setFormDrawer({ open: true, mode: "create", id: null })
            }
          />
        </div>

        {listError && (
          <p className="text-red-500 text-sm text-center">{listError}</p>
        )}

        <DataTable
          data={items}
          columns={columns}
          loading={loading}
          loaderSpan={7}
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
          isPagination={totalCount > 0}
          customHeight="h-auto"
          tableContainerClassName="max-h-[calc(100vh-320px)]"
        />
      </div>

      <InventoryViewDrawer
        isOpen={viewDrawer.open}
        itemId={viewDrawer.id}
        onClose={() => setViewDrawer({ open: false, id: null })}
      />

      <InventoryFormDrawer
        isOpen={formDrawer.open}
        mode={formDrawer.mode}
        itemId={formDrawer.id}
        onClose={() => setFormDrawer({ open: false, mode: "create", id: null })}
        onSuccess={fetchItems}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}

export default App;

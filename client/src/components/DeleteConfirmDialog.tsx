import type React from "react";
import Button from "./Button";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={!loading ? onClose : undefined}
      />
      <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-10">
        <h3 className="text-lg font-semibold text-black mb-2">Delete item</h3>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this item? This operation cannot be
          undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            text="Cancel"
            variant="outline"
            width="w-auto"
            className="!px-6"
            onClick={onClose}
            disabled={loading}
          />
          <Button
            text="Delete"
            width="w-auto"
            className="!px-6 !bg-red-600 !from-red-600 !to-red-500 hover:!shadow-red-200"
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;

import React from "react";
import clsx from "clsx";
import { X } from "lucide-react";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  width?: "sm" | "md" | "lg";
  contentClassName?: string;
}

const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  contentClassName = "",
}) => {

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/5 bg-opacity-50 z-[9998] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Side Drawer */}
      <div
        className={clsx(
          "fixed top-0 right-0 h-full bg-white shadow-2xl z-[9999] transition-transform duration-300 ease-in-out flex flex-col",
          "w-full md:max-w-[500px]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-xl text-black font-bold">{title}</h3>
          <X
            height={15}
            width={15}
            className="cursor-pointer hover:scale-110"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div
          className={clsx(
            "p-6 theme-scrollbar flex-1 overflow-y-auto",
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default SideDrawer;

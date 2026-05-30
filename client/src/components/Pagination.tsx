import { ChevronLeft } from "lucide-react";
import React from "react";

// Define types for the props
interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  isLoading,
}) => {
  // #D9FFF8
  return (
    <>
      {!isLoading ? (
        <>
          <div className="flex items-center justify-end gap-2 sm:gap-4 p-4 min-h-[72px] bg-white shrink-0 z-10 border-t border-gray-200">
            {/* Previous Button */}
            <button
              onClick={() => !isLoading && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex w-[80px] sm:w-[115px] h-[36px] items-center justify-center px-2 sm:px-[14px] py-2 rounded-md gap-1 sm:gap-2 border border-[#D0D5DD] ${
                currentPage === 1
                  ? "bg-gray-100 cursor-not-allowed"
                  : " hover:bg-gray-50"
              }`}
            >
              <ChevronLeft height="18" width="18" stroke="#344054" />
              <div className="hidden sm:block font-inter text-[14px] font-semibold leading-[20px] text-left text-[#344054]">
                Previous
              </div>
            </button>

            <button
              onClick={() => !isLoading && onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex w-[80px] sm:w-[115px] h-[36px] items-center justify-center px-2 sm:px-[14px] py-2 rounded-md gap-1 sm:gap-2 border border-[#D0D5DD] ${
                currentPage === totalPages
                  ? "bg-gray-100 cursor-not-allowed"
                  : " hover:bg-gray-50"
              }`}
            >
              <div className="hidden sm:block font-inter text-[14px] font-semibold leading-[20px] text-left text-[#344054]">
                Next
              </div>
              <div className="rotate-180">
                <ChevronLeft height="18" width="18" stroke="#344054" />
              </div>
            </button>
          </div>
        </>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default Pagination;

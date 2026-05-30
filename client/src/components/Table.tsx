import { forwardRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table";

import clsx from "clsx";
import Pagination from "./Pagination";
import {
  ArrowDownUp,
  ChevronDown,
  ChevronUp,
  LoaderCircle,
} from "lucide-react";

interface DataTableProps<TData extends RowData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  loading?: boolean;
  loaderSpan?: number;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  setPageSize?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  isPagination?: boolean;
  customHeight?: string;
  tableContainerClassName?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataTable = forwardRef<HTMLDivElement, DataTableProps<any>>(
  function DataTable(
    {
      data = [],
      columns = [],
      loading = false,
      loaderSpan = columns.length,
      totalPages = 0,
      currentPage = 0,
      onPageChange = () => {},
      pageSize: _pageSize = 10,
      setPageSize: _setPageSize = () => {},
      pageSizeOptions: _pageSizeOptions = [10, 20, 30, 50, 100],
      onPageSizeChange: _onPageSizeChange = () => {},
      isPagination = false,
      customHeight = "",
      tableContainerClassName = "",
    },
    ref,
  ) {
    const table = useReactTable({
      data,
      columns: columns.map((col) => ({
        enableColumnFilter: false,
        ...col,
      })),
      getCoreRowModel: getCoreRowModel(),
    });

    return (
      <div
        ref={ref}
        className={clsx(
          "shadow-md rounded-lg flex flex-col min-h-0 overflow-hidden",
          loading || !totalPages || !isPagination
            ? "h-full"
            : customHeight || "h-full",
        )}
      >
        <div className="border-gray-500 flex flex-col min-h-0 flex-1 overflow-hidden">
          <div
            className={clsx(
              "w-full overflow-x-auto overflow-y-auto custom-scrollbar flex-1 min-h-0",
              tableContainerClassName ||
                (isPagination ? "max-h-[calc(100vh-430px)]" : "max-h-[55vh]"),
            )}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => {
                      const isFirstColumn = index === 0;
                      const isLastColumn =
                        index === headerGroup.headers.length - 1;
                      return (
                        <th
                          key={header.id}
                          style={{
                            width: header.getSize(),
                            minWidth: header.column.columnDef.minSize,
                            maxWidth: header.column.columnDef.maxSize,
                          }}
                          className={`sticky top-0 z-10 py-5 font-inter text-sm font-medium leading-4 text-left text-black tracking-wider bg-[#ffedd4] ${
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : ""
                          } ${
                            isFirstColumn ? "rounded-tl-md px-6" : "pl-4"
                          } ${isLastColumn ? "rounded-tr-md" : ""}`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className="flex gap-1 items-center whitespace-nowrap">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {header.column.getCanSort() && (
                              <span className="transition-colors">
                                {{
                                  asc: (
                                    <ChevronUp
                                      className="text-primary"
                                      height={14}
                                      width={14}
                                    />
                                  ),
                                  desc: (
                                    <ChevronDown
                                      className="text-primary"
                                      height={14}
                                      width={14}
                                    />
                                  ),
                                }[
                                  header.column.getIsSorted() as "asc" | "desc"
                                ] ?? <ArrowDownUp height={14} width={14} />}
                              </span>
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={loaderSpan}
                      className="font-inter text-sm font-semibold  leading-4 text-black text-center py-[15%]"
                    >
                      <LoaderCircle height={50} width={50} className="animate-spin m-auto" />
                    </td>
                  </tr>
                ) : data.length ? (
                  table.getRowModel().rows.map((row, index) => {
                    const isLastRow =
                      index === table.getRowModel().rows.length - 1;
                    return (
                      <tr key={row.id} className={clsx("hover:bg-gray-50")}>
                        {row.getVisibleCells().map((cell, index) => {
                          const isFirstColumn = index === 0;
                          const isLastColumn =
                            index === row.getVisibleCells().length - 1;

                          return (
                            <td
                              key={cell.id}
                              className={clsx(
                                "py-4 font-inter text-sm font-normal leading-5 text-left text-black",
                                (cell.column.columnDef as any).cellClassName ||
                                  "max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap",
                                index === 0 ? "px-6" : "px-4",
                                isLastRow && isFirstColumn && "rounded-bl-lg",
                                isLastRow && isLastColumn && "rounded-br-lg",
                              )}
                              style={{
                                width: cell.column.getSize(),
                                maxWidth: cell.column.getSize(),
                                minWidth: cell.column.getSize(),
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={loaderSpan}
                      className="font-inter text-lg leading-4 text-black text-center p-[200px]"
                    >
                      No data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {totalPages && isPagination ? (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
            isLoading={loading}
          />
        ) : null}
      </div>
    );
  },
);

export default DataTable;

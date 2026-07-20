import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  // Option to hide on mobile if it renders table
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  emptyMessage?: string;
  loading?: boolean;
  pageSize?: number;
  onRowClick?: (item: T) => void;
  // Custom mobile card renderer (required for premium mobile visual cards)
  renderMobileCard?: (item: T) => React.ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  searchFilter,
  emptyMessage = 'No items found.',
  loading = false,
  pageSize = 5,
  onRowClick,
  renderMobileCard,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data
  const filteredData = searchFilter && searchQuery
    ? data.filter((item) => searchFilter(item, searchQuery))
    : data;

  // Paginate data
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters bar */}
      {searchFilter && (
        <div className="relative flex max-w-sm items-center">
          <Search className="absolute left-3 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // reset to page 1
            }}
            className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:border-blue-500"
          />
        </div>
      )}

      {/* Loading state skeleton */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(pageSize)].map((_, i) => (
            <div key={i} className="h-12 w-full animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
          ))}
        </div>
      ) : paginatedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 py-12 text-center dark:border-neutral-800">
          <Inbox className="h-10 w-10 text-neutral-300 dark:text-neutral-700" />
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{emptyMessage}</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#13141b]">
            <table className="w-full border-collapse text-left text-sm text-neutral-600 dark:text-neutral-300">
              <thead className="bg-neutral-50 text-xs font-semibold text-neutral-500 uppercase tracking-wider dark:bg-[#1a1c23] dark:text-neutral-400">
                <tr>
                  {columns.map((col, idx) => (
                    <th key={idx} className="px-6 py-4">
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {paginatedData.map((item, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onRowClick?.(item)}
                    className={`transition-colors ${
                      onRowClick ? 'cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/40' : ''
                    }`}
                  >
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className="px-6 py-4 font-medium text-neutral-900 dark:text-white">
                        {col.accessor(item)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="block md:hidden space-y-4">
            {paginatedData.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onRowClick?.(item)}
                className={`rounded-xl border border-neutral-200 bg-white p-4 shadow-sm active:bg-neutral-50 dark:border-neutral-800 dark:bg-[#13141b] dark:active:bg-neutral-800 ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {renderMobileCard ? (
                  renderMobileCard(item)
                ) : (
                  <div className="space-y-2">
                    {columns.map((col, colIdx) => (
                      <div key={colIdx} className="flex justify-between text-sm">
                        <span className="font-medium text-neutral-500">{col.header}:</span>
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          {col.accessor(item)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
              <span className="text-xs text-neutral-500">
                Showing {startIndex + 1} to {Math.min(filteredData.length, startIndex + pageSize)} of {filteredData.length} entries
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-md border border-neutral-200 p-1.5 hover:bg-neutral-50 disabled:opacity-40 dark:border-neutral-800 dark:hover:bg-neutral-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-3 text-sm text-neutral-700 dark:text-neutral-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-md border border-neutral-200 p-1.5 hover:bg-neutral-50 disabled:opacity-40 dark:border-neutral-800 dark:hover:bg-neutral-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

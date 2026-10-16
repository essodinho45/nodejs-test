import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ filters, total, onPageChange, t }) {
  const isFirstPage = filters.page === 1;
  const isLastPage = filters.page * filters.limit >= total || total === 0;

  return (
    <div className="flex items-center justify-between mt-6 pt-2">
      <button 
        disabled={isFirstPage} 
        onClick={() => onPageChange(filters.page - 1)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700/80 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-40 disabled:pointer-events-none active:scale-95 transition-all cursor-pointer shadow-2xs"
      >
        <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
        <span>{t.previous}</span>
      </button>

      <span className="text-sm text-gray-600 dark:text-gray-400">
        {t.page}{' '}
        <span className="font-semibold text-gray-900 dark:text-white px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md">
          {filters.page}
        </span>{' '}
        <span className="text-gray-400 dark:text-gray-500 mx-1">•</span>
        {t.total}: <span className="font-semibold text-gray-900 dark:text-white">{total}</span>
      </span>

      <button 
        disabled={isLastPage}
        onClick={() => onPageChange(filters.page + 1)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700/80 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-40 disabled:pointer-events-none active:scale-95 transition-all cursor-pointer shadow-2xs"
      >
        <span>{t.next}</span>
        <ChevronRight className="w-4 h-4 rtl:rotate-180" />
      </button>
    </div>
  );
}
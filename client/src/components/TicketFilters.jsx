import { Search, ListFilter, X } from 'lucide-react';

export default function TicketFilters({ filters, onChange, t }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3.5 mb-6">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-gray-400 dark:text-gray-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input 
          value={filters.q} 
          onChange={e => onChange({ q: e.target.value })} 
          placeholder={t.searchPlaceholder} 
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/80 ps-10 pe-9 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
        />
        {filters.q && (
          <button
            type="button"
            onClick={() => onChange({ q: '' })}
            aria-label="Clear search"
            className="absolute end-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="relative sm:w-52">
        <ListFilter className="w-4 h-4 text-gray-400 dark:text-gray-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <select 
          value={filters.status} 
          onChange={e => onChange({ status: e.target.value })}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/80 ps-10 pe-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer"
        >
          <option value="">{t.allStatuses}</option>
          <option value="open">{t.open}</option>
          <option value="in_progress">{t.inProgress}</option>
          <option value="closed">{t.closed}</option>
        </select>
      </div>

    </div>
  );
}
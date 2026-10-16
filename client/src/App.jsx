import { useState, useEffect } from 'react';
import { useTickets } from './hooks/useTickets';

// 1. Translation Dictionary
const translations = {
  en: {
    title: "Support Tickets",
    newTicket: "Create New Ticket",
    placeholder: "What needs to be fixed?",
    low: "Low Priority",
    medium: "Medium Priority",
    high: "High Priority",
    create: "Create",
    searchPlaceholder: "Search tickets...",
    allStatuses: "All Statuses",
    open: "Open",
    inProgress: "In Progress",
    closed: "Closed",
    loading: "Loading tickets...",
    noTickets: "No tickets found.",
    previous: "Previous",
    next: "Next",
    page: "Page",
    total: "Total",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    errorLength: "Title must be at least 3 characters"
  },
  ar: {
    title: "تذاكر الدعم",
    newTicket: "إنشاء تذكرة جديدة",
    placeholder: "ما الذي يحتاج إلى إصلاح؟",
    low: "أولوية منخفضة",
    medium: "أولوية متوسطة",
    high: "أولوية عالية",
    create: "إنشاء",
    searchPlaceholder: "البحث في التذاكر...",
    allStatuses: "جميع الحالات",
    open: "مفتوح",
    inProgress: "قيد التنفيذ",
    closed: "مغلق",
    loading: "جاري تحميل التذاكر...",
    noTickets: "لم يتم العثور على تذاكر.",
    previous: "السابق",
    next: "التالي",
    page: "صفحة",
    total: "الإجمالي",
    darkMode: "الوضع الداكن",
    lightMode: "الوضع الفاتح",
    errorLength: "يجب أن يتكون العنوان من 3 أحرف على الأقل"
  }
};

export default function App() {
  // UI State
  const [lang, setLang] = useState('en');
  const [isDark, setIsDark] = useState(false); // Defaults to Light Mode
  
  const [filters, setFilters] = useState({ page: 1, limit: 10, status: '', q: '' });
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  const { tickets, total, loading, error, updateStatus } = useTickets(filters, refreshTrigger);

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [formError, setFormError] = useState('');

  const t = translations[lang]; // Active translations

  // 2. Side Effects for Dark Mode & RTL Language
  useEffect(() => {
    // Toggle the dark class on the HTML element
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    // Update HTML direction and language attributes for accessibility and layout
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const handleSearch = (e) => setFilters(prev => ({ ...prev, q: e.target.value, page: 1 }));
  const handleStatusFilter = (e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.length < 3) {
      setFormError(t.errorLength);
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, priority })
      });

      if (!res.ok) throw new Error('Failed to create ticket');

      setTitle('');
      setFormError('');
      setFilters(prev => ({ ...prev, page: 1 })); 
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };

  return (
    // Note the added dark:bg-gray-900 classes throughout
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
        
        {/* Header & Controls */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {isDark ? t.lightMode : t.darkMode}
            </button>
            <button 
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100"
            >
              {lang === 'en' ? 'عربي' : 'English'}
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* NEW TICKET FORM */}
          <div className="mb-8 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">{t.newTicket}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder={t.placeholder} 
                className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select 
                value={priority} 
                onChange={e => setPriority(e.target.value)}
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">{t.low}</option>
                <option value="medium">{t.medium}</option>
                <option value="high">{t.high}</option>
              </select>
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-md transition-colors text-sm"
              >
                {t.create}
              </button>
            </form>
            {formError && <p className="text-red-600 dark:text-red-400 text-sm mt-2">{formError}</p>}
          </div>

          {/* FILTERS */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input 
              value={filters.q} 
              onChange={handleSearch} 
              placeholder={t.searchPlaceholder} 
              className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select 
              value={filters.status} 
              onChange={handleStatusFilter}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-48"
            >
              <option value="">{t.allStatuses}</option>
              <option value="open">{t.open}</option>
              <option value="in_progress">{t.inProgress}</option>
              <option value="closed">{t.closed}</option>
            </select>
          </div>

          {/* LIST */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            {loading && <div className="p-8 text-center text-gray-500 dark:text-gray-400">{t.loading}</div>}
            {error && <div className="p-8 text-center text-red-500 dark:text-red-400">{error}</div>}
            {!loading && tickets.length === 0 && <div className="p-8 text-center text-gray-500 dark:text-gray-400">{t.noTickets}</div>}

            <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {tickets.map(ticket => (
                <li key={ticket.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-md font-medium text-gray-900 dark:text-gray-100">{ticket.title}</span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${priorityColors[ticket.priority]}`}>
                        {t[ticket.priority]}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">ID: {ticket.id.slice(0, 8)}</span>
                    </div>
                  </div>
                  
                  <select 
                    value={ticket.status} 
                    onChange={e => updateStatus(ticket.id, e.target.value)}
                    className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                  >
                    <option value="open">{t.open}</option>
                    <option value="in_progress">{t.inProgress}</option>
                    <option value="closed">{t.closed}</option>
                  </select>
                </li>
              ))}
            </ul>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between mt-6">
            <button 
              disabled={filters.page === 1} 
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t.previous}
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t.page} <span className="font-medium text-gray-900 dark:text-white">{filters.page}</span> ({t.total}: {total})
            </span>
            <button 
              disabled={filters.page * filters.limit >= total || total === 0}
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t.next}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
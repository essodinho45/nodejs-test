import { useState, useEffect } from 'react';
import { useTickets } from './hooks/useTickets';
import Header from './components/Header';
import TicketForm from './components/TicketForm';
import TicketFilters from './components/TicketFilters';
import TicketList from './components/TicketList';
import Pagination from './components/Pagination';
import { translations } from './translations';

export default function App() {
  const [lang, setLang] = useState('en');
  const [isDark, setIsDark] = useState(false);
  const [filters, setFilters] = useState({ page: 1, limit: 5, status: '', q: '' });
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  
  const { tickets, total, loading, error, updateStatus } = useTickets(filters, refreshTrigger);
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [isDark, lang]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/tickets/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete ticket');

      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-200/80 dark:border-gray-700/80 overflow-hidden transition-colors duration-200">
        
        <Header 
          isDark={isDark} 
          onToggleDark={() => setIsDark(prev => !prev)}
          lang={lang}
          onToggleLang={() => setLang(prev => (prev === 'en' ? 'ar' : 'en'))}
          t={t}
        />

        <main className="p-6">
          <TicketForm 
            onSuccess={() => { 
              setFilters(prev => ({ ...prev, page: 1 })); 
              setRefreshTrigger(prev => prev + 1); 
            }} 
            t={t} 
          />
          
          <TicketFilters 
            filters={filters} 
            onChange={newFilters => setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))} 
            t={t} 
          />

          <div className="border border-gray-200/80 dark:border-gray-700/80 rounded-xl overflow-hidden shadow-2xs">
            <TicketList 
              tickets={tickets} 
              loading={loading} 
              error={error} 
              updateStatus={updateStatus} 
              onDelete={handleDelete} 
              t={t} 
            />
          </div>

          <Pagination 
            filters={filters} 
            total={total} 
            onPageChange={page => setFilters(prev => ({ ...prev, page }))} 
            t={t} 
          />
        </main>

      </div>
    </div>
  );
}
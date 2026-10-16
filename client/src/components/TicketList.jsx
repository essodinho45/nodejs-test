import { Loader2, AlertTriangle, Inbox } from 'lucide-react';
import TicketItem from './TicketItem';

export default function TicketList({ tickets, loading, error, updateStatus, onDelete, t }) {
  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mb-3" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-center bg-red-50/50 dark:bg-red-950/20">
        <div className="p-3 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800">
        <div className="p-3.5 bg-gray-100 dark:bg-gray-700/60 text-gray-400 dark:text-gray-500 rounded-full mb-3">
          <Inbox className="w-7 h-7" />
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.noTickets}</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200/80 dark:divide-gray-700/80 bg-white dark:bg-gray-800">
      {tickets.map(ticket => (
        <TicketItem 
          key={ticket.id} 
          ticket={ticket} 
          updateStatus={updateStatus} 
          onDelete={onDelete} 
          t={t} 
        />
      ))}
    </ul>
  );
}
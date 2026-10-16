import { useState } from 'react';
import { Plus, AlertCircle, Loader2, Sparkles } from 'lucide-react';

export default function TicketForm({ onSuccess, t }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim().length < 3) {
      setFormError(t.errorLength);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:3000/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), priority })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Failed to create ticket');
      }

      setTitle('');
      setFormError('');
      onSuccess();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-8 bg-gray-50/80 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-200/80 dark:border-gray-700/80 shadow-2xs">
      <div className="flex items-center gap-2 mb-3.5">
        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          {t.newTicket}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input 
          value={title} 
          onChange={e => {
            setTitle(e.target.value);
            if (formError) setFormError('');
          }} 
          placeholder={t.placeholder} 
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/80 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
        />
        
        <select 
          value={priority} 
          onChange={e => setPriority(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/80 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer"
        >
          <option value="low">{t.low}</option>
          <option value="medium">{t.medium}</option>
          <option value="high">{t.high}</option>
        </select>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 px-5 rounded-lg active:scale-95 transition-all text-sm cursor-pointer shadow-xs shadow-blue-600/20"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <span>{t.create}</span>
        </button>
      </form>

      {formError && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-xs font-medium mt-3 bg-red-50 dark:bg-red-950/40 px-3 py-2 rounded-lg border border-red-200 dark:border-red-900/50">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}
    </div>
  );
}
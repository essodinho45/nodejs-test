import { CircleDot, Clock, CheckCircle2, Flame, Minus, ArrowDown, Hash, Trash2 } from 'lucide-react';

export default function TicketItem({ ticket, updateStatus, onDelete, t }) {
  const priorityConfig = {
    low: {
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/60',
      Icon: ArrowDown
    },
    medium: {
      classes: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800/60',
      Icon: Minus
    },
    high: {
      classes: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800/60',
      Icon: Flame
    }
  };

  const statusConfig = {
    open: { Icon: CircleDot, iconColor: 'text-blue-500 dark:text-blue-400' },
    in_progress: { Icon: Clock, iconColor: 'text-amber-500 dark:text-amber-400' },
    closed: { Icon: CheckCircle2, iconColor: 'text-emerald-500 dark:text-emerald-400' }
  };

  const { classes: priorityClasses, Icon: PriorityIcon } = priorityConfig[ticket.priority] || priorityConfig.medium;
  const { Icon: StatusIcon, iconColor } = statusConfig[ticket.status] || statusConfig.open;

  return (
    <li className="p-4 sm:px-5 hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
      
      {/* Left Side: Status Icon + Title + Badges */}
      <div className="flex items-start gap-3.5">
        <div className={`mt-1 shrink-0 ${iconColor}`}>
          <StatusIcon className="w-5 h-5" />
        </div>

        <div className="flex flex-col">
          <span className={`text-base font-medium transition-all ${ticket.status === 'closed' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
            {ticket.title}
          </span>
          
          <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${priorityClasses}`}>
              <PriorityIcon className="w-3 h-3" />
              <span>{t[ticket.priority]}</span>
            </span>

            <span className="inline-flex items-center gap-0.5 text-xs text-gray-400 dark:text-gray-500 font-mono bg-gray-100 dark:bg-gray-700/60 px-2 py-0.5 rounded-md">
              <Hash className="w-3 h-3" />
              {ticket.id.slice(0, 8)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Right Side: Status Selector & Delete Button */}
      <div className="flex items-center gap-2.5 self-end sm:self-center w-full sm:w-auto">
        <select 
          value={ticket.status} 
          onChange={e => updateStatus(ticket.id, e.target.value)}
          className="w-full sm:w-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
        >
          <option value="open">{t.open}</option>
          <option value="in_progress">{t.inProgress}</option>
          <option value="closed">{t.closed}</option>
        </select>

        <button
          type="button"
          onClick={() => onDelete(ticket.id)}
          aria-label="Delete ticket"
          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </li>
  );
}
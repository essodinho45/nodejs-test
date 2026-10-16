import { Ticket, Sun, Moon, Globe } from 'lucide-react';

export default function Header({ isDark, onToggleDark, lang, onToggleLang, t }) {
  return (
    <header className="px-6 py-5 border-b border-gray-200/80 dark:border-gray-700/80 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-xl shadow-sm shadow-blue-500/20 flex items-center justify-center">
          <Ticket className="w-6 h-6"/>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t.title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2.5 self-end sm:self-auto">
        <button
          onClick={onToggleDark}
          type="button"
          aria-label="Toggle Theme"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all cursor-pointer shadow-2xs"
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400"/>
              <span>{t.lightMode}</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600"/>
              <span>{t.darkMode}</span>
            </>
          )}
        </button>

        <button
          onClick={onToggleLang}
          type="button"
          aria-label="Toggle Language"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg border border-blue-200 dark:border-blue-800/60 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 active:scale-95 transition-all cursor-pointer shadow-2xs"
        >
          <Globe className="w-4 h-4"/>
          <span>{lang === 'en' ? 'عربي' : 'English'}</span>
        </button>

      </div>
    </header>
  );
}
import { useTranslation } from 'react-i18next';
import { AppLayout } from '../layouts/AppLayout';
import { useThemeStore } from '../store/useThemeStore';
import { changeLanguage } from '../i18n/config';
import { Sun, Moon, Globe } from 'lucide-react';
import { cn } from '../lib/cn';

export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();

  const handleLanguageChange = (lang: 'fa' | 'en') => {
    changeLanguage(lang);
  };

  return (
    <AppLayout currentPage="settings">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {t('settings.title')}
        </h2>
      </div>

      <div className="space-y-6">
        {/* Theme Section */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {t('settings.theme')}
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => theme === 'dark' && toggleTheme()}
              className={cn(
                'flex items-center gap-3 rounded-xl border-2 px-5 py-3 transition-colors',
                theme === 'light'
                  ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                  : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
              )}
            >
              <Sun className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {t('settings.lightMode')}
              </span>
            </button>
            <button
              onClick={() => theme === 'light' && toggleTheme()}
              className={cn(
                'flex items-center gap-3 rounded-xl border-2 px-5 py-3 transition-colors',
                theme === 'dark'
                  ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                  : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
              )}
            >
              <Moon className="h-5 w-5 text-indigo-500" />
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {t('settings.darkMode')}
              </span>
            </button>
          </div>
        </div>

        {/* Language Section */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {t('settings.language')}
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => handleLanguageChange('fa')}
              className={cn(
                'flex items-center gap-3 rounded-xl border-2 px-5 py-3 transition-colors',
                i18n.language === 'fa'
                  ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                  : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
              )}
            >
              <Globe className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {t('settings.persian')}
              </span>
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={cn(
                'flex items-center gap-3 rounded-xl border-2 px-5 py-3 transition-colors',
                i18n.language === 'en'
                  ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                  : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
              )}
            >
              <Globe className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {t('settings.english')}
              </span>
            </button>
          </div>
        </div>

        {/* Account Section */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {t('nav.profile')}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('app.description')}
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

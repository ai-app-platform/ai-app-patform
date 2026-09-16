import { cn } from '../lib/cn';
import { useThemeStore } from '../store/useThemeStore';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n/config';
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  Settings,
  Sun,
  Moon,
  Menu,
  X,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useAuthStore } from '../store/useAuthStore';

interface AppLayoutProps {
  children: ReactNode;
  currentPage?: string;
}

interface NavItem {
  key: string;
  icon: ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { key: 'dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/' },
  { key: 'projects', icon: <FolderKanban className="h-5 w-5" />, path: '/projects' },
  { key: 'templates', icon: <Layers className="h-5 w-5" />, path: '/templates' },
  { key: 'settings', icon: <Settings className="h-5 w-5" />, path: '/settings' },
];

export function AppLayout({ children, currentPage = 'dashboard' }: AppLayoutProps) {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLanguageChange = () => {
    const newLang = i18n.language === 'fa' ? 'en' : 'fa';
    changeLanguage(newLang);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-72 flex-shrink-0 border-e border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 lg:flex lg:flex-col">
        <SidebarContent
          currentPage={currentPage}
          user={user}
          t={t}
          logout={logout}
        />
      </aside>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 end-0 w-72 bg-white shadow-xl dark:bg-slate-900 rtl:right-0 ltr:left-0"
            style={{ [i18n.language === 'fa' ? 'right' : 'left']: 0 }}
          >
            <SidebarContent
              currentPage={currentPage}
              user={user}
              t={t}
              logout={logout}
              onClose={() => setSidebarOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-900 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t(`nav.${currentPage}`)}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={handleLanguageChange}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {i18n.language === 'fa' ? 'EN' : 'فا'}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

interface SidebarContentProps {
  currentPage: string;
  user: { name: string; email: string } | null;
  t: (key: string) => string;
  logout: () => void;
  onClose?: () => void;
}

function SidebarContent({ currentPage, user, t, logout, onClose }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 dark:bg-teal-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {t('app.name')}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* User Box */}
      {user && (
        <div className="mx-4 mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
              <User className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                {user.name}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="mt-4 flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <a
            key={item.key}
            href={item.path}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              currentPage === item.key
                ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
            )}
          >
            {item.icon}
            <span>{t(`nav.${item.key}`)}</span>
          </a>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-200 p-3 dark:border-slate-700">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-red-400"
        >
          <LogOut className="h-5 w-5" />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from './store/useThemeStore';
import { changeLanguage } from './i18n/config';
import { cn } from './lib/cn';
import {
  LayoutDashboard,
  Plug,
  Layers,
  Settings,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  User,
  LogOut,
  Plus,
  Search,
  MoreHorizontal,
  Github,
  Gitlab,
  Slack,
  Database,
  Globe,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Shield,
  Zap,
  ExternalLink,
} from 'lucide-react';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Modal } from './components/ui/Modal';
import { Badge } from './components/ui/Badge';

// Types
interface Connector {
  id: string;
  name: string;
  provider: string;
  type: 'git' | 'issue_tracker' | 'messaging' | 'storage' | 'database' | 'api';
  status: 'active' | 'connected' | 'disabled' | 'error';
  adapter: 'mcp' | 'rest' | 'sdk' | 'native';
  capabilities: string[];
  permissions: string[];
  config: Record<string, string>;
  createdAt: string;
}

// Mock Data
const mockConnectors: Connector[] = [
  {
    id: '1',
    name: 'GitHub Main Repository',
    provider: 'GitHub',
    type: 'git',
    status: 'active',
    adapter: 'mcp',
    capabilities: ['repository.read', 'file.read', 'branch.read', 'commit.read', 'push'],
    permissions: ['repository.read', 'file.read', 'branch.read', 'commit.read', 'push'],
    config: { repository: 'company/main-app', branch: 'main' },
    createdAt: '۱۴۰۳/۰۹/۱۵',
  },
  {
    id: '2',
    name: 'GitLab CI/CD',
    provider: 'GitLab',
    type: 'git',
    status: 'connected',
    adapter: 'rest',
    capabilities: ['repository.read', 'pipeline.read', 'pipeline.trigger'],
    permissions: ['repository.read', 'pipeline.read'],
    config: { project: 'company/backend', branch: 'develop' },
    createdAt: '۱۴۰۳/۰۹/۱۴',
  },
  {
    id: '3',
    name: 'Jira Project Board',
    provider: 'Jira',
    type: 'issue_tracker',
    status: 'active',
    adapter: 'sdk',
    capabilities: ['issue.read', 'issue.create', 'issue.update', 'sprint.read'],
    permissions: ['issue.read', 'issue.create', 'issue.update'],
    config: { project: 'PROJ', board: 'Scrum Board' },
    createdAt: '۱۴۰۳/۰۹/۱۲',
  },
  {
    id: '4',
    name: 'Slack Notifications',
    provider: 'Slack',
    type: 'messaging',
    status: 'active',
    adapter: 'sdk',
    capabilities: ['message.send', 'channel.read', 'user.read'],
    permissions: ['message.send', 'channel.read'],
    config: { channel: '#dev-notifications', workspace: 'company-workspace' },
    createdAt: '۱۴۰۳/۰۹/۱۰',
  },
  {
    id: '5',
    name: 'PostgreSQL Database',
    provider: 'PostgreSQL',
    type: 'database',
    status: 'error',
    adapter: 'native',
    capabilities: ['query.read', 'query.write', 'schema.read'],
    permissions: ['query.read', 'schema.read'],
    config: { host: 'db.example.com', database: 'production' },
    createdAt: '۱۴۰۳/۰۹/۰۸',
  },
  {
    id: '6',
    name: 'Google Drive Storage',
    provider: 'Google Drive',
    type: 'storage',
    status: 'disabled',
    adapter: 'sdk',
    capabilities: ['file.read', 'file.write', 'folder.read'],
    permissions: ['file.read'],
    config: { folder: 'Project Documents', shared: 'true' },
    createdAt: '۱۴۰۳/۰۹/۰۵',
  },
];

function App() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('connectors');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [connectors] = useState<Connector[]>(mockConnectors);

  const handleLanguageChange = () => {
    const newLang = i18n.language === 'fa' ? 'en' : 'fa';
    changeLanguage(newLang);
  };

  const navItems = [
    { key: 'dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { key: 'connectors', icon: <Plug className="h-5 w-5" /> },
    { key: 'templates', icon: <Layers className="h-5 w-5" /> },
    { key: 'settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const filteredConnectors = connectors.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'github':
        return <Github className="h-6 w-6" />;
      case 'gitlab':
        return <Gitlab className="h-6 w-6" />;
      case 'slack':
        return <Slack className="h-6 w-6" />;
      case 'postgresql':
      case 'database':
        return <Database className="h-6 w-6" />;
      default:
        return <Globe className="h-6 w-6" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="success">
            <CheckCircle2 className="ms-1 h-3 w-3" />
            فعال
          </Badge>
        );
      case 'connected':
        return (
          <Badge variant="info">
            <CheckCircle2 className="ms-1 h-3 w-3" />
            متصل
          </Badge>
        );
      case 'disabled':
        return (
          <Badge variant="muted">
            <XCircle className="ms-1 h-3 w-3" />
            غیرفعال
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="danger">
            <AlertCircle className="ms-1 h-3 w-3" />
            خطا
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-72 flex-shrink-0 border-e border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 lg:flex lg:flex-col">
        <SidebarContent
          navItems={navItems}
          currentPage={currentPage}
          onNavClick={setCurrentPage}
          t={t}
        />
      </aside>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 end-0 w-72 bg-white shadow-xl dark:bg-slate-900">
            <SidebarContent
              navItems={navItems}
              currentPage={currentPage}
              onNavClick={(page) => {
                setCurrentPage(page);
                setSidebarOpen(false);
              }}
              t={t}
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
              {currentPage === 'connectors' ? 'مدیریت کانکتورها' : t(`nav.${currentPage}`)}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLanguageChange}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {i18n.language === 'fa' ? 'EN' : 'فا'}
            </button>
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
          <div className="mx-auto max-w-7xl">
            {/* Header Section */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  مدیریت کانکتورها
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {filteredConnectors.length} کانکتور فعال
                </p>
              </div>
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4" />
                ایجاد کانکتور جدید
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="جستجوی کانکتور..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-3 pe-10"
                />
              </div>
            </div>

            {/* Connectors Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredConnectors.map((connector) => (
                <div
                  key={connector.id}
                  className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                >
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400">
                        {getProviderIcon(connector.provider)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                          {connector.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {connector.provider} • {connector.adapter.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <button className="rounded-lg p-1 text-slate-400 opacity-0 transition-opacity hover:bg-slate-100 group-hover:opacity-100 dark:hover:bg-slate-800">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Status */}
                  <div className="mb-4">{getStatusBadge(connector.status)}</div>

                  {/* Capabilities */}
                  <div className="mb-4">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                      <Zap className="h-3.5 w-3.5" />
                      <span>قابلیت‌ها</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {connector.capabilities.slice(0, 3).map((cap, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {cap}
                        </span>
                      ))}
                      {connector.capabilities.length > 3 && (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          +{connector.capabilities.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="mb-4">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                      <Shield className="h-3.5 w-3.5" />
                      <span>دسترسی‌ها</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {connector.permissions.slice(0, 2).map((perm, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                        >
                          {perm}
                        </span>
                      ))}
                      {connector.permissions.length > 2 && (
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-500 dark:bg-blue-900/20 dark:text-blue-400">
                          +{connector.permissions.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {connector.createdAt}
                    </span>
                    <button className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300">
                      <ExternalLink className="h-3 w-3" />
                      <span>جزئیات</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Create Connector Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="ایجاد کانکتور جدید"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              انصراف
            </Button>
            <Button variant="primary">ایجاد کانکتور</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="نام کانکتور" placeholder="مثلاً: GitHub Main Repository" />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Provider
            </label>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
              <option>GitHub</option>
              <option>GitLab</option>
              <option>Bitbucket</option>
              <option>Jira</option>
              <option>Slack</option>
              <option>Google Drive</option>
              <option>PostgreSQL</option>
              <option>Custom API</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Adapter Type
            </label>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
              <option>MCP</option>
              <option>REST API</option>
              <option>SDK</option>
              <option>Native</option>
            </select>
          </div>
          <Input label="Credential Reference" placeholder="secret/github/project-123" />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Configuration
            </label>
            <textarea
              rows={4}
              placeholder='{"repository": "company/repo", "branch": "main"}'
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

interface SidebarContentProps {
  navItems: Array<{ key: string; icon: React.ReactNode }>;
  currentPage: string;
  onNavClick: (page: string) => void;
  t: (key: string) => string;
  onClose?: () => void;
}

function SidebarContent({ navItems, currentPage, onNavClick, t, onClose }: SidebarContentProps) {
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
      <div className="mx-4 mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
            <User className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
              کاربر مهمان
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              guest@example.com
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavClick(item.key)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              currentPage === item.key
                ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
            )}
          >
            {item.icon}
            <span>
              {item.key === 'connectors' ? 'کانکتورها' : t(`nav.${item.key}`)}
            </span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-200 p-3 dark:border-slate-700">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-red-400">
          <LogOut className="h-5 w-5" />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </div>
  );
}

export default App;

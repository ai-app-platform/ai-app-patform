import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from './store/useThemeStore';
import { changeLanguage } from './i18n/config';
import { cn } from './lib/cn';
import {
  LayoutDashboard,
  Plug,
  Wrench,
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
  Code,
  Play,
  Eye,
  Edit,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
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

interface Tool {
  id: string;
  name: string;
  displayName: string;
  description: string;
  type: 'HTTP' | 'INTERNAL' | 'MCP' | 'DATABASE';
  status: 'active' | 'draft' | 'disabled' | 'deprecated';
  version: string;
  inputSchema: any;
  outputSchema?: any;
  executionConfig: any;
  authentication?: any;
  timeout: number;
  retry: number;
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

const mockTools: Tool[] = [
  {
    id: '1',
    name: 'search_customer',
    displayName: 'جستجوی مشتری',
    description: 'جستجوی مشتری بر اساس ایمیل',
    type: 'HTTP',
    status: 'active',
    version: 'v1.0.0',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'ایمیل مشتری' }
      },
      required: ['email']
    },
    executionConfig: {
      method: 'GET',
      url: 'https://api.example.com/customers',
      queryParams: ['email']
    },
    authentication: { type: 'API_KEY', credentialRef: 'customer-api-key' },
    timeout: 10000,
    retry: 2,
    createdAt: '۱۴۰۳/۰۹/۱۵',
  },
  {
    id: '2',
    name: 'create_order',
    displayName: 'ایجاد سفارش',
    description: 'ایجاد سفارش جدید برای مشتری',
    type: 'HTTP',
    status: 'active',
    version: 'v1.0.0',
    inputSchema: {
      type: 'object',
      properties: {
        customerId: { type: 'string', description: 'شناسه مشتری' },
        productId: { type: 'string', description: 'شناسه محصول' },
        quantity: { type: 'integer', description: 'تعداد' }
      },
      required: ['customerId', 'productId']
    },
    executionConfig: {
      method: 'POST',
      url: 'https://api.example.com/orders',
      headers: { 'Content-Type': 'application/json' }
    },
    authentication: { type: 'BEARER_TOKEN', credentialRef: 'orders-api-token' },
    timeout: 15000,
    retry: 3,
    createdAt: '۱۴۰۳/۰۹/۱۴',
  },
  {
    id: '3',
    name: 'send_notification',
    displayName: 'ارسال اعلان',
    description: 'ارسال اعلان به کاربر از طریق Slack',
    type: 'INTERNAL',
    status: 'active',
    version: 'v2.0.0',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'شناسه کاربر' },
        message: { type: 'string', description: 'متن پیام' },
        channel: { type: 'string', description: 'کانال مقصد' }
      },
      required: ['userId', 'message']
    },
    executionConfig: {
      implementation: 'SlackNotificationService'
    },
    timeout: 5000,
    retry: 1,
    createdAt: '۱۴۰۳/۰۹/۱۲',
  },
  {
    id: '4',
    name: 'get_product_details',
    displayName: 'دریافت جزئیات محصول',
    description: 'دریافت اطلاعات کامل یک محصول',
    type: 'HTTP',
    status: 'draft',
    version: 'v1.0.0',
    inputSchema: {
      type: 'object',
      properties: {
        productId: { type: 'string', description: 'شناسه محصول' }
      },
      required: ['productId']
    },
    executionConfig: {
      method: 'GET',
      url: 'https://api.example.com/products/{productId}'
    },
    timeout: 8000,
    retry: 2,
    createdAt: '۱۴۰۳/۰۹/۱۰',
  },
];

function App() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('tools');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateConnectorModal, setShowCreateConnectorModal] = useState(false);
  const [showCreateToolModal, setShowCreateToolModal] = useState(false);
  const [connectors] = useState<Connector[]>(mockConnectors);
  const [tools] = useState<Tool[]>(mockTools);

  const handleLanguageChange = () => {
    const newLang = i18n.language === 'fa' ? 'en' : 'fa';
    changeLanguage(newLang);
  };

  const navItems = [
    { key: 'dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { key: 'connectors', icon: <Plug className="h-5 w-5" /> },
    { key: 'tools', icon: <Wrench className="h-5 w-5" /> },
    { key: 'templates', icon: <Layers className="h-5 w-5" /> },
    { key: 'settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const filteredConnectors = connectors.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTools = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.displayName.toLowerCase().includes(searchQuery.toLowerCase())
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
      case 'draft':
        return (
          <Badge variant="warning">
            <Edit className="ms-1 h-3 w-3" />
            پیش‌نویس
          </Badge>
        );
      case 'deprecated':
        return (
          <Badge variant="muted">
            <AlertCircle className="ms-1 h-3 w-3" />
            منسوخ
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getToolTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      HTTP: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      INTERNAL: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      MCP: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      DATABASE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    };
    return (
      <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', colors[type] || colors.HTTP)}>
        {type}
      </span>
    );
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
              {currentPage === 'connectors' ? 'مدیریت کانکتورها' : 
               currentPage === 'tools' ? 'مدیریت ابزارها' : 
               t(`nav.${currentPage}`)}
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
            {currentPage === 'connectors' && (
              <ConnectorsPage
                connectors={filteredConnectors}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onCreateClick={() => setShowCreateConnectorModal(true)}
                getProviderIcon={getProviderIcon}
                getStatusBadge={getStatusBadge}
              />
            )}
            {currentPage === 'tools' && (
              <ToolsPage
                tools={filteredTools}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onCreateClick={() => setShowCreateToolModal(true)}
                getStatusBadge={getStatusBadge}
                getToolTypeBadge={getToolTypeBadge}
              />
            )}
          </div>
        </main>
      </div>

      {/* Create Connector Modal */}
      <Modal
        isOpen={showCreateConnectorModal}
        onClose={() => setShowCreateConnectorModal(false)}
        title="ایجاد کانکتور جدید"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowCreateConnectorModal(false)}>
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

      {/* Create Tool Modal */}
      <Modal
        isOpen={showCreateToolModal}
        onClose={() => setShowCreateToolModal(false)}
        title="ایجاد ابزار جدید"
        size="xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowCreateToolModal(false)}>
              انصراف
            </Button>
            <Button variant="secondary">ذخیره و تست</Button>
            <Button variant="primary">ذخیره</Button>
          </>
        }
      >
        <ToolForm />
      </Modal>
    </div>
  );
}

// Connectors Page Component
function ConnectorsPage({ connectors, searchQuery, onSearchChange, onCreateClick, getProviderIcon, getStatusBadge }: any) {
  return (
    <>
      {/* Header Section */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            مدیریت کانکتورها
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {connectors.length} کانکتور فعال
          </p>
        </div>
        <Button variant="primary" onClick={onCreateClick}>
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
            onChange={(e) => onSearchChange(e.target.value)}
            className="ps-3 pe-10"
          />
        </div>
      </div>

      {/* Connectors Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {connectors.map((connector: Connector) => (
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
    </>
  );
}

// Tools Page Component
function ToolsPage({ tools, searchQuery, onSearchChange, onCreateClick, getStatusBadge, getToolTypeBadge }: any) {
  return (
    <>
      {/* Header Section */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            مدیریت ابزارها
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {tools.length} ابزار تعریف شده
          </p>
        </div>
        <Button variant="primary" onClick={onCreateClick}>
          <Plus className="h-4 w-4" />
          ایجاد ابزار جدید
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="جستجوی ابزار..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="ps-3 pe-10"
          />
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool: Tool) => (
          <div
            key={tool.id}
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
          >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                  <Wrench className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {tool.displayName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tool.name} • {tool.version}
                  </p>
                </div>
              </div>
              <button className="rounded-lg p-1 text-slate-400 opacity-0 transition-opacity hover:bg-slate-100 group-hover:opacity-100 dark:hover:bg-slate-800">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* Type and Status */}
            <div className="mb-4 flex items-center gap-2">
              {getToolTypeBadge(tool.type)}
              {getStatusBadge(tool.status)}
            </div>

            {/* Description */}
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {tool.description}
            </p>

            {/* Input Schema Preview */}
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                <Code className="h-3.5 w-3.5" />
                <span>پارامترهای ورودی</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tool.inputSchema?.properties && Object.keys(tool.inputSchema.properties).slice(0, 3).map((param, idx) => (
                  <span
                    key={idx}
                    className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {param}
                  </span>
                ))}
                {tool.inputSchema?.properties && Object.keys(tool.inputSchema.properties).length > 3 && (
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    +{Object.keys(tool.inputSchema.properties).length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Execution Config */}
            {tool.type === 'HTTP' && tool.executionConfig?.method && (
              <div className="mb-4">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                  <Zap className="h-3.5 w-3.5" />
                  <span>پیکربندی اجرا</span>
                </div>
                <div className="rounded-md bg-slate-50 p-2 text-xs dark:bg-slate-800">
                  <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                    {tool.executionConfig.method}
                  </span>
                  <span className="ms-2 text-slate-600 dark:text-slate-400">
                    {tool.executionConfig.url?.substring(0, 30)}...
                  </span>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {tool.createdAt}
              </span>
              <div className="flex items-center gap-2">
                <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-600 dark:hover:bg-slate-800 dark:hover:text-teal-400">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-600 dark:hover:bg-slate-800 dark:hover:text-teal-400">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-600 dark:hover:bg-slate-800 dark:hover:text-teal-400">
                  <Play className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// Tool Form Component
function ToolForm() {
  const [showJsonSchema, setShowJsonSchema] = useState(false);
  const [showTestSection, setShowTestSection] = useState(true);

  return (
    <div className="space-y-6">
      {/* General Information */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          اطلاعات عمومی
        </h3>
        <div className="space-y-4">
          <Input label="نام" placeholder="search_customer" />
          <Input label="نام نمایشی" placeholder="جستجوی مشتری" />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              توضیحات
            </label>
            <textarea
              rows={2}
              placeholder="جستجوی مشتری بر اساس ایمیل"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              نوع
            </label>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
              <option>HTTP</option>
              <option>INTERNAL</option>
              <option>MCP</option>
              <option>DATABASE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Input Schema */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Schema ورودی
        </h3>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">پارامترها</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowJsonSchema(false)}
                  className={cn(
                    'rounded-md px-2 py-1 text-xs',
                    !showJsonSchema ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400'
                  )}
                >
                  Visual Builder
                </button>
                <button
                  onClick={() => setShowJsonSchema(true)}
                  className={cn(
                    'rounded-md px-2 py-1 text-xs',
                    showJsonSchema ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400'
                  )}
                >
                  JSON Schema
                </button>
              </div>
            </div>
          </div>
          <div className="p-4">
            {!showJsonSchema ? (
              <div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="pb-2 text-start font-medium text-slate-700 dark:text-slate-300">نام</th>
                      <th className="pb-2 text-start font-medium text-slate-700 dark:text-slate-300">نوع</th>
                      <th className="pb-2 text-start font-medium text-slate-700 dark:text-slate-300">الزامی</th>
                      <th className="pb-2 text-start font-medium text-slate-700 dark:text-slate-300">پیش‌فرض</th>
                      <th className="pb-2 text-start font-medium text-slate-700 dark:text-slate-300">توضیحات</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-2 font-mono text-sm text-slate-900 dark:text-slate-100">email</td>
                      <td className="py-2 text-slate-600 dark:text-slate-400">string</td>
                      <td className="py-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </td>
                      <td className="py-2 text-slate-400">-</td>
                      <td className="py-2 text-slate-600 dark:text-slate-400">ایمیل مشتری</td>
                    </tr>
                  </tbody>
                </table>
                <Button variant="ghost" size="sm" className="mt-3">
                  <Plus className="h-4 w-4" />
                  افزودن پارامتر
                </Button>
              </div>
            ) : (
              <textarea
                rows={8}
                defaultValue={`{
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "description": "ایمیل مشتری"
    }
  },
  "required": ["email"]
}`}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            )}
          </div>
        </div>
      </div>

      {/* Execution Configuration */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          پیکربندی اجرا
        </h3>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Method
              </label>
              <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>PATCH</option>
                <option>DELETE</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                URL
              </label>
              <Input placeholder="https://api.example.com/customers" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Query Parameters
            </label>
            <Input placeholder="email, status" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Headers
            </label>
            <textarea
              rows={3}
              placeholder='{"Content-Type": "application/json"}'
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Authentication */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          احراز هویت
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              نوع احراز هویت
            </label>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
              <option>API Key</option>
              <option>Bearer Token</option>
              <option>OAuth 2.0</option>
              <option>Basic Auth</option>
              <option>Custom Header</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Credential
            </label>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
              <option>customer-api-key</option>
              <option>orders-api-token</option>
              <option>general-api-key</option>
            </select>
          </div>
        </div>
      </div>

      {/* Runtime Configuration */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          پیکربندی Runtime
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Timeout (ms)
            </label>
            <Input type="number" placeholder="10000" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Retry
            </label>
            <Input type="number" placeholder="2" />
          </div>
        </div>
      </div>

      {/* Access & Availability */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          دسترسی و وضعیت
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              وضعیت
            </label>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
              <option>Enabled</option>
              <option>Disabled</option>
              <option>Draft</option>
              <option>Deprecated</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              قابلیت مشاهده
            </label>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
              <option>Platform</option>
              <option>Project</option>
              <option>Private</option>
            </select>
          </div>
        </div>
      </div>

      {/* Test Tool */}
      <div>
        <button
          onClick={() => setShowTestSection(!showTestSection)}
          className="mb-4 flex w-full items-center justify-between text-lg font-semibold text-slate-900 dark:text-slate-100"
        >
          <span>تست ابزار</span>
          {showTestSection ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        {showTestSection && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Input
              </label>
              <textarea
                rows={5}
                defaultValue={`{
  "email": "john@example.com"
}`}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <Button variant="secondary">
              <Play className="h-4 w-4" />
              تست
            </Button>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Response
              </label>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                <pre className="text-xs text-slate-600 dark:text-slate-400">
                  {`{
  "status": 200,
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
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
              {item.key === 'connectors' ? 'کانکتورها' : 
               item.key === 'tools' ? 'ابزارها' : 
               t(`nav.${item.key}`)}
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

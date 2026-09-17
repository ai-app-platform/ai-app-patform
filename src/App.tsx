import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from './store/useThemeStore';
import { changeLanguage } from './i18n/config';
import { cn } from './lib/cn';
import {
  LayoutDashboard,
  Plug,
  Wrench,
  Bot,
  Users,
  ListTodo,
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
  Circle,
  Clock,
  ArrowRight,
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

interface Agent {
  id: string;
  name: string;
  displayName: string;
  description: string;
  roleName: string;
  roleDisplayName: string;
  status: 'draft' | 'published' | 'deprecated';
  version: string;
  modelConfig?: any;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'planning' | 'running' | 'completed' | 'failed';
  selectionMode: 'automatic' | 'manual' | 'automatic_with_approval';
  selectedAgents?: string[];
  plan?: any;
  executionGraph?: any;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
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
    id: '3',
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
      properties: { email: { type: 'string', description: 'ایمیل مشتری' } },
      required: ['email']
    },
    executionConfig: { method: 'GET', url: 'https://api.example.com/customers' },
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
      },
      required: ['customerId', 'productId']
    },
    executionConfig: { method: 'POST', url: 'https://api.example.com/orders' },
    timeout: 15000,
    retry: 3,
    createdAt: '۱۴۰۳/۰۹/۱۴',
  },
];

const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'architect',
    displayName: 'معمار سیستم',
    description: 'تحلیل معماری و طراحی سیستم',
    roleName: 'architect',
    roleDisplayName: 'معمار',
    status: 'published',
    version: 'v1.2.0',
    createdAt: '۱۴۰۳/۰۹/۱۵',
  },
  {
    id: '2',
    name: 'backend_developer',
    displayName: 'توسعه‌دهنده بک‌اند',
    description: 'پیاده‌سازی سرویس‌ها و APIها',
    roleName: 'backend_developer',
    roleDisplayName: 'توسعه‌دهنده بک‌اند',
    status: 'published',
    version: 'v2.1.0',
    createdAt: '۱۴۰۳/۰۹/۱۴',
  },
  {
    id: '3',
    name: 'frontend_developer',
    displayName: 'توسعه‌دهنده فرانت‌اند',
    description: 'پیاده‌سازی UI و تجربه کاربری',
    roleName: 'frontend_developer',
    roleDisplayName: 'توسعه‌دهنده فرانت‌اند',
    status: 'published',
    version: 'v1.4.0',
    createdAt: '۱۴۰۳/۰۹/۱۲',
  },
  {
    id: '4',
    name: 'code_reviewer',
    displayName: 'بازبین کد',
    description: 'بررسی کیفیت کد و استانداردها',
    roleName: 'code_reviewer',
    roleDisplayName: 'بازبین کد',
    status: 'published',
    version: 'v1.4.0',
    createdAt: '۱۴۰۳/۰۹/۱۰',
  },
  {
    id: '5',
    name: 'qa_engineer',
    displayName: 'مهندس تست',
    description: 'نوشتن و اجرای تست‌ها',
    roleName: 'qa_engineer',
    roleDisplayName: 'مهندس تست',
    status: 'published',
    version: 'v1.0.0',
    createdAt: '۱۴۰۳/۰۹/۰۸',
  },
  {
    id: '6',
    name: 'security_reviewer',
    displayName: 'بازبین امنیت',
    description: 'بررسی امنیتی کد و معماری',
    roleName: 'security_reviewer',
    roleDisplayName: 'بازبین امنیت',
    status: 'draft',
    version: 'v1.0.0',
    createdAt: '۱۴۰۳/۰۹/۰۵',
  },
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'پیاده‌سازی OAuth Authentication',
    description: 'اضافه کردن احراز هویت OAuth به سیستم',
    status: 'completed',
    selectionMode: 'automatic',
    selectedAgents: ['architect', 'backend_developer', 'security_reviewer', 'code_reviewer', 'qa_engineer'],
    createdAt: '۱۴۰۳/۰۹/۱۵',
    startedAt: '۱۴۰۳/۰۹/۱۵ ۱۰:۳۰',
    completedAt: '۱۴۰۳/۰۹/۱۵ ۱۴:۴۵',
  },
  {
    id: '2',
    title: 'اصلاح Layout داشبورد React',
    description: 'رفع مشکل چیدمان در صفحه داشبورد',
    status: 'running',
    selectionMode: 'automatic',
    selectedAgents: ['frontend_developer', 'code_reviewer', 'qa_engineer'],
    createdAt: '۱۴۰۳/۰۹/۱۴',
    startedAt: '۱۴۰۳/۰۹/۱۴ ۱۶:۰۰',
  },
  {
    id: '3',
    title: 'طراحی معماری میکروسرویس',
    description: 'طراحی معماری جدید برای سیستم',
    status: 'planning',
    selectionMode: 'automatic_with_approval',
    createdAt: '۱۴۰۳/۰۹/۱۳',
  },
  {
    id: '4',
    title: 'نوشتن تست‌های واحد برای API',
    description: 'افزودن تست‌های واحد برای endpointهای جدید',
    status: 'pending',
    selectionMode: 'automatic',
    createdAt: '۱۴۰۳/۰۹/۱۲',
  },
];

function App() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('agents');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLanguageChange = () => {
    const newLang = i18n.language === 'fa' ? 'en' : 'fa';
    changeLanguage(newLang);
  };

  const navItems = [
    { key: 'dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { key: 'connectors', icon: <Plug className="h-5 w-5" /> },
    { key: 'tools', icon: <Wrench className="h-5 w-5" /> },
    { key: 'agents', icon: <Bot className="h-5 w-5" /> },
    { key: 'team', icon: <Users className="h-5 w-5" /> },
    { key: 'tasks', icon: <ListTodo className="h-5 w-5" /> },
    { key: 'settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const getPageTitle = () => {
    switch (currentPage) {
      case 'connectors': return 'مدیریت کانکتورها';
      case 'tools': return 'مدیریت ابزارها';
      case 'agents': return 'مدیریت ایجنت‌ها';
      case 'team': return 'تیم ایجنت پروژه';
      case 'tasks': return 'مدیریت وظایف';
      default: return t(`nav.${currentPage}`);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="hidden w-72 flex-shrink-0 border-e border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 lg:flex lg:flex-col">
        <SidebarContent navItems={navItems} currentPage={currentPage} onNavClick={setCurrentPage} t={t} />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 end-0 w-72 bg-white shadow-xl dark:bg-slate-900">
            <SidebarContent navItems={navItems} currentPage={currentPage} onNavClick={(page: string) => { setCurrentPage(page); setSidebarOpen(false); }} t={t} onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-900 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleLanguageChange} className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              {i18n.language === 'fa' ? 'EN' : 'فا'}
            </button>
            <button onClick={toggleTheme} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {currentPage === 'connectors' && <ConnectorsPage connectors={mockConnectors} searchQuery={searchQuery} onSearchChange={setSearchQuery} />}
            {currentPage === 'tools' && <ToolsPage tools={mockTools} searchQuery={searchQuery} onSearchChange={setSearchQuery} />}
            {currentPage === 'agents' && <AgentsPage agents={mockAgents} searchQuery={searchQuery} onSearchChange={setSearchQuery} />}
            {currentPage === 'team' && <TeamPage agents={mockAgents} />}
            {currentPage === 'tasks' && <TasksPage tasks={mockTasks} searchQuery={searchQuery} onSearchChange={setSearchQuery} />}
          </div>
        </main>
      </div>
    </div>
  );
}

// Agents Page
function AgentsPage({ agents, searchQuery, onSearchChange }: any) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const filtered = agents.filter((a: Agent) => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.displayName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">مدیریت ایجنت‌ها</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{filtered.length} ایجنت تعریف شده</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" />
          ایجاد ایجنت جدید
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="جستجوی ایجنت..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="ps-3 pe-10" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((agent: Agent) => (
          <div key={agent.id} className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{agent.displayName}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{agent.name} • {agent.version}</p>
                </div>
              </div>
              <button className="rounded-lg p-1 text-slate-400 opacity-0 transition-opacity hover:bg-slate-100 group-hover:opacity-100 dark:hover:bg-slate-800">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-3 flex items-center gap-2">
              <Badge variant="info">{agent.roleDisplayName}</Badge>
              {agent.status === 'published' && <Badge variant="success"><CheckCircle2 className="ms-1 h-3 w-3" />منتشر شده</Badge>}
              {agent.status === 'draft' && <Badge variant="warning"><Edit className="ms-1 h-3 w-3" />پیش‌نویس</Badge>}
              {agent.status === 'deprecated' && <Badge variant="muted"><XCircle className="ms-1 h-3 w-3" />منسوخ</Badge>}
            </div>

            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{agent.description}</p>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <span className="text-xs text-slate-400 dark:text-slate-500">{agent.createdAt}</span>
              <div className="flex items-center gap-2">
                <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-600 dark:hover:bg-slate-800 dark:hover:text-teal-400">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-600 dark:hover:bg-slate-800 dark:hover:text-teal-400">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="ایجاد ایجنت جدید" size="xl"
        footer={<><Button variant="outline" onClick={() => setShowCreateModal(false)}>انصراف</Button><Button variant="primary">ایجاد ایجنت</Button></>}>
        <div className="space-y-4">
          <Input label="نام" placeholder="architect" />
          <Input label="نام نمایشی" placeholder="معمار سیستم" />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">توضیحات</label>
            <textarea rows={3} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">نقش (Role)</label>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
              <option>معمار</option>
              <option>توسعه‌دهنده بک‌اند</option>
              <option>توسعه‌دهنده فرانت‌اند</option>
              <option>بازبین کد</option>
              <option>مهندس تست</option>
              <option>بازبین امنیت</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">پیکربندی مدل</label>
            <textarea rows={3} placeholder='{"model": "gpt-4", "temperature": 0.7}' className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
          </div>
        </div>
      </Modal>
    </>
  );
}

// Team Page
function TeamPage({ agents }: any) {
  const [showAddModal, setShowAddModal] = useState(false);
  const teamAgents = agents.slice(0, 5).map((a: Agent, i: number) => ({ ...a, enabled: i !== 2 }));

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">تیم ایجنت پروژه</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">پروژه: AI App Platform</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4" />
          افزودن ایجنت
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {teamAgents.map((agent: Agent & { enabled: boolean }) => (
            <div key={agent.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                  <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">{agent.displayName}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{agent.roleDisplayName} • {agent.version}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" defaultChecked={agent.enabled} className="peer sr-only" />
                  <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-600 peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:border-slate-600 dark:bg-slate-700"></div>
                </label>
                <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800 dark:hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="افزودن ایجنت به تیم" size="lg"
        footer={<><Button variant="outline" onClick={() => setShowAddModal(false)}>انصراف</Button><Button variant="primary">افزودن</Button></>}>
        <div className="space-y-3">
          {agents.map((agent: Agent) => (
            <label key={agent.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 cursor-pointer hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
              <input type="checkbox" defaultChecked={agent.id !== '6'} className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
              <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <div className="flex-1">
                <p className="font-medium text-slate-900 dark:text-slate-100">{agent.displayName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{agent.roleDisplayName} • {agent.version}</p>
              </div>
            </label>
          ))}
        </div>
      </Modal>
    </>
  );
}

// Tasks Page
function TasksPage({ tasks, searchQuery, onSearchChange }: any) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const filtered = tasks.filter((t: Task) => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="success"><CheckCircle2 className="ms-1 h-3 w-3" />تکمیل شده</Badge>;
      case 'running': return <Badge variant="info"><Zap className="ms-1 h-3 w-3" />در حال اجرا</Badge>;
      case 'planning': return <Badge variant="warning"><Clock className="ms-1 h-3 w-3" />در حال برنامه‌ریزی</Badge>;
      case 'pending': return <Badge variant="muted"><Circle className="ms-1 h-3 w-3" />در انتظار</Badge>;
      case 'failed': return <Badge variant="danger"><XCircle className="ms-1 h-3 w-3" />ناموفق</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">مدیریت وظایف</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{filtered.length} وظیفه</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" />
          ایجاد وظیفه جدید
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="جستجوی وظیفه..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="ps-3 pe-10" />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((task: Task) => (
          <div key={task.id} className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900 cursor-pointer" onClick={() => setSelectedTask(task)}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{task.title}</h3>
                  {getStatusBadge(task.status)}
                </div>
                <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">{task.description}</p>
                
                {task.selectedAgents && (
                  <div className="mb-3">
                    <p className="mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">ایجنت‌های انتخاب شده:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {task.selectedAgents.map((agent, idx) => (
                        <span key={idx} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400">
                          {agent}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                  <span>{task.createdAt}</span>
                  {task.startedAt && <span>شروع: {task.startedAt}</span>}
                  {task.completedAt && <span>پایان: {task.completedAt}</span>}
                </div>
              </div>
              <button className="rounded-lg p-1 text-slate-400 opacity-0 transition-opacity hover:bg-slate-100 group-hover:opacity-100 dark:hover:bg-slate-800">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Task Detail Modal */}
      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title={selectedTask?.title || ''} size="xl">
        {selectedTask && (
          <div className="space-y-6">
            <div>
              <h4 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">وضعیت</h4>
              {getStatusBadge(selectedTask.status)}
            </div>

            {selectedTask.selectedAgents && (
              <div>
                <h4 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">ایجنت‌های انتخاب شده</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.selectedAgents.map((agent, idx) => (
                    <Badge key={idx} variant="info">{agent}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">نمودار اجرا</h4>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="rounded-md bg-indigo-100 px-3 py-1.5 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">معمار</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                  <span className="rounded-md bg-blue-100 px-3 py-1.5 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">بک‌اند</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                  <span className="rounded-md bg-purple-100 px-3 py-1.5 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">بازبین</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                  <span className="rounded-md bg-emerald-100 px-3 py-1.5 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">تست</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">حالت انتخاب ایجنت</h4>
              <Badge variant="default">{selectedTask.selectionMode === 'automatic' ? 'خودکار' : selectedTask.selectionMode === 'manual' ? 'دستی' : 'خودکار با تأیید'}</Badge>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="ایجاد وظیفه جدید" size="lg"
        footer={<><Button variant="outline" onClick={() => setShowCreateModal(false)}>انصراف</Button><Button variant="primary">شروع وظیفه</Button></>}>
        <div className="space-y-4">
          <Input label="عنوان" placeholder="پیاده‌سازی OAuth Authentication" />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">توضیحات</label>
            <textarea rows={4} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">نیازمندی‌ها</label>
            <textarea rows={4} placeholder="نیازمندی‌های دقیق وظیفه..." className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">حالت انتخاب ایجنت</label>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
              <option>خودکار</option>
              <option>دستی</option>
              <option>خودکار با تأیید</option>
            </select>
          </div>
        </div>
      </Modal>
    </>
  );
}

// Connectors Page (simplified)
function ConnectorsPage({ connectors, searchQuery, onSearchChange }: any) {
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">مدیریت کانکتورها</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{connectors.length} کانکتور فعال</p>
        </div>
        <Button variant="primary"><Plus className="h-4 w-4" />ایجاد کانکتور جدید</Button>
      </div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="جستجوی کانکتور..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="ps-3 pe-10" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {connectors.map((connector: Connector) => (
          <div key={connector.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-900/20">
                <Globe className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{connector.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{connector.provider} • {connector.adapter.toUpperCase()}</p>
              </div>
            </div>
            <div className="mb-3">
              <Badge variant="success"><CheckCircle2 className="ms-1 h-3 w-3" />فعال</Badge>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{connector.capabilities.length} قابلیت</p>
          </div>
        ))}
      </div>
    </>
  );
}

// Tools Page (simplified)
function ToolsPage({ tools, searchQuery, onSearchChange }: any) {
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">مدیریت ابزارها</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tools.length} ابزار تعریف شده</p>
        </div>
        <Button variant="primary"><Plus className="h-4 w-4" />ایجاد ابزار جدید</Button>
      </div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="جستجوی ابزار..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="ps-3 pe-10" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool: Tool) => (
          <div key={tool.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <Wrench className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{tool.displayName}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{tool.name} • {tool.version}</p>
              </div>
            </div>
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="info">{tool.type}</Badge>
              <Badge variant="success"><CheckCircle2 className="ms-1 h-3 w-3" />فعال</Badge>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{tool.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}

// Sidebar Component
function SidebarContent({ navItems, currentPage, onNavClick, t, onClose }: any) {
  const getNavLabel = (key: string) => {
    const labels: Record<string, string> = {
      dashboard: 'داشبورد',
      connectors: 'کانکتورها',
      tools: 'ابزارها',
      agents: 'ایجنت‌ها',
      team: 'تیم پروژه',
      tasks: 'وظایف',
      settings: 'تنظیمات',
    };
    return labels[key] || t(`nav.${key}`);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 dark:bg-teal-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{t('app.name')}</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="mx-4 mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
            <User className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">کاربر مهمان</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">guest@example.com</p>
          </div>
        </div>
      </div>

      <nav className="mt-4 flex-1 space-y-1 px-3">
        {navItems.map((item: any) => (
          <button key={item.key} onClick={() => onNavClick(item.key)}
            className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              currentPage === item.key ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100')}>
            {item.icon}
            <span>{getNavLabel(item.key)}</span>
          </button>
        ))}
      </nav>

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

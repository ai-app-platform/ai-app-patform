import { useTranslation } from 'react-i18next';
import { AppLayout } from '../layouts/AppLayout';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  FolderKanban,
  Plus,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

export function DashboardPage() {
  const { t } = useTranslation();

  const stats = [
    { label: t('dashboard.totalProjects'), value: '12', icon: <FolderKanban className="h-5 w-5" />, color: 'text-teal-600 dark:text-teal-400' },
    { label: t('dashboard.activeProjects'), value: '5', icon: <TrendingUp className="h-5 w-5" />, color: 'text-blue-600 dark:text-blue-400' },
    { label: t('projects.status.completed'), value: '7', icon: <CheckCircle2 className="h-5 w-5" />, color: 'text-emerald-600 dark:text-emerald-400' },
  ];

  const recentProjects = [
    { id: 1, name: 'فروشگاه آنلاین', status: 'completed', date: '۱۴۰۳/۰۹/۱۵' },
    { id: 2, name: 'سیستم رزرو نوبت', status: 'building', date: '۱۴۰۳/۰۹/۱۴' },
    { id: 3, name: 'اپلیکیشن مدیریت وظایف', status: 'draft', date: '۱۴۰۳/۰۹/۱۲' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">{t('projects.status.completed')}</Badge>;
      case 'building':
        return <Badge variant="info">{t('projects.status.building')}</Badge>;
      case 'draft':
        return <Badge variant="muted">{t('projects.status.draft')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AppLayout currentPage="dashboard">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {t('dashboard.welcome')} 👋
        </h2>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          {t('app.description')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {stat.value}
                </p>
              </div>
              <div className={`rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800 ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          {t('dashboard.quickActions')}
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">
            <Plus className="h-4 w-4" />
            {t('dashboard.newProject')}
          </Button>
          <Button variant="outline">
            <Sparkles className="h-4 w-4" />
            {t('nav.templates')}
          </Button>
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {t('dashboard.recentActivity')}
          </h3>
          <a
            href="/projects"
            className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400"
          >
            {t('dashboard.viewAll')}
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </a>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-900/20">
                    <FolderKanban className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {project.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>{project.date}</span>
                    </div>
                  </div>
                </div>
                {getStatusBadge(project.status)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

import { useTranslation } from 'react-i18next';
import { AppLayout } from '../layouts/AppLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import {
  Plus,
  Search,
  FolderKanban,
  Clock,
  MoreHorizontal,
} from 'lucide-react';

export function ProjectsPage() {
  const { t } = useTranslation();

  // Mock data - will be replaced with API calls
  const projects = [
    {
      id: 1,
      name: 'فروشگاه آنلاین',
      description: 'یک فروشگاه اینترنتی با سیستم پرداخت',
      status: 'completed',
      createdAt: '۱۴۰۳/۰۹/۱۵',
    },
    {
      id: 2,
      name: 'سیستم رزرو نوبت',
      description: 'اپلیکیشن مدیریت نوبت‌دهی کلینیک',
      status: 'building',
      createdAt: '۱۴۰۳/۰۹/۱۴',
    },
    {
      id: 3,
      name: 'اپلیکیشن مدیریت وظایف',
      description: 'مدیریت تسک‌ها و پروژه‌های تیمی',
      status: 'draft',
      createdAt: '۱۴۰۳/۰۹/۱۲',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">{t('projects.status.completed')}</Badge>;
      case 'building':
        return <Badge variant="info">{t('projects.status.building')}</Badge>;
      case 'draft':
        return <Badge variant="muted">{t('projects.status.draft')}</Badge>;
      case 'failed':
        return <Badge variant="danger">{t('projects.status.failed')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AppLayout currentPage="projects">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {t('projects.title')}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {projects.length} {t('projects.title').toLowerCase()}
          </p>
        </div>
        <Button variant="primary">
          <Plus className="h-4 w-4" />
          {t('projects.createNew')}
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder={t('common.search') + '...'}
            className="ps-3 pe-10"
          />
        </div>
        <Button variant="outline" size="md">
          {t('common.filter')}
        </Button>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="h-8 w-8 text-slate-400" />}
          title={t('projects.empty')}
          description={t('projects.emptyDescription')}
          action={
            <Button variant="primary">
              <Plus className="h-4 w-4" />
              {t('projects.createNew')}
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-900/20">
                  <FolderKanban className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(project.status)}
                  <button className="rounded-lg p-1 text-slate-400 opacity-0 transition-opacity hover:bg-slate-100 group-hover:opacity-100 dark:hover:bg-slate-800">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h3 className="mb-1 font-semibold text-slate-900 dark:text-slate-100">
                {project.name}
              </h3>
              <p className="mb-3 text-sm text-slate-500 line-clamp-2 dark:text-slate-400">
                {project.description}
              </p>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                <span>{project.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}

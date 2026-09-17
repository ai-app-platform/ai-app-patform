import { cn } from '../../lib/cn';
import { Inbox } from 'lucide-react';
import { type ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-8 text-center dark:border-slate-700',
        className
      )}
    >
      <div className="mb-4 rounded-full bg-slate-100 p-3 dark:bg-slate-800">
        {icon || <Inbox className="h-8 w-8 text-slate-400 dark:text-slate-500" />}
      </div>
      <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      {description && (
        <p className="mb-4 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

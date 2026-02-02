import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
  className?: string;
}

const variantStyles = {
  default: 'border-border bg-card',
  primary: 'border-primary/20 bg-primary/5 dark:bg-primary/5',
  success: 'border-success/20 bg-success/5 dark:bg-success/5',
  warning: 'border-warning/20 bg-warning/5 dark:bg-warning/5',
};

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary dark:bg-primary/10',
  success: 'bg-success/10 text-success dark:bg-success/10',
  warning: 'bg-warning/10 text-warning dark:bg-warning/10',
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border p-5 transition-all duration-200 hover:shadow-md',
        variantStyles[variant],
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 text-xs">
              <span
                className={cn(
                  'font-medium',
                  trend.isPositive ? 'text-success' : 'text-destructive',
                )}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
              <span className="text-muted-foreground">vs last week</span>
            </div>
          )}
        </div>
        <div className={cn('rounded-lg p-2.5', iconStyles[variant])}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export default StatCard;

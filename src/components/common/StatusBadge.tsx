import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'waiting';
  label: string;
  showDot?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const statusStyles = {
  success: 'bg-success/10 text-success border-success/20',
  error: 'bg-destructive/10 text-destructive border-destructive/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  info: 'bg-primary/10 text-primary border-primary/20',
  neutral: 'bg-muted text-muted-foreground border-border',

  waiting: 'bg-muted/50 text-muted-foreground border-muted-foreground/20',
};

const dotStyles = {
  success: 'status-dot-success',
  error: 'status-dot-error',
  warning: 'status-dot-warning',
  info: 'bg-primary',
  neutral: 'bg-muted-foreground',

  waiting: 'bg-muted-foreground animate-pulse',
};

export function StatusBadge({
  status,
  label,
  showDot = true,
  size = 'sm',
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        statusStyles[status],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className,
      )}
    >
      {showDot && <span className={cn('status-dot', dotStyles[status])} />}
      {label}
    </span>
  );
}

export default StatusBadge;

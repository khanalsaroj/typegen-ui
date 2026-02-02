import { Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DatabaseType } from '@/types';

interface DatabaseIconProps {
  type: DatabaseType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const colorMap: Record<DatabaseType, string> = {
  mysql: 'text-database-mysql',
  postgres: 'text-database-postgres',
  oracle: 'text-database-oracle',
  mssql: 'text-database-mssql',
};

const labelMap: Record<DatabaseType, string> = {
  mysql: 'MySQL',
  postgres: 'PostgreSQL',
  oracle: 'Oracle',
  mssql: 'MSSQL',
};

const sizeMap = {
  sm: 14,
  md: 18,
  lg: 24,
};

export function DatabaseIcon({
  type,
  size = 'md',
  showLabel = false,
  className,
}: DatabaseIconProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <Database size={sizeMap[size]} className={colorMap[type]} />
      {showLabel && <span className={cn('font-medium', colorMap[type])}>{labelMap[type]}</span>}
    </span>
  );
}

export default DatabaseIcon;

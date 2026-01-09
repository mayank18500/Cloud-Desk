import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning';
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  const iconVariants = {
    default: 'stat-icon-gradient',
    primary: 'stat-icon-gradient',
    accent: 'stat-icon-accent',
    success: 'stat-icon-success',
    warning: 'stat-icon-warning',
  };

  return (
    <div className={cn('stat-card group', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="stat-card-value mt-2">{value}</p>
          {subtitle && (
            <p className="stat-card-label">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1.5 mt-3">
              <span
                className={cn(
                  'text-xs font-bold px-2 py-0.5 rounded-md',
                  trend.isPositive 
                    ? 'bg-success/15 text-success' 
                    : 'bg-destructive/15 text-destructive'
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn('stat-card-icon', iconVariants[variant])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
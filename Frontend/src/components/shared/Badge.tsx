import { cn } from '../../lib/utils';
import { CheckCircle, Building2, User, Star, Zap } from 'lucide-react';

interface BadgeProps {
  variant?: 'default' | 'verified' | 'company' | 'interviewer' | 'success' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
  icon?: boolean;
}

export function Badge({ variant = 'default', children, className, icon = true }: BadgeProps) {
  const baseClasses = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-base-200 text-foreground/80',
    verified: 'verified-badge',
    company: 'role-badge-company',
    interviewer: 'role-badge-interviewer',
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/15 text-warning',
    info: 'bg-info/15 text-info',
  };

  const icons = {
    default: null,
    verified: <CheckCircle className="w-3.5 h-3.5" />,
    company: <Building2 className="w-3.5 h-3.5" />,
    interviewer: <Zap className="w-3.5 h-3.5" />,
    success: <CheckCircle className="w-3.5 h-3.5" />,
    warning: <Star className="w-3.5 h-3.5" />,
    info: null,
  };

  return (
    <span className={cn(baseClasses, variantClasses[variant], className)}>
      {icon && icons[variant]}
      {children}
    </span>
  );
}

export function SkillTag({ skill, variant = 'default' }: { skill: string; variant?: 'default' | 'primary' | 'accent' }) {
  const variantClasses = {
    default: 'skill-tag',
    primary: 'skill-tag skill-tag-primary',
    accent: 'skill-tag skill-tag-accent',
  };

  return <span className={variantClasses[variant]}>{skill}</span>;
}
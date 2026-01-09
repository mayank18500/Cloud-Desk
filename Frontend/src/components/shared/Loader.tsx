import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function Loader({ size = 'md', className, text }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'rounded-full border-primary/30 border-t-primary animate-spin',
          sizeClasses[size]
        )}
      />
      {text && <p className="text-sm text-muted-foreground animate-pulse-soft">{text}</p>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <Loader size="lg" text="Loading..." />
    </div>
  );
}

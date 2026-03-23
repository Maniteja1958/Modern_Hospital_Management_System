import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  children,
  className,
}) => {
  const variants = {
    info: {
      bg: 'bg-primary/10 border-primary/30',
      text: 'text-primary',
      icon: Info,
    },
    success: {
      bg: 'bg-success/10 border-success/30',
      text: 'text-success',
      icon: CheckCircle,
    },
    warning: {
      bg: 'bg-warning/10 border-warning/30',
      text: 'text-warning',
      icon: AlertCircle,
    },
    error: {
      bg: 'bg-error/10 border-error/30',
      text: 'text-error',
      icon: XCircle,
    },
  };
  
  const { bg, text, icon: Icon } = variants[variant];
  
  return (
    <div className={clsx('flex items-start gap-3 p-4 border rounded-xl', bg, className)}>
      <Icon className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', text)} />
      <div className={clsx('text-sm', text)}>{children}</div>
    </div>
  );
};

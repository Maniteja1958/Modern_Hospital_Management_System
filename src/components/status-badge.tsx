import React from 'react';
import { Badge } from './ui/badge';

interface StatusBadgeProps {
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const variants = {
    pending: 'warning' as const,
    processing: 'info' as const,
    completed: 'success' as const,
    cancelled: 'error' as const,
  };
  
  return (
    <Badge variant={variants[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

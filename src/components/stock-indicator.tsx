import React from 'react';
import { clsx } from 'clsx';

interface StockIndicatorProps {
  current: number;
  reorderLevel: number;
}

export const StockIndicator: React.FC<StockIndicatorProps> = ({
  current,
  reorderLevel,
}) => {
  const percentage = (current / (reorderLevel * 2)) * 100;
  const isLow = current <= reorderLevel;
  const isCritical = current <= reorderLevel / 2;
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-sm">
        <span className="text-textSecondary">Stock Level</span>
        <span className={clsx(
          'font-medium',
          isCritical ? 'text-error' : isLow ? 'text-warning' : 'text-success'
        )}>
          {current} units
        </span>
      </div>
      <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
        <div
          className={clsx(
            'h-full transition-all duration-300',
            isCritical ? 'bg-error' : isLow ? 'bg-warning' : 'bg-success'
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

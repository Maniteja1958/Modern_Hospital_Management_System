import React from 'react';
import { clsx } from 'clsx';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <div className="overflow-x-auto">
      <table className={clsx('w-full', className)}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<TableProps> = ({ children }) => {
  return <thead className="bg-surface border-b border-border">{children}</thead>;
};

export const TableBody: React.FC<TableProps> = ({ children }) => {
  return <tbody className="divide-y divide-border">{children}</tbody>;
};

export const TableRow: React.FC<TableProps> = ({ children, className }) => {
  return (
    <tr className={clsx('hover:bg-surface/50 transition-colors', className)}>
      {children}
    </tr>
  );
};

export const TableHead: React.FC<TableProps> = ({ children, className }) => {
  return (
    <th
      className={clsx(
        'px-6 py-4 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider',
        className
      )}
    >
      {children}
    </th>
  );
};

export const TableCell: React.FC<TableProps> = ({ children, className }) => {
  return (
    <td className={clsx('px-6 py-4 text-sm text-text', className)}>
      {children}
    </td>
  );
};

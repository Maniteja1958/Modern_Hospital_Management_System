import React from 'react';
import { DashboardStats } from '@/components/dashboard-stats';
import { SalesChart } from '@/components/sales-chart';
import { LowStockAlerts } from '@/components/low-stock-alerts';
import { RecentTransactions } from '@/components/recent-transactions';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text mb-2">Dashboard</h1>
        <p className="text-textSecondary">Welcome back! Here's your pharmacy overview.</p>
      </div>
      
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <LowStockAlerts />
      </div>
      
      <RecentTransactions />
    </div>
  );
};

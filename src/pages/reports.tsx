import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SalesChart } from '@/components/sales-chart';

export const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text mb-2">Reports & Analytics</h1>
        <p className="text-textSecondary">View detailed reports and business insights.</p>
      </div>
      
      <SalesChart />
      
      <Card className="text-center py-20">
        <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold text-text mb-2">Advanced Analytics</h3>
        <p className="text-textSecondary">Detailed reports coming soon...</p>
      </Card>
    </div>
  );
};

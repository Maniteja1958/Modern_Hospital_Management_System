import React from 'react';
import { Package, FileText, DollarSign, AlertTriangle } from 'lucide-react';
import { StatCard } from './stat-card';
import { usePharmacyStore } from '@/store/pharmacy-store';

export const DashboardStats: React.FC = () => {
  const { medicines, prescriptions, sales } = usePharmacyStore();
  
  const totalMedicines = medicines.length;
  const lowStockCount = medicines.filter(m => m.quantity <= m.reorderLevel).length;
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'pending').length;
  
  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(s => s.date === today);
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Medicines"
        value={totalMedicines}
        icon={Package}
        color="primary"
        trend={{ value: '12% from last month', isPositive: true }}
      />
      <StatCard
        title="Low Stock Alerts"
        value={lowStockCount}
        icon={AlertTriangle}
        color="warning"
      />
      <StatCard
        title="Today's Revenue"
        value={`₹${todayRevenue.toFixed(2)}`}
        icon={DollarSign}
        color="success"
        trend={{ value: '8% from yesterday', isPositive: true }}
      />
      <StatCard
        title="Pending Prescriptions"
        value={pendingPrescriptions}
        icon={FileText}
        color="error"
      />
    </div>
  );
};

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { usePharmacyStore } from '@/store/pharmacy-store';

export const LowStockAlerts: React.FC = () => {
  const { medicines } = usePharmacyStore();
  
  const lowStockMedicines = medicines
    .filter(m => m.quantity <= m.reorderLevel)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);
  
  if (lowStockMedicines.length === 0) {
    return (
      <Card>
        <h3 className="text-xl font-bold text-text mb-4">Low Stock Alerts</h3>
        <p className="text-textSecondary text-center py-8">No low stock items</p>
      </Card>
    );
  }
  
  return (
    <Card>
      <h3 className="text-xl font-bold text-text mb-4">Low Stock Alerts</h3>
      <div className="space-y-3">
        {lowStockMedicines.map(medicine => (
          <div
            key={medicine.id}
            className="flex items-center justify-between p-3 bg-background rounded-xl"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <div>
                <p className="font-medium text-text">{medicine.name}</p>
                <p className="text-sm text-textSecondary">{medicine.category}</p>
              </div>
            </div>
            <Badge variant="warning">{medicine.quantity} left</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};

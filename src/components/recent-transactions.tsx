import React from 'react';
import { ShoppingCart, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { usePharmacyStore } from '@/store/pharmacy-store';
import { format } from 'date-fns';

export const RecentTransactions: React.FC = () => {
  const { sales } = usePharmacyStore();
  
  const recentSales = sales.slice(0, 5);
  
  return (
    <Card>
      <h3 className="text-xl font-bold text-text mb-4">Recent Transactions</h3>
      <div className="space-y-3">
        {recentSales.map(sale => (
          <div
            key={sale.id}
            className="flex items-center justify-between p-3 bg-background rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-text">{sale.invoiceNumber}</p>
                <div className="flex items-center gap-2 text-sm text-textSecondary">
                  <Calendar className="w-3 h-3" />
                  <span>{format(new Date(sale.date), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-success">₹{sale.total.toFixed(2)}</p>
              <Badge variant="default" className="mt-1">
                {sale.paymentMethod.toUpperCase()}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

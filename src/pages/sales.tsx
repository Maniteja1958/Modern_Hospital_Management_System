import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const Sales: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text mb-2">Sales & POS</h1>
        <p className="text-textSecondary">Process sales and manage transactions.</p>
      </div>
      
      <Card className="text-center py-20">
        <ShoppingCart className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold text-text mb-2">Point of Sale</h3>
        <p className="text-textSecondary">Sales interface coming soon...</p>
      </Card>
    </div>
  );
};

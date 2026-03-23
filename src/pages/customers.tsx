import React from 'react';
import { CustomerList } from '@/components/customer-list';

export const Customers: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text mb-2">Customer Management</h1>
        <p className="text-textSecondary">Manage customer profiles and purchase history.</p>
      </div>
      
      <CustomerList />
    </div>
  );
};

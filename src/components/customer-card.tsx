import React from 'react';
import { User, Phone, Mail, Award } from 'lucide-react';
import { Card } from './ui/card';
import { Customer } from '@/types';

interface CustomerCardProps {
  customer: Customer;
  onClick?: () => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onClick }) => {
  return (
    <Card onClick={onClick} className="hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-text mb-1">{customer.name}</h3>
          <div className="space-y-1 text-sm text-textSecondary">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{customer.email}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-warning" />
              <span className="text-text font-medium">{customer.loyaltyPoints} points</span>
            </div>
            <span className="text-sm text-textSecondary">
              {customer.totalPurchases} purchases
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

import React from 'react';
import { Package, Calendar, AlertTriangle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Medicine } from '@/types';
import { format } from 'date-fns';

interface MedicineCardProps {
  medicine: Medicine;
  onClick?: () => void;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ medicine, onClick }) => {
  const isLowStock = medicine.quantity <= medicine.reorderLevel;
  const isExpiringSoon = new Date(medicine.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  
  return (
    <Card onClick={onClick} className="hover:shadow-lg">
      <div className="flex items-start gap-4">
        <img
          src={medicine.imageUrl}
          alt={medicine.name}
          className="w-20 h-20 object-cover rounded-xl"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-text">{medicine.name}</h3>
              <p className="text-sm text-textSecondary">{medicine.genericName}</p>
            </div>
            <Badge variant={isLowStock ? 'error' : 'success'}>
              {isLowStock ? 'Low Stock' : 'In Stock'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-textSecondary">
            <div className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              <span>{medicine.quantity} units</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(medicine.expiryDate), 'MMM yyyy')}</span>
            </div>
          </div>
          
          {isExpiringSoon && (
            <div className="flex items-center gap-1 mt-2 text-warning text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Expiring soon</span>
            </div>
          )}
          
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-primary">₹{medicine.mrp}</span>
            <span className="text-sm text-textSecondary">{medicine.category}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

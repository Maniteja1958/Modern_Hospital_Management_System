import React from 'react';
import { FileText, User, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Prescription } from '@/types';
import { format } from 'date-fns';

interface PrescriptionCardProps {
  prescription: Prescription;
  onClick?: () => void;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescription,
  onClick,
}) => {
  const statusVariants = {
    pending: 'warning' as const,
    processing: 'info' as const,
    completed: 'success' as const,
    cancelled: 'error' as const,
  };
  
  return (
    <Card onClick={onClick} className="hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-text">{prescription.prescriptionNumber}</h3>
            <p className="text-sm text-textSecondary">Dr. {prescription.doctorName}</p>
          </div>
        </div>
        <Badge variant={statusVariants[prescription.status]}>
          {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
        </Badge>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-textSecondary">
          <User className="w-4 h-4" />
          <span>{prescription.customerName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-textSecondary">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(prescription.uploadDate), 'MMM dd, yyyy')}</span>
        </div>
      </div>
      
      <div className="pt-4 border-t border-border">
        <p className="text-sm text-textSecondary mb-2">Medicines:</p>
        <div className="flex flex-wrap gap-2">
          {prescription.medicines.slice(0, 3).map((med, index) => (
            <Badge key={index} variant="default">
              {med.medicineName}
            </Badge>
          ))}
          {prescription.medicines.length > 3 && (
            <Badge variant="default">+{prescription.medicines.length - 3} more</Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

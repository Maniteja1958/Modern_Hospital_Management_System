import React from 'react';
import { PrescriptionList } from '@/components/prescription-list';

export const Prescriptions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text mb-2">Prescriptions</h1>
        <p className="text-textSecondary">Manage and track customer prescriptions.</p>
      </div>
      
      <PrescriptionList />
    </div>
  );
};

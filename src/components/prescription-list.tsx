import React, { useState } from 'react';
import { SearchBar } from './search-bar';
import { Select } from './ui/select';
import { PrescriptionCard } from './prescription-card';
import { usePharmacyStore } from '@/store/pharmacy-store';

export const PrescriptionList: React.FC = () => {
  const { prescriptions } = usePharmacyStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch =
      prescription.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.prescriptionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search prescriptions..."
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'pending', label: 'Pending' },
            { value: 'processing', label: 'Processing' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrescriptions.map(prescription => (
          <PrescriptionCard key={prescription.id} prescription={prescription} />
        ))}
      </div>
    </div>
  );
};

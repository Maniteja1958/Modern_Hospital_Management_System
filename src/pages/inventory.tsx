import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { MedicineTable } from '@/components/medicine-table';
import { MedicineForm } from '@/components/medicine-form';
import { Medicine } from '@/types';
import { usePharmacyStore } from '@/store/pharmacy-store';

export const Inventory: React.FC = () => {
  const { addMedicine, updateMedicine } = usePharmacyStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | undefined>();
  
  const handleAdd = () => {
    setEditingMedicine(undefined);
    setIsDialogOpen(true);
  };
  
  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setIsDialogOpen(true);
  };
  
  const handleSubmit = (medicineData: Partial<Medicine>) => {
    if (editingMedicine) {
      updateMedicine(editingMedicine.id, medicineData);
    } else {
      const newMedicine: Medicine = {
        id: `MED${Date.now()}`,
        ...medicineData as Medicine,
      };
      addMedicine(newMedicine);
    }
    setIsDialogOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text mb-2">Inventory Management</h1>
        <p className="text-textSecondary">Manage your medicine stock and inventory.</p>
      </div>
      
      <MedicineTable onEdit={handleEdit} onAdd={handleAdd} />
      
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
        size="lg"
      >
        <MedicineForm
          medicine={editingMedicine}
          onSubmit={handleSubmit}
          onCancel={() => setIsDialogOpen(false)}
        />
      </Dialog>
    </div>
  );
};

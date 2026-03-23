import React, { useState } from 'react';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Button } from './ui/button';
import { Medicine } from '@/types';
import { categories } from '@/data/categories-data';

interface MedicineFormProps {
  medicine?: Medicine;
  onSubmit: (medicine: Partial<Medicine>) => void;
  onCancel: () => void;
}

export const MedicineForm: React.FC<MedicineFormProps> = ({
  medicine,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Medicine>>(
    medicine || {
      name: '',
      genericName: '',
      category: categories[0].name,
      manufacturer: '',
      batchNumber: '',
      expiryDate: '',
      quantity: 0,
      reorderLevel: 0,
      price: 0,
      mrp: 0,
      supplier: '',
      description: '',
      imageUrl: 'https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg',
    }
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Medicine Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Generic Name"
          value={formData.genericName}
          onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
          required
        />
        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          options={categories.map(cat => ({ value: cat.name, label: cat.name }))}
        />
        <Input
          label="Manufacturer"
          value={formData.manufacturer}
          onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
          required
        />
        <Input
          label="Batch Number"
          value={formData.batchNumber}
          onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
          required
        />
        <Input
          label="Expiry Date"
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          required
        />
        <Input
          label="Quantity"
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
          required
        />
        <Input
          label="Reorder Level"
          type="number"
          value={formData.reorderLevel}
          onChange={(e) => setFormData({ ...formData, reorderLevel: Number(e.target.value) })}
          required
        />
        <Input
          label="Price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          required
        />
        <Input
          label="MRP"
          type="number"
          step="0.01"
          value={formData.mrp}
          onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
          required
        />
        <Input
          label="Supplier"
          value={formData.supplier}
          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
          required
        />
      </div>
      <Input
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {medicine ? 'Update Medicine' : 'Add Medicine'}
        </Button>
      </div>
    </form>
  );
};

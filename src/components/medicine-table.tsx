import React, { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { SearchBar } from './search-bar';
import { Medicine } from '@/types';
import { usePharmacyStore } from '@/store/pharmacy-store';
import { format } from 'date-fns';

interface MedicineTableProps {
  onEdit: (medicine: Medicine) => void;
  onAdd: () => void;
}

export const MedicineTable: React.FC<MedicineTableProps> = ({ onEdit, onAdd }) => {
  const { medicines, deleteMedicine } = usePharmacyStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search medicines..."
        />
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Medicine
        </Button>
      </div>
      
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicine</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedicines.map(medicine => {
              const isLowStock = medicine.quantity <= medicine.reorderLevel;
              return (
                <TableRow key={medicine.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-text">{medicine.name}</p>
                      <p className="text-sm text-textSecondary">{medicine.genericName}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{medicine.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={isLowStock ? 'error' : 'success'}>
                      {medicine.quantity} units
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(medicine.expiryDate), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-primary">₹{medicine.mrp}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(medicine)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMedicine(medicine.id)}
                      >
                        <Trash2 className="w-4 h-4 text-error" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

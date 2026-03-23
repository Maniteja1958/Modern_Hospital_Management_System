import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { SearchBar } from './search-bar';
import { Button } from './ui/button';
import { CustomerCard } from './customer-card';
import { usePharmacyStore } from '@/store/pharmacy-store';

export const CustomerList: React.FC = () => {
  const { customers } = usePharmacyStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search customers..."
        />
        <Button className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Customer
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map(customer => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </div>
    </div>
  );
};

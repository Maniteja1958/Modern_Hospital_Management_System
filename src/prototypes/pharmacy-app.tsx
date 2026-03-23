import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/main-layout';
import { Dashboard } from '@/pages/dashboard';
import { Inventory } from '@/pages/inventory';
import { Prescriptions } from '@/pages/prescriptions';
import { Sales } from '@/pages/sales';
import { Customers } from '@/pages/customers';
import { Reports } from '@/pages/reports';
import { Settings } from '@/pages/settings';

const PharmacyApp: React.FC = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/prescriptions" element={<Prescriptions />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default PharmacyApp;

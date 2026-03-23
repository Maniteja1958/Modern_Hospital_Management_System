import { create } from 'zustand';
import { Medicine, Prescription, Sale, Customer } from '@/types';
import { medicines as initialMedicines } from '@/data/medicines-data';
import { prescriptions as initialPrescriptions } from '@/data/prescriptions-data';
import { sales as initialSales } from '@/data/sales-data';
import { customers as initialCustomers } from '@/data/customers-data';

interface PharmacyStore {
  medicines: Medicine[];
  prescriptions: Prescription[];
  sales: Sale[];
  customers: Customer[];
  
  // Medicine actions
  addMedicine: (medicine: Medicine) => void;
  updateMedicine: (id: string, medicine: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  
  // Prescription actions
  addPrescription: (prescription: Prescription) => void;
  updatePrescription: (id: string, prescription: Partial<Prescription>) => void;
  deletePrescription: (id: string) => void;
  
  // Sale actions
  addSale: (sale: Sale) => void;
  
  // Customer actions
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
}

export const usePharmacyStore = create<PharmacyStore>((set) => ({
  medicines: initialMedicines,
  prescriptions: initialPrescriptions,
  sales: initialSales,
  customers: initialCustomers,
  
  // Medicine actions
  addMedicine: (medicine) =>
    set((state) => ({ medicines: [...state.medicines, medicine] })),
  
  updateMedicine: (id, updatedMedicine) =>
    set((state) => ({
      medicines: state.medicines.map((m) =>
        m.id === id ? { ...m, ...updatedMedicine } : m
      ),
    })),
  
  deleteMedicine: (id) =>
    set((state) => ({
      medicines: state.medicines.filter((m) => m.id !== id),
    })),
  
  // Prescription actions
  addPrescription: (prescription) =>
    set((state) => ({ prescriptions: [...state.prescriptions, prescription] })),
  
  updatePrescription: (id, updatedPrescription) =>
    set((state) => ({
      prescriptions: state.prescriptions.map((p) =>
        p.id === id ? { ...p, ...updatedPrescription } : p
      ),
    })),
  
  deletePrescription: (id) =>
    set((state) => ({
      prescriptions: state.prescriptions.filter((p) => p.id !== id),
    })),
  
  // Sale actions
  addSale: (sale) =>
    set((state) => ({ sales: [sale, ...state.sales] })),
  
  // Customer actions
  addCustomer: (customer) =>
    set((state) => ({ customers: [...state.customers, customer] })),
  
  updateCustomer: (id, updatedCustomer) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === id ? { ...c, ...updatedCustomer } : c
      ),
    })),
  
  deleteCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    })),
}));

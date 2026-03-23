export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  reorderLevel: number;
  price: number;
  mrp: number;
  supplier: string;
  description: string;
  imageUrl: string;
}

export interface Prescription {
  id: string;
  customerId: string;
  customerName: string;
  prescriptionNumber: string;
  uploadDate: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  medicines: PrescriptionMedicine[];
  doctorName: string;
  notes: string;
  imageUrl: string;
}

export interface PrescriptionMedicine {
  medicineId: string;
  medicineName: string;
  dosage: string;
  duration: string;
  quantity: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  date: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'upi';
}

export interface SaleItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  dateOfBirth: string;
  loyaltyPoints: number;
  registrationDate: string;
  totalPurchases: number;
  lastVisit: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

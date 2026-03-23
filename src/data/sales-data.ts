import { Sale } from '@/types';

const generateSalesData = (): Sale[] => {
  const sales: Sale[] = [];
  const today = new Date();
  
  // Generate 100+ sales over the last 30 days
  for (let i = 0; i < 120; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const saleDate = new Date(today);
    saleDate.setDate(saleDate.getDate() - daysAgo);
    
    const customerIds = ['CUST001', 'CUST002', 'CUST003', 'CUST004', 'CUST005', 'CUST006', 'CUST007', 'CUST008', 'CUST009', 'CUST010'];
    const customerNames = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh', 'Ananya Iyer', 'Rahul Verma', 'Kavita Desai', 'Arjun Nair', 'Meera Gupta'];
    const randomCustomer = Math.floor(Math.random() * customerIds.length);
    
    const numItems = Math.floor(Math.random() * 4) + 1;
    const items = [];
    let subtotal = 0;
    
    for (let j = 0; j < numItems; j++) {
      const medicineId = `MED${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}`;
      const quantity = Math.floor(Math.random() * 3) + 1;
      const price = Math.floor(Math.random() * 50) + 5;
      const total = quantity * price;
      
      items.push({
        medicineId,
        medicineName: `Medicine ${medicineId}`,
        quantity,
        price,
        total,
      });
      
      subtotal += total;
    }
    
    const tax = subtotal * 0.12;
    const discount = Math.random() > 0.7 ? subtotal * 0.05 : 0;
    const total = subtotal + tax - discount;
    
    const paymentMethods: ('cash' | 'card' | 'upi')[] = ['cash', 'card', 'upi'];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    
    sales.push({
      id: `SALE${String(i + 1).padStart(4, '0')}`,
      invoiceNumber: `INV2024${String(i + 1).padStart(4, '0')}`,
      date: saleDate.toISOString().split('T')[0],
      customerId: customerIds[randomCustomer],
      customerName: customerNames[randomCustomer],
      items,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
    });
  }
  
  return sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const sales: Sale[] = generateSalesData();

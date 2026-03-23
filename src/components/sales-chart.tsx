import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from './ui/card';
import { usePharmacyStore } from '@/store/pharmacy-store';

export const SalesChart: React.FC = () => {
  const { sales } = usePharmacyStore();
  
  // Get last 7 days of sales data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });
  
  const chartData = last7Days.map(date => {
    const daySales = sales.filter(s => s.date === date);
    const total = daySales.reduce((sum, sale) => sum + sale.total, 0);
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: total,
    };
  });
  
  return (
    <Card>
      <h3 className="text-xl font-bold text-text mb-6">Sales Overview (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2F2F2F" />
          <XAxis dataKey="date" stroke="#A3A3A3" />
          <YAxis stroke="#A3A3A3" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#262626',
              border: '1px solid #2F2F2F',
              borderRadius: '12px',
              color: '#FFFFFF',
            }}
          />
          <Bar dataKey="revenue" fill="#3D83FF" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

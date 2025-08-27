import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { WeightEntry } from '../types';

interface WeightChartProps {
  data: WeightEntry[];
}

export const WeightChart: React.FC<WeightChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        ยังไม่มีข้อมูลน้ำหนัก
      </div>
    );
  }
  
  const formattedData = data.map(entry => ({
    ...entry,
    // Format date for display on the X-axis
    formattedDate: new Date(entry.date).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
    }),
  }));
  
  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <LineChart
          data={formattedData}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="formattedDate" 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={{ stroke: '#cbd5e1' }}
            domain={['dataMin - 1', 'dataMax + 1']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
            formatter={(value) => [`${value} kg`, 'น้ำหนัก']}
          />
          <Legend formatter={(value) => <span className="text-slate-600">{value}</span>} />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#10b981" // emerald-500
            strokeWidth={2} 
            activeDot={{ r: 8 }}
            name="น้ำหนัก"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

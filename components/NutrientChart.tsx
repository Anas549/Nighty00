
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface NutrientChartProps {
  protein: number;
  carbs: number;
  fat: number;
}

const COLORS = {
  protein: '#a855f7', // Purple-500
  carbs: '#3b82f6',   // Blue-500
  fat: '#eab308',     // Yellow-500
};

export const NutrientChart: React.FC<NutrientChartProps> = ({ protein, carbs, fat }) => {
  // Protein calories = grams * 4, Carbs calories = grams * 4, Fat calories = grams * 9
  const data = [
    { name: 'โปรตีน', value: protein * 4, grams: protein },
    { name: 'คาร์โบไฮเดรต', value: carbs * 4, grams: carbs },
    { name: 'ไขมัน', value: fat * 9, grams: fat },
  ].filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        ไม่มีข้อมูลสำหรับแสดงผล
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            <Cell key={`cell-protein`} fill={COLORS.protein} />
            <Cell key={`cell-carbs`} fill={COLORS.carbs} />
            <Cell key={`cell-fat`} fill={COLORS.fat} />
          </Pie>
          <Tooltip formatter={(value, name, props) => [`${props.payload.grams.toFixed(1)}g`, props.payload.name]} />
          <Legend formatter={(value) => <span className="text-slate-600">{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

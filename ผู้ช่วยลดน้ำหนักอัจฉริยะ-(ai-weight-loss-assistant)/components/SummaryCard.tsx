
import React from 'react';

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit: string;
  color: 'blue' | 'orange' | 'emerald' | 'purple';
}

const colorClasses = {
  blue: 'bg-blue-100 text-blue-800',
  orange: 'bg-orange-100 text-orange-800',
  emerald: 'bg-emerald-100 text-emerald-800',
  purple: 'bg-purple-100 text-purple-800',
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ icon, title, value, unit, color }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
      <div className={`rounded-full p-3 ${colorClasses[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">
          {value} <span className="text-base font-medium text-slate-600">{unit}</span>
        </p>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import type { WeightEntry } from '../types';
import { WeightChart } from './WeightChart';
import { TrendingUpIcon } from './icons';

interface ProgressTrackerProps {
  entries: WeightEntry[];
  onAddEntry: (entry: WeightEntry) => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ entries, onAddEntry }) => {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightValue = parseFloat(weight);
    if (weightValue > 0 && date) {
      onAddEntry({ date, weight: weightValue });
      setWeight('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4">ติดตามความคืบหน้า</h2>
      <div className="flex-grow">
        <WeightChart data={entries} />
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2 items-end">
        <div className="flex-grow">
          <label htmlFor="weight" className="block text-sm font-medium text-slate-700 mb-1">
            น้ำหนัก (kg)
          </label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="เช่น 79.5"
            step="0.1"
            required
          />
        </div>
        <div className="flex-grow">
          <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">
            วันที่
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-600 h-[42px]"
        >
          บันทึก
        </button>
      </form>
    </div>
  );
};

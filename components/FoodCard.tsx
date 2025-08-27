import React from 'react';
import type { FoodLog } from '../types';
import { TrashIcon } from './icons';

interface FoodCardProps {
  log: FoodLog;
  onDelete: (id: number) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ log, onDelete }) => {
  return (
    <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
      {log.imageUrl ? (
        <img src={log.imageUrl} alt={log.name} className="w-16 h-16 rounded-md object-cover" />
      ) : (
        <div className="w-16 h-16 rounded-md bg-slate-200 flex items-center justify-center text-slate-400 text-xs">
          ไม่มีรูป
        </div>
      )}
      <div className="flex-grow">
        <h3 className="font-semibold text-slate-800">{log.name}</h3>
        <p className="text-sm text-slate-500">{log.mealType} • {log.amount}</p>
        <div className="flex gap-4 text-xs mt-1 text-slate-600">
          <span><span className="font-medium text-orange-500">{log.nutrients.calories}</span> kcal</span>
          <span><span className="font-medium text-purple-500">{log.nutrients.protein}</span> P</span>
          <span><span className="font-medium text-blue-500">{log.nutrients.carbs}</span> C</span>
          <span><span className="font-medium text-yellow-500">{log.nutrients.fat}</span> F</span>
        </div>
      </div>
      <button onClick={() => onDelete(log.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full">
        <TrashIcon className="w-5 h-5"/>
      </button>
    </div>
  );
};

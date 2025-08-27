import React from 'react';
import { SummaryCard } from './SummaryCard';
import { NutrientChart } from './NutrientChart';
import { FoodCard } from './FoodCard';
import { ProgressTracker } from './ProgressTracker';
import type { FoodLog, WeightEntry } from '../types';
import { ChartIcon, FlameIcon, ForkKnifeIcon, TargetIcon } from './icons';

interface DashboardProps {
  foodLogs: FoodLog[];
  dailyTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tdee: number;
  onDeleteFood: (id: number) => void;
  weightEntries: WeightEntry[];
  onAddWeightEntry: (entry: WeightEntry) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ foodLogs, dailyTotals, tdee, onDeleteFood, weightEntries, onAddWeightEntry }) => {
  const remainingCalories = tdee - dailyTotals.calories;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          icon={<ForkKnifeIcon className="w-8 h-8 text-blue-500" />}
          title="แคลอรี่ที่ทาน"
          value={`${Math.round(dailyTotals.calories)}`}
          unit="kcal"
          color="blue"
        />
        <SummaryCard 
          icon={<FlameIcon className="w-8 h-8 text-orange-500" />}
          title="แคลอรี่ที่เหลือ"
          value={`${Math.round(remainingCalories)}`}
          unit="kcal"
          color="orange"
        />
        <SummaryCard 
          icon={<TargetIcon className="w-8 h-8 text-emerald-500" />}
          title="เป้าหมาย"
          value={`${tdee}`}
          unit="kcal"
          color="emerald"
        />
        <SummaryCard 
          icon={<ChartIcon className="w-8 h-8 text-purple-500" />}
          title="โปรตีน"
          value={`${Math.round(dailyTotals.protein)}`}
          unit="g"
          color="purple"
        />
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">รายการอาหารวันนี้</h2>
          {foodLogs.length > 0 ? (
            <div className="space-y-4">
              {foodLogs.map(log => (
                <FoodCard key={log.id} log={log} onDelete={onDeleteFood} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500">
              <p>ยังไม่มีรายการอาหารสำหรับวันนี้</p>
              <p>คลิกปุ่ม '+' เพื่อเริ่มบันทึก</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">สัดส่วนสารอาหาร</h2>
            <NutrientChart 
              protein={dailyTotals.protein} 
              carbs={dailyTotals.carbs} 
              fat={dailyTotals.fat} 
            />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
             <ProgressTracker entries={weightEntries} onAddEntry={onAddWeightEntry} />
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AddFoodModal } from './components/AddFoodModal';
import { PlusIcon } from './components/icons';
import type { FoodLog, WeightEntry } from './types';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([
    // Sample data
    { date: '2024-07-15', weight: 80.5 },
    { date: '2024-07-22', weight: 79.8 },
    { date: '2024-07-29', weight: 79.2 },
  ]);

  const handleAddFood = (food: Omit<FoodLog, 'id'>) => {
    const newFoodLog: FoodLog = {
      ...food,
      id: Date.now(),
    };
    setFoodLogs(prevLogs => [...prevLogs, newFoodLog]);
    setIsModalOpen(false);
  };
  
  const handleDeleteFood = (id: number) => {
    setFoodLogs(prevLogs => prevLogs.filter(log => log.id !== id));
  };

  const handleAddWeightEntry = (entry: WeightEntry) => {
    setWeightEntries(prevEntries => {
      // Sort entries by date after adding
      const updatedEntries = [...prevEntries, entry];
      return updatedEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
  };
  
  const dailyTotals = useMemo(() => {
    return foodLogs.reduce(
      (totals, log) => {
        totals.calories += log.nutrients.calories;
        totals.protein += log.nutrients.protein;
        totals.carbs += log.nutrients.carbs;
        totals.fat += log.nutrients.fat;
        return totals;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [foodLogs]);

  // Example TDEE, in a real app this would be calculated based on user data
  const TDEE = 2000;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <Dashboard 
          foodLogs={foodLogs} 
          dailyTotals={dailyTotals} 
          tdee={TDEE}
          onDeleteFood={handleDeleteFood}
          weightEntries={weightEntries}
          onAddWeightEntry={handleAddWeightEntry}
        />
      </main>
      
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-label="เพิ่มรายการอาหาร"
      >
        <PlusIcon className="w-8 h-8" />
      </button>

      {isModalOpen && (
        <AddFoodModal
          onClose={() => setIsModalOpen(false)}
          onAddFood={handleAddFood}
        />
      )}
    </div>
  );
};

export default App;
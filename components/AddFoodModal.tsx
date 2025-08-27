import React, { useState, useRef } from 'react';
import { analyzeFoodImage } from '../services/geminiService';
import type { FoodLog, Nutrients, MealType } from '../types';
import { MealType as MealTypeEnum } from '../types';
import { Spinner } from './Spinner';
import { CameraIcon, ManualIcon, XIcon } from './icons';

interface AddFoodModalProps {
  onClose: () => void;
  onAddFood: (food: Omit<FoodLog, 'id'>) => void;
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({ onClose, onAddFood }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('1 หน่วยบริโภค');
  const [mealType, setMealType] = useState<MealType>(MealTypeEnum.Breakfast);
  const [nutrients, setNutrients] = useState<Nutrients>({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<{data: string, mimeType: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNutrientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNutrients(prev => ({ ...prev, [name]: Number(value) || 0 }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setBase64Image({ data: result.split(',')[1], mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAnalyzeImage = async () => {
    if (!base64Image) {
      setError("กรุณาเลือกรูปภาพก่อน");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeFoodImage(base64Image.data, base64Image.mimeType);
      setName(result.name);
      setNutrients(result.nutrients);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || nutrients.calories <= 0) {
      setError("กรุณากรอกชื่ออาหารและแคลอรี่");
      return;
    }
    onAddFood({ name, mealType, nutrients, imageUrl: imagePreview ?? undefined, amount });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">เพิ่มรายการอาหาร</h2>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Image Section */}
            <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="mx-auto max-h-48 rounded-md mb-4" />
              ) : (
                <div className="py-8">
                  <CameraIcon className="mx-auto w-12 h-12 text-slate-400 mb-2"/>
                  <p className="text-slate-500">อัปโหลดรูปภาพอาหาร</p>
                </div>
              )}
              <div className="flex justify-center gap-3">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg">
                    เลือกรูป
                  </button>
                  <button type="button" onClick={handleAnalyzeImage} disabled={!imagePreview || isLoading} className="bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-600 disabled:bg-emerald-300 flex items-center justify-center">
                     {isLoading ? <Spinner /> : 'วิเคราะห์ด้วย AI'}
                  </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* Manual Entry Section */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 text-slate-600">
                <ManualIcon className="w-5 h-5"/>
                <h3 className="font-semibold">หรือกรอกข้อมูลด้วยตนเอง</h3>
              </div>
               <div>
                <label htmlFor="mealType" className="block text-sm font-medium text-slate-700 mb-1">มื้ออาหาร</label>
                <select id="mealType" value={mealType} onChange={e => setMealType(e.target.value as MealType)} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500">
                  {Object.values(MealTypeEnum).map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">ชื่ออาหาร</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500" placeholder="เช่น ข้าวกะเพราไก่ไข่ดาว" />
              </div>
               <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">ปริมาณ</label>
                <input type="text" id="amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="calories" className="block text-sm font-medium text-slate-700 mb-1">แคลอรี่ (kcal)</label>
                  <input type="number" id="calories" name="calories" value={nutrients.calories} onChange={handleNutrientChange} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                 <div>
                  <label htmlFor="protein" className="block text-sm font-medium text-slate-700 mb-1">โปรตีน (g)</label>
                  <input type="number" id="protein" name="protein" value={nutrients.protein} onChange={handleNutrientChange} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                 <div>
                  <label htmlFor="carbs" className="block text-sm font-medium text-slate-700 mb-1">คาร์โบไฮเดรต (g)</label>
                  <input type="number" id="carbs" name="carbs" value={nutrients.carbs} onChange={handleNutrientChange} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                 <div>
                  <label htmlFor="fat" className="block text-sm font-medium text-slate-700 mb-1">ไขมัน (g)</label>
                  <input type="number" id="fat" name="fat" value={nutrients.fat} onChange={handleNutrientChange} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-slate-50 rounded-b-xl flex justify-end gap-3">
            <button type="button" onClick={onClose} className="bg-white border border-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-50">
              ยกเลิก
            </button>
            <button type="submit" className="bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-600">
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
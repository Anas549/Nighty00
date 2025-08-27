export enum MealType {
  Breakfast = 'มื้อเช้า',
  Lunch = 'มื้อกลางวัน',
  Dinner = 'มื้อเย็น',
  Snack = 'ของว่าง',
}

export interface Nutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodLog {
  id: number;
  name: string;
  mealType: MealType;
  nutrients: Nutrients;
  imageUrl?: string;
  amount: string;
}

export interface WeightEntry {
  date: string; // YYYY-MM-DD format
  weight: number;
}

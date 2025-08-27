import React from 'react';
import { LogoIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <LogoIcon className="w-10 h-10 text-emerald-500" />
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            ผู้ช่วยลดน้ำหนักอัจฉริยะ
          </h1>
        </div>
        {/* Placeholder for user profile/menu */}
        <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
      </div>
    </header>
  );
};

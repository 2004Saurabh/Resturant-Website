import React from 'react';
import FoodCard from './FoodCard';

export default function FoodGrid({ foods, emptyMessage = 'No culinary dishes found matching your criteria.' }) {
  if (!foods || foods.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[#D4AF37] mb-4">
          <span className="font-serif text-2xl font-bold">N</span>
        </div>
        <h3 className="font-serif text-xl text-[#F7F4EE]">No Courses Found</h3>
        <p className="text-xs text-[#8E8E99] max-w-sm mt-1">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {foods.map(dish => (
        <FoodCard key={dish.id} dish={dish} />
      ))}
    </div>
  );
}

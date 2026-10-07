import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/menu?category=${category.id}`}
      className="group relative h-80 rounded-3xl overflow-hidden border border-white/10 block bg-[#121215]"
    >
      {/* Background Image */}
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        loading="lazy"
      />

      {/* Dark Luxury Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

      {/* Top Badge */}
      {category.badge && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold bg-black/60 border border-white/20 text-[#D4AF37] backdrop-blur-md">
            {category.badge}
          </span>
        </div>
      )}

      {/* Top Right Arrow Indicator */}
      <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 border border-white/20 text-[#F7F4EE] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] backdrop-blur-md">
        <ArrowUpRight className="w-4 h-4" />
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 inset-x-0 p-6 z-10 flex flex-col justify-end">
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] font-semibold mb-1">
          {category.itemCount} Curated Dishes
        </span>
        <h3 className="font-serif text-2xl font-bold text-[#F7F4EE] group-hover:text-[#D4AF37] transition-colors">
          {category.name}
        </h3>
        <p className="text-xs text-[#A0A0AA] line-clamp-2 mt-1 leading-relaxed">
          {category.tagline}
        </p>
      </div>
    </Link>
  );
}

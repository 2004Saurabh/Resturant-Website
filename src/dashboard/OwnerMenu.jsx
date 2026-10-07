import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Search, 
  ToggleLeft, 
  ToggleRight, 
  Sparkles,
  RotateCcw,
  Image as ImageIcon
} from 'lucide-react';
import { useFood } from '../context/FoodContext';
import { CATEGORIES } from '../data/categories';
import { formatPrice } from '../utils/price';

export default function OwnerMenu() {
  const { foods, addDish, updateDish, deleteDish, toggleAvailability, resetMenuToDefault } = useFood();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Veg Starters',
    categoryId: 'veg-starters',
    cuisine: 'North Indian',
    type: 'veg',
    price: 20.00,
    rating: 4.9,
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    description: '',
    ingredients: 'Fresh herbs, sea salt, olive oil',
    calories: 450,
    spiceLevel: 'Medium',
    preparationTime: '20 mins',
    bestseller: false,
    chefSpecial: false,
    available: true
  });

  const handleOpenAdd = () => {
    setEditingDish(null);
    setFormData({
      name: '',
      category: 'Veg Starters',
      categoryId: 'veg-starters',
      cuisine: 'North Indian',
      type: 'veg',
      price: 20.00,
      rating: 4.9,
      reviews: 120,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
      description: '',
      ingredients: 'Fresh herbs, sea salt, olive oil',
      calories: 450,
      spiceLevel: 'Medium',
      preparationTime: '20 mins',
      bestseller: false,
      chefSpecial: false,
      available: true
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (dish) => {
    setEditingDish(dish);
    setFormData({
      ...dish,
      ingredients: Array.isArray(dish.ingredients) ? dish.ingredients.join(', ') : dish.ingredients
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 20,
      calories: parseInt(formData.calories) || 400,
      ingredients: typeof formData.ingredients === 'string'
        ? formData.ingredients.split(',').map(s => s.trim()).filter(Boolean)
        : formData.ingredients
    };

    if (editingDish) {
      updateDish(editingDish.id, payload);
      window.dispatchEvent(new CustomEvent('nocturne_toast', {
        detail: { title: 'Dish Updated', message: `${payload.name} was successfully modified.`, type: 'success' }
      }));
    } else {
      addDish(payload);
      window.dispatchEvent(new CustomEvent('nocturne_toast', {
        detail: { title: 'Dish Created', message: `${payload.name} added to the active menu.`, type: 'success' }
      }));
    }

    setModalOpen(false);
  };

  const filteredFoods = foods.filter(dish => {
    if (selectedCat !== 'all' && dish.categoryId !== selectedCat && dish.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return dish.name.toLowerCase().includes(q) || dish.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#F7F4EE]">
            Menu & Dish Management
          </h2>
          <p className="text-xs text-[#8E8E99]">
            Add culinary creations, toggle availability, adjust pricing, and mark Michelin chef specials.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={resetMenuToDefault}
            className="px-4 py-2.5 rounded-xl border border-white/10 text-xs text-[#8E8E99] hover:text-white flex items-center gap-1.5"
            title="Reset menu to default template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#121215] border border-white/5">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8E8E99] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search dishes to edit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2 text-xs text-[#F7F4EE] placeholder-[#6E6E78] focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="w-full sm:w-auto bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
        >
          <option value="all" className="bg-[#141418]">All Categories ({foods.length})</option>
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.id} className="bg-[#141418]">{c.name}</option>
          ))}
        </select>
      </div>

      {/* Dish List Table */}
      <div className="bg-[#121215] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-[#8E8E99] bg-white/5">
                <th className="p-4">Dish</th>
                <th className="p-4">Category</th>
                <th className="p-4">Type</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Badges</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredFoods.map(dish => (
                <tr key={dish.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={dish.image} alt="" className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                      <div>
                        <p className="font-semibold text-sm text-[#F7F4EE]">{dish.name}</p>
                        <p className="text-[11px] text-[#8E8E99] line-clamp-1">{dish.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[#8E8E99] font-medium">{dish.category}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      dish.type === 'veg' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444]/20 text-[#EF4444]'
                    }`}>
                      {dish.type}
                    </span>
                  </td>
                  <td className="p-4 font-serif font-bold text-sm text-gold-gradient">
                    {formatPrice(dish.price)}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleAvailability(dish.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                        dish.available ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${dish.available ? 'bg-[#10B981]' : 'bg-neutral-500'}`} />
                      <span>{dish.available ? 'Available' : 'Disabled'}</span>
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {dish.bestseller && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-[#D4AF37]/20 text-[#D4AF37]">
                          Bestseller
                        </span>
                      )}
                      {dish.chefSpecial && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-[#881A2D]/40 text-[#EF4444]">
                          Special
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(dish)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#8E8E99] hover:text-[#D4AF37] transition-colors"
                        title="Edit Dish"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteDish(dish.id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#8E8E99] hover:text-[#EF4444] transition-colors"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form for Add/Edit */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#141418] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-serif text-xl font-bold text-[#F7F4EE]">
                  {editingDish ? 'Edit Haute Dish' : 'Create New Haute Dish'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-[#8E8E99] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[#8E8E99]">Dish Title</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#8E8E99]">Category</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => {
                        const sel = CATEGORIES.find(c => c.id === e.target.value);
                        setFormData({
                          ...formData,
                          categoryId: e.target.value,
                          category: sel ? sel.name : formData.category
                        });
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id} className="bg-[#141418]">{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#8E8E99]">Price (₹)</label>
                    <input
                      type="number"
                      step="5"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#8E8E99]">Dietary Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="veg" className="bg-[#141418]">Pure Vegetarian</option>
                      <option value="non-veg" className="bg-[#141418]">Non-Vegetarian</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#8E8E99]">Spice Level</label>
                    <select
                      value={formData.spiceLevel}
                      onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Mild" className="bg-[#141418]">Mild</option>
                      <option value="Medium" className="bg-[#141418]">Medium</option>
                      <option value="Hot" className="bg-[#141418]">Hot</option>
                      <option value="Fiery" className="bg-[#141418]">Fiery</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#8E8E99]">Calories (kcal)</label>
                    <input
                      type="number"
                      value={formData.calories}
                      onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#8E8E99]">Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#8E8E99]">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#8E8E99]">Ingredients (comma separated)</label>
                  <input
                    type="text"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.bestseller}
                      onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                      className="rounded border-white/20 text-[#D4AF37] focus:ring-0 bg-transparent"
                    />
                    <span className="text-[#F7F4EE]">Mark Bestseller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.chefSpecial}
                      onChange={(e) => setFormData({ ...formData, chefSpecial: e.target.checked })}
                      className="rounded border-white/20 text-[#D4AF37] focus:ring-0 bg-transparent"
                    />
                    <span className="text-[#F7F4EE]">Chef Special</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-white/10 text-xs text-[#8E8E99] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-wider"
                  >
                    Save Dish Changes
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

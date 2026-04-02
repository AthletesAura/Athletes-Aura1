
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Search, Check, X } from 'lucide-react';
import { StorageService } from '../services/storage.ts';
import { Program } from '../types.ts';
import { ImageUpload } from '../components/ImageUpload.tsx';
import { ConfirmModal } from '../components/ConfirmModal.tsx';

export const AdminPrograms: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const loadPrograms = async () => {
      setPrograms(await StorageService.getPrograms());
      const settings = await StorageService.getSettings();
      setCategories(settings.programCategories || []);
    };
    loadPrograms();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    const updatedCategories = [...categories, newCategory.trim()];
    const settings = await StorageService.getSettings();
    await StorageService.saveSettings({ ...settings, programCategories: updatedCategories });
    setCategories(updatedCategories);
    if (editingProgram) {
      setEditingProgram({ ...editingProgram, category: newCategory.trim() });
    }
    setNewCategory('');
    setShowNewCategoryInput(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram) return;

    if (isAdding) {
      await StorageService.saveProgram(editingProgram);
    } else {
      await StorageService.updateProgram(editingProgram);
    }

    setPrograms(await StorageService.getPrograms());
    setEditingProgram(null);
    setIsAdding(false);
  };

  const handleDelete = async () => {
    if (confirmDeleteId) {
      await StorageService.deleteProgram(confirmDeleteId);
      setPrograms(await StorageService.getPrograms());
      setConfirmDeleteId(null);
    }
  };

  const filteredPrograms = programs.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const emptyProgram: Program = {
    id: '',
    name: '',
    description: '',
    category: categories[0] || 'General Fitness',
    price: '',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isEnabled: true
  };

  const handleAddNew = () => {
    setEditingProgram({ ...emptyProgram, id: Date.now().toString() });
    setIsAdding(true);
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Programs</h1>
          <p className="text-gray-500">Create, update, or remove training programs from the website.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-black text-white px-6 py-3 rounded-xl shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2 font-bold"
        >
          <Plus size={20} /> Add New Program
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Program</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPrograms.map((program) => (
                <tr key={program.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img 
                          src={program.image} 
                          alt={program.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{program.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{program.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                      {program.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {program.price ? (program.price.includes('₹') ? program.price : `₹${program.price}`) : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {program.isEnabled ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                        <Check size={14} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                        <X size={14} /> Disabled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setEditingProgram(program); setIsAdding(false); }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => setConfirmDeleteId(program.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPrograms.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">No programs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {editingProgram && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">{isAdding ? 'Add New Program' : 'Edit Program'}</h2>
              <button onClick={() => setEditingProgram(null)} className="text-gray-400 hover:text-black transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Program Name</label>
                  <input 
                    type="text" 
                    required
                    value={editingProgram.name}
                    onChange={(e) => setEditingProgram({...editingProgram, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                    <button 
                      type="button"
                      onClick={() => setShowNewCategoryInput(!showNewCategoryInput)}
                      className="text-[10px] text-secondary hover:underline font-bold uppercase"
                    >
                      {showNewCategoryInput ? 'Cancel' : '+ Create New Category'}
                    </button>
                  </div>
                  
                  {showNewCategoryInput ? (
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New category name"
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all text-sm"
                      />
                      <button 
                        type="button"
                        onClick={handleAddCategory}
                        className="px-4 py-2 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <select 
                      value={editingProgram.category}
                      onChange={(e) => setEditingProgram({...editingProgram, category: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white"
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={editingProgram.description}
                  onChange={(e) => setEditingProgram({...editingProgram, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price (Display Text)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. ₹5,000/mo"
                    value={editingProgram.price || ''}
                    onChange={(e) => setEditingProgram({...editingProgram, price: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Discount % (Optional)</label>
                  <input 
                    type="number" 
                    value={editingProgram.discountPercentage || ''}
                    onChange={(e) => setEditingProgram({...editingProgram, discountPercentage: parseInt(e.target.value) || undefined})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <ImageUpload 
                  value={editingProgram.image}
                  onChange={(url) => setEditingProgram({...editingProgram, image: url})}
                  label="Program Image"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isEnabled"
                  checked={editingProgram.isEnabled}
                  onChange={(e) => setEditingProgram({...editingProgram, isEnabled: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="isEnabled" className="text-sm font-bold text-gray-700">Show on website</label>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setEditingProgram(null)}
                  className="flex-1 px-6 py-4 rounded-xl font-bold border-2 border-gray-100 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 rounded-xl font-bold bg-black text-white hover:bg-gray-800 transition-all shadow-lg"
                >
                  {isAdding ? 'Create Program' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!confirmDeleteId}
        title="Delete Program"
        message="Are you sure you want to delete this program? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};

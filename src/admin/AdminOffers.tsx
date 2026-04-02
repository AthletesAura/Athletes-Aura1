
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Search, X, Check, Tag } from 'lucide-react';
import { StorageService } from '../services/storage.ts';
import { Offer } from '../types.ts';
import { ImageUpload } from '../components/ImageUpload.tsx';
import { ConfirmModal } from '../components/ConfirmModal.tsx';

export const AdminOffers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const loadOffers = async () => {
      setOffers(await StorageService.getOffers());
    };
    loadOffers();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;

    if (isAdding) {
      await StorageService.saveOffer(editingOffer);
    } else {
      await StorageService.updateOffer(editingOffer);
    }

    setOffers(await StorageService.getOffers());
    setEditingOffer(null);
    setIsAdding(false);
  };

  const handleDelete = async () => {
    if (confirmDeleteId) {
      await StorageService.deleteOffer(confirmDeleteId);
      setOffers(await StorageService.getOffers());
      setConfirmDeleteId(null);
    }
  };

  const filteredOffers = offers.filter(o => 
    o.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const emptyOffer: Offer = {
    id: '',
    title: '',
    description: '',
    discountText: '',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isEnabled: true
  };

  const handleAddNew = () => {
    setEditingOffer({ ...emptyOffer, id: Date.now().toString() });
    setIsAdding(true);
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Special Offers</h1>
          <p className="text-gray-500">Manage limited-time deals and promotions shown on the homepage.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-black text-white px-6 py-3 rounded-xl shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2 font-bold"
        >
          <Plus size={20} /> Add New Offer
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search offers..."
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
                <th className="px-6 py-4">Offer</th>
                <th className="px-6 py-4">Discount Text</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img 
                          src={offer.image} 
                          alt={offer.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{offer.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{offer.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {offer.discountText}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {offer.isEnabled ? (
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
                        onClick={() => { setEditingOffer(offer); setIsAdding(false); }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => setConfirmDeleteId(offer.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOffers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400">No offers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {editingOffer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">{isAdding ? 'Add New Offer' : 'Edit Offer'}</h2>
              <button onClick={() => setEditingOffer(null)} className="text-gray-400 hover:text-black transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Offer Title</label>
                <input 
                  type="text" 
                  required
                  value={editingOffer.title}
                  onChange={(e) => setEditingOffer({...editingOffer, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Summer Special"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={editingOffer.description}
                  onChange={(e) => setEditingOffer({...editingOffer, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Discount Text (Badge)</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    required
                    value={editingOffer.discountText}
                    onChange={(e) => setEditingOffer({...editingOffer, discountText: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="e.g. 20% OFF"
                  />
                </div>
              </div>

              <div>
                <ImageUpload 
                  value={editingOffer.image}
                  onChange={(url) => setEditingOffer({...editingOffer, image: url})}
                  label="Offer Image"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isEnabled"
                  checked={editingOffer.isEnabled}
                  onChange={(e) => setEditingOffer({...editingOffer, isEnabled: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="isEnabled" className="text-sm font-bold text-gray-700">Show on homepage</label>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setEditingOffer(null)}
                  className="flex-1 px-6 py-4 rounded-xl font-bold border-2 border-gray-100 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 rounded-xl font-bold bg-black text-white hover:bg-gray-800 transition-all shadow-lg"
                >
                  {isAdding ? 'Create Offer' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!confirmDeleteId}
        title="Delete Offer"
        message="Are you sure you want to delete this offer? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};

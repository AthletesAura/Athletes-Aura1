
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Check, X, Zap } from 'lucide-react';
import { StorageService } from '../services/storage.ts';
import { MembershipTier } from '../types.ts';
import { ConfirmModal } from '../components/ConfirmModal.tsx';

export const AdminMemberships: React.FC = () => {
  const [memberships, setMemberships] = useState<MembershipTier[]>([]);
  const [editingTier, setEditingTier] = useState<MembershipTier | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [featuresText, setFeaturesText] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const loadMemberships = async () => {
      setMemberships(await StorageService.getMemberships());
    };
    loadMemberships();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTier) return;

    const tierToSave = {
      ...editingTier,
      features: featuresText.split('\n').filter(f => f.trim() !== '')
    };

    if (isAdding) {
      await StorageService.saveMembership(tierToSave);
    } else {
      await StorageService.updateMembership(tierToSave);
    }

    setMemberships(await StorageService.getMemberships());
    setEditingTier(null);
    setIsAdding(false);
    setFeaturesText('');
  };

  const handleDelete = async () => {
    if (confirmDeleteId) {
      await StorageService.deleteMembership(confirmDeleteId);
      setMemberships(await StorageService.getMemberships());
      setConfirmDeleteId(null);
    }
  };

  const emptyTier: MembershipTier = {
    id: '',
    name: '',
    description: '',
    features: [],
    highlight: false,
    pricing: {
      monthly: 0
    }
  };

  const handleAddNew = () => {
    setEditingTier({ ...emptyTier, id: Date.now().toString() });
    setFeaturesText('');
    setIsAdding(true);
  };

  const handleEdit = (tier: MembershipTier) => {
    setEditingTier(tier);
    setFeaturesText(tier.features.join('\n'));
    setIsAdding(false);
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Membership Tiers</h1>
          <p className="text-gray-500">Configure the pricing and features for your membership plans.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-black text-white px-6 py-3 rounded-xl shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2 font-bold"
        >
          <Plus size={20} /> Add New Tier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {memberships.map((tier) => (
          <motion.div
            key={tier.id}
            layout
            className={`bg-white p-8 rounded-3xl shadow-sm border-2 transition-all relative ${
              tier.highlight ? 'border-black' : 'border-gray-100'
            }`}
          >
            {tier.highlight && (
              <div className="absolute -top-3 left-6 bg-black text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                <Zap size={10} fill="currentColor" /> HIGHLIGHTED
              </div>
            )}

            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                <p className="text-sm text-gray-500">{tier.description}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(tier)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => setConfirmDeleteId(tier.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="mb-8 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Monthly</span>
                <span className="font-bold">₹{tier.pricing.monthly.toLocaleString()}</span>
              </div>
              {tier.pricing.quarterly && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Quarterly</span>
                  <span className="font-bold">₹{tier.pricing.quarterly.toLocaleString()}</span>
                </div>
              )}
              {tier.pricing.yearly && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Yearly</span>
                  <span className="font-bold">₹{tier.pricing.yearly.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Features</p>
              {tier.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <Check size={14} className="text-green-500 mt-1 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {editingTier && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">{isAdding ? 'Add New Tier' : 'Edit Tier'}</h2>
              <button onClick={() => setEditingTier(null)} className="text-gray-400 hover:text-black transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tier Name</label>
                  <input 
                    type="text" 
                    required
                    value={editingTier.name}
                    onChange={(e) => setEditingTier({...editingTier, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Short Description</label>
                  <input 
                    type="text" 
                    required
                    value={editingTier.description}
                    onChange={(e) => setEditingTier({...editingTier, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Monthly (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={editingTier.pricing.monthly}
                    onChange={(e) => setEditingTier({...editingTier, pricing: {...editingTier.pricing, monthly: parseInt(e.target.value) || 0}})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quarterly (₹)</label>
                  <input 
                    type="number" 
                    value={editingTier.pricing.quarterly || ''}
                    onChange={(e) => setEditingTier({...editingTier, pricing: {...editingTier.pricing, quarterly: parseInt(e.target.value) || undefined}})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Biannual (₹)</label>
                  <input 
                    type="number" 
                    value={editingTier.pricing.biannual || ''}
                    onChange={(e) => setEditingTier({...editingTier, pricing: {...editingTier.pricing, biannual: parseInt(e.target.value) || undefined}})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Yearly (₹)</label>
                  <input 
                    type="number" 
                    value={editingTier.pricing.yearly || ''}
                    onChange={(e) => setEditingTier({...editingTier, pricing: {...editingTier.pricing, yearly: parseInt(e.target.value) || undefined}})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Features (One per line)</label>
                <textarea 
                  required
                  rows={5}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Open Gym Access"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="highlight"
                  checked={editingTier.highlight}
                  onChange={(e) => setEditingTier({...editingTier, highlight: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="highlight" className="text-sm font-bold text-gray-700">Highlight this plan (Most Popular)</label>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setEditingTier(null)}
                  className="flex-1 px-6 py-4 rounded-xl font-bold border-2 border-gray-100 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 rounded-xl font-bold bg-black text-white hover:bg-gray-800 transition-all shadow-lg"
                >
                  {isAdding ? 'Create Tier' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!confirmDeleteId}
        title="Delete Membership Tier"
        message="Are you sure you want to delete this membership tier? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};

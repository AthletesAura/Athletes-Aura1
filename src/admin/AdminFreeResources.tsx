
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Search, Download, X, FileText } from 'lucide-react';
import { StorageService } from '../services/storage.ts';
import { FreeResource } from '../types.ts';
import { ConfirmModal } from '../components/ConfirmModal.tsx';

export const AdminFreeResources: React.FC = () => {
  const [resources, setResources] = useState<FreeResource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingResource, setEditingResource] = useState<FreeResource | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = StorageService.subscribeFreeResources((items) => {
      setResources(items);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;

    if (isAdding) {
      await StorageService.saveFreeResource(editingResource);
    } else {
      await StorageService.updateFreeResource(editingResource);
    }

    setEditingResource(null);
    setIsAdding(false);
  };

  const handleDelete = async () => {
    if (confirmDeleteId) {
      await StorageService.deleteFreeResource(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const emptyResource: FreeResource = {
    id: '',
    title: '',
    type: 'Diet',
    link: '',
    description: ''
  };

  const handleAddNew = () => {
    setEditingResource({ ...emptyResource, id: Date.now().toString() });
    setIsAdding(true);
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Free Resources</h1>
          <p className="text-gray-500">Add or update PDFs and guides shared on the Custom Plans page.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-black text-white px-6 py-3 rounded-xl shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2 font-bold"
        >
          <Plus size={20} /> Add New Resource
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search resources..."
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
                <th className="px-6 py-4">Resource</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Link</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredResources.map((resource) => (
                <tr key={resource.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{resource.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{resource.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${resource.type === 'Diet' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {resource.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <a 
                      href={resource.link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-gray-400 hover:text-black flex items-center gap-1 text-sm transition-colors"
                    >
                      <Download size={14} /> View Link
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setEditingResource(resource); setIsAdding(false); }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => setConfirmDeleteId(resource.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredResources.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400">No resources found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {editingResource && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">{isAdding ? 'Add New Resource' : 'Edit Resource'}</h2>
              <button onClick={() => setEditingResource(null)} className="text-gray-400 hover:text-black transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title</label>
                  <input 
                    type="text" 
                    required
                    value={editingResource.title}
                    onChange={(e) => setEditingResource({...editingResource, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="e.g. 7-Day Fat Loss Guide"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Type</label>
                  <select 
                    value={editingResource.type}
                    onChange={(e) => setEditingResource({...editingResource, type: e.target.value as 'Diet' | 'Workout'})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="Diet">Diet</option>
                    <option value="Workout">Workout</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Resource Link (URL)</label>
                <input 
                  type="url" 
                  required
                  value={editingResource.link}
                  onChange={(e) => setEditingResource({...editingResource, link: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  placeholder="https://example.com/guide.pdf"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description (Optional)</label>
                <textarea 
                  rows={3}
                  value={editingResource.description || ''}
                  onChange={(e) => setEditingResource({...editingResource, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  placeholder="Briefly describe what this resource is about..."
                />
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="flex-1 px-6 py-4 rounded-xl font-bold border-2 border-gray-100 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 rounded-xl font-bold bg-black text-white hover:bg-gray-800 transition-all shadow-lg"
                >
                  {isAdding ? 'Create Resource' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!confirmDeleteId}
        title="Delete Resource"
        message="Are you sure you want to delete this resource? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};

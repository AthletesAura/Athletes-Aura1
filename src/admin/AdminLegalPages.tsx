
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Search, X, Eye, EyeOff, FileText, ExternalLink } from 'lucide-react';
import { StorageService } from '../services/storage';
import { LegalPage } from '../types';
import { ConfirmModal } from '../components/ConfirmModal';

export const AdminLegalPages: React.FC = () => {
  const [pages, setPages] = useState<LegalPage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPage, setEditingPage] = useState<LegalPage | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    const loadPages = async () => {
      setPages(await StorageService.getLegalPages());
    };
    loadPages();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;

    if (isAdding) {
      await StorageService.saveLegalPage({ ...editingPage, lastUpdated: new Date().toISOString() });
    } else {
      await StorageService.updateLegalPage({ ...editingPage, lastUpdated: new Date().toISOString() });
    }

    setPages(await StorageService.getLegalPages());
    setEditingPage(null);
    setIsAdding(false);
  };

  const handleDelete = async () => {
    if (confirmDeleteId) {
      await StorageService.deleteLegalPage(confirmDeleteId);
      setPages(await StorageService.getLegalPages());
      setConfirmDeleteId(null);
    }
  };

  const filteredPages = pages.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const emptyPage: LegalPage = {
    id: '',
    title: '',
    slug: '',
    content: '',
    isVisible: true,
    lastUpdated: new Date().toISOString()
  };

  const handleAddNew = () => {
    setEditingPage({ ...emptyPage, id: Date.now().toString() });
    setIsAdding(true);
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Legal Pages</h1>
          <p className="text-gray-500">Manage Privacy Policy, Terms, and other legal documents.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-black text-white px-6 py-3 rounded-xl shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2 font-bold"
        >
          <Plus size={20} /> Add New Page
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search pages..."
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
                <th className="px-6 py-4">Page Title</th>
                <th className="px-6 py-4">Slug / URL</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-gray-400" />
                      <p className="font-bold text-gray-900">{page.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">/legal/{page.slug}</code>
                  </td>
                  <td className="px-6 py-4">
                    {page.isVisible ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                        <Eye size={14} /> Visible
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                        <EyeOff size={14} /> Hidden
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a 
                        href={`#/legal/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <ExternalLink size={18} />
                      </a>
                      <button 
                        onClick={() => { setEditingPage(page); setIsAdding(false); }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => setConfirmDeleteId(page.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPages.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400">No legal pages found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {editingPage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-900">{isAdding ? 'Add New Legal Page' : 'Edit Legal Page'}</h2>
                <div className="flex bg-gray-200 p-1 rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setPreviewMode(false)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${!previewMode ? 'bg-white text-black shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Edit size={14} /> Editor
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPreviewMode(true)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${previewMode ? 'bg-white text-black shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Eye size={14} /> Preview
                  </button>
                </div>
              </div>
              <button onClick={() => { setEditingPage(null); setPreviewMode(false); }} className="text-gray-400 hover:text-black transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              {!previewMode ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Page Title</label>
                      <input 
                        type="text" 
                        required
                        value={editingPage.title}
                        onChange={(e) => setEditingPage({...editingPage, title: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        placeholder="e.g. Privacy Policy"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Slug (URL path)</label>
                      <input 
                        type="text" 
                        required
                        value={editingPage.slug}
                        onChange={(e) => setEditingPage({...editingPage, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        placeholder="e.g. privacy-policy"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Content (HTML Mode Active)</label>
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">HTML Supported</span>
                    </div>
                    <textarea 
                      required
                      rows={15}
                      value={editingPage.content}
                      onChange={(e) => setEditingPage({...editingPage, content: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all font-mono text-sm"
                      placeholder="<h1>Privacy Policy</h1><p>Your content here...</p>"
                    />
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 min-h-[400px]">
                  <div className="prose prose-sm md:prose-base max-w-none" dangerouslySetInnerHTML={{ __html: editingPage.content }} />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isVisible"
                  checked={editingPage.isVisible}
                  onChange={(e) => setEditingPage({...editingPage, isVisible: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="isVisible" className="text-sm font-bold text-gray-700">Make this page visible on the website</label>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="flex-1 px-6 py-4 rounded-xl font-bold border-2 border-gray-100 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 rounded-xl font-bold bg-black text-white hover:bg-gray-800 transition-all shadow-lg"
                >
                  {isAdding ? 'Create Page' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!confirmDeleteId}
        title="Delete Legal Page"
        message="Are you sure you want to delete this legal page? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};

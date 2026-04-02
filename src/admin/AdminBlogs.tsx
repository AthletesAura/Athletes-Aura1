
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Search, X, Calendar, User, Eye } from 'lucide-react';
import { StorageService } from '../services/storage';
import { BlogPost } from '../types';
import { ImageUpload } from '../components/ImageUpload';
import { ConfirmModal } from '../components/ConfirmModal';
import { generateSlug } from '../lib/utils';

export const AdminBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    const loadBlogs = async () => {
      const data = await StorageService.getBlogs();
      setBlogs(data);
    };
    loadBlogs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;

    const blogWithSlug = {
      ...editingBlog,
      slug: generateSlug(editingBlog.title)
    };

    if (isAdding) {
      await StorageService.saveBlog(blogWithSlug);
    } else {
      await StorageService.updateBlog(blogWithSlug);
    }

    setBlogs(await StorageService.getBlogs());
    setEditingBlog(null);
    setIsAdding(false);
  };

  const handleDelete = async () => {
    if (confirmDeleteId) {
      await StorageService.deleteBlog(confirmDeleteId);
      setBlogs(await StorageService.getBlogs());
      setConfirmDeleteId(null);
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const emptyBlog: BlogPost = {
    id: '',
    title: '',
    slug: '',
    description: '',
    content: '',
    author: 'Admin',
    date: new Date().toISOString().split('T')[0],
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  };

  const handleAddNew = () => {
    setEditingBlog({ ...emptyBlog, id: Date.now().toString() });
    setIsAdding(true);
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Blog</h1>
          <p className="text-gray-500">Share insights and stories with your community.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-black text-white px-6 py-3 rounded-xl shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2 font-bold"
        >
          <Plus size={20} /> Write New Post
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search posts..."
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
                <th className="px-6 py-4">Post</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img 
                          src={blog.image} 
                          alt={blog.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{blog.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{blog.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User size={14} className="text-gray-400" /> {blog.author}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} /> {new Date(blog.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setEditingBlog(blog); setIsAdding(false); }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => setConfirmDeleteId(blog.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBlogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400">No blog posts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {editingBlog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-900">{isAdding ? 'Write New Post' : 'Edit Post'}</h2>
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
              <button onClick={() => { setEditingBlog(null); setPreviewMode(false); }} className="text-gray-400 hover:text-black transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              {!previewMode ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title</label>
                      <input 
                        type="text" 
                        required
                        value={editingBlog.title}
                        onChange={(e) => setEditingBlog({...editingBlog, title: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Author</label>
                      <input 
                        type="text" 
                        required
                        value={editingBlog.author}
                        onChange={(e) => setEditingBlog({...editingBlog, author: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Short Description</label>
                    <input 
                      type="text" 
                      required
                      value={editingBlog.description}
                      onChange={(e) => setEditingBlog({...editingBlog, description: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Content (HTML Mode Active)</label>
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">HTML Supported</span>
                    </div>
                    <textarea 
                      required
                      rows={15}
                      value={editingBlog.content}
                      onChange={(e) => setEditingBlog({...editingBlog, content: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all font-mono text-sm"
                      placeholder="<h1>Blog Post Title</h1><p>Your content here...</p>"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Date</label>
                      <input 
                        type="date" 
                        required
                        value={editingBlog.date}
                        onChange={(e) => setEditingBlog({...editingBlog, date: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <ImageUpload 
                        value={editingBlog.image}
                        onChange={(url) => setEditingBlog({...editingBlog, image: url})}
                        label="Blog Image"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 min-h-[400px]">
                  <div className="prose prose-sm md:prose-base max-w-none" dangerouslySetInnerHTML={{ __html: editingBlog.content }} />
                </div>
              )}

              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="flex-1 px-6 py-4 rounded-xl font-bold border-2 border-gray-100 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 rounded-xl font-bold bg-black text-white hover:bg-gray-800 transition-all shadow-lg"
                >
                  {isAdding ? 'Publish Post' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!confirmDeleteId}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};

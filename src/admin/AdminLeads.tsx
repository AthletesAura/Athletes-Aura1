
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Trash2, Download, Mail, Phone, Calendar, MessageSquare, ExternalLink, X } from 'lucide-react';
import { StorageService } from '../services/storage.ts';
import { Lead } from '../types.ts';
import { ConfirmModal } from '../components/ConfirmModal.tsx';

export const AdminLeads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const loadLeads = async () => {
      setLeads(await StorageService.getLeads());
    };
    loadLeads();
  }, []);

  const handleDelete = async () => {
    if (confirmDeleteId) {
      await StorageService.deleteLead(confirmDeleteId);
      setLeads(await StorageService.getLeads());
      setConfirmDeleteId(null);
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Email,Phone,Interest,Message,Date\n"
      + leads.map(l => `"${l.name}","${l.email}","${l.phone}","${l.interest}","${l.message.replace(/"/g, '""')}","${l.date}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.interest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Leads</h1>
          <p className="text-gray-500">Manage inquiries from the website's contact form.</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-white border-2 border-gray-100 text-black px-6 py-3 rounded-xl shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2 font-bold"
        >
          <Download size={20} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search leads..."
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
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Interest</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{lead.name}</p>
                    <button 
                      onClick={() => setSelectedLead(lead)}
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <MessageSquare size={12} /> View Message
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <a href={`mailto:${lead.email}`} className="text-sm text-gray-600 hover:text-black flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" /> {lead.email}
                      </a>
                      <a href={`tel:${lead.phone}`} className="text-sm text-gray-600 hover:text-black flex items-center gap-2">
                        <Phone size={14} className="text-gray-400" /> {lead.phone}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                      {lead.interest}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} /> {new Date(lead.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a 
                        href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                      >
                        <ExternalLink size={18} />
                      </a>
                      <button 
                        onClick={() => setConfirmDeleteId(lead.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">No leads found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Lead Message</h2>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-black transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center text-2xl font-bold">
                  {selectedLead.name[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedLead.name}</h3>
                  <p className="text-gray-500">{selectedLead.interest}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl mb-8">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Message</p>
                <p className="text-gray-700 leading-relaxed italic">"{selectedLead.message}"</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <a 
                  href={`mailto:${selectedLead.email}`}
                  className="flex-1 bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg"
                >
                  <Mail size={18} /> Reply via Email
                </a>
                <a 
                  href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg"
                >
                  <ExternalLink size={18} /> WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!confirmDeleteId}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};

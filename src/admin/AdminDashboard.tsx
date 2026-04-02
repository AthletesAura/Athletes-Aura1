
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, FileText, Layout, MessageSquare, TrendingUp, ArrowRight, Bell, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StorageService } from '../services/storage.ts';
import { Lead, PlanInquiry } from '../types.ts';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    leads: 0,
    inquiries: 0,
    programs: 0,
    blogs: 0
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<PlanInquiry[]>([]);

  useEffect(() => {
    const unsubLeads = StorageService.subscribeLeads((leads) => {
      setRecentLeads(leads.slice(0, 5));
      setStats(prev => ({ ...prev, leads: leads.length }));
    });

    const unsubInquiries = StorageService.subscribePlanInquiries((inquiries) => {
      setRecentInquiries(inquiries.slice(0, 5));
      setStats(prev => ({ ...prev, inquiries: inquiries.length }));
    });

    const unsubPrograms = StorageService.subscribePrograms((programs) => {
      setStats(prev => ({ ...prev, programs: programs.length }));
    });

    const unsubBlogs = StorageService.subscribeBlogs((blogs) => {
      setStats(prev => ({ ...prev, blogs: blogs.length }));
    });

    return () => {
      unsubLeads();
      unsubInquiries();
      unsubPrograms();
      unsubBlogs();
    };
  }, []);

  const statCards = [
    { title: 'Total Leads', value: stats.leads, icon: Users, color: 'bg-blue-500', link: '/admin/leads' },
    { title: 'Plan Inquiries', value: stats.inquiries, icon: MessageSquare, color: 'bg-green-500', link: '/admin/plan-inquiries' },
    { title: 'Active Programs', value: stats.programs, icon: Layout, color: 'bg-purple-500', link: '/admin/programs' },
    { title: 'Blog Posts', value: stats.blogs, icon: FileText, color: 'bg-orange-500', link: '/admin/blogs' },
  ];

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
            <Calendar size={20} className="text-gray-400" />
            <span className="font-bold text-gray-700">{new Date().toLocaleDateString()}</span>
          </div>
          <button className="bg-black text-white p-3 rounded-xl shadow-lg hover:bg-gray-800 transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-black" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
          >
            <Link to={card.link} className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-xl text-white shadow-lg`}>
                <card.icon size={24} />
              </div>
              <TrendingUp size={20} className="text-green-500" />
            </Link>
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Leads */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Recent Leads</h2>
            <Link to="/admin/leads" className="text-sm font-bold text-gray-500 hover:text-black flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">{lead.name}</p>
                  <p className="text-sm text-gray-500">{lead.interest}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{new Date(lead.date).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-400">{new Date(lead.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
            {recentLeads.length === 0 && (
              <div className="p-10 text-center text-gray-400">No recent leads found.</div>
            )}
          </div>
        </motion.div>

        {/* Recent Plan Inquiries */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Plan Inquiries</h2>
            <Link to="/admin/plan-inquiries" className="text-sm font-bold text-gray-500 hover:text-black flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    inquiry.type === 'Diet' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {inquiry.type[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{inquiry.name}</p>
                    <p className="text-sm text-gray-500">{inquiry.type} Plan Inquiry</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{new Date(inquiry.date).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-400">{new Date(inquiry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
            {recentInquiries.length === 0 && (
              <div className="p-10 text-center text-gray-400">No recent inquiries found.</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

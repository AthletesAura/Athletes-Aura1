
import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Dumbbell, FileText, Settings, LogOut, MessageSquare, Tag, Award, CreditCard, Activity, Scale, HeartHandshake, Download } from 'lucide-react';
import { auth } from '../firebase';

interface Props {
    children: React.ReactNode;
}

export const AdminLayout: React.FC<Props> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        sessionStorage.removeItem('admin_session');
        await auth.signOut();
        navigate('/admin/login');
    };

    const navItems = [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { label: 'Programs', path: '/admin/programs', icon: Dumbbell },
        { label: 'Coaches', path: '/admin/coaches', icon: Users },
        { label: 'Memberships', path: '/admin/memberships', icon: CreditCard },
        { label: 'Testimonials', path: '/admin/testimonials', icon: Award },
        { label: 'Custom Plans', path: '/admin/plan-inquiries', icon: Activity },
        { label: 'Free Resources', path: '/admin/free-resources', icon: Download },
        { label: 'Counseling', path: '/admin/counseling', icon: HeartHandshake },
        { label: 'Leads', path: '/admin/leads', icon: MessageSquare },
        { label: 'Blogs', path: '/admin/blogs', icon: FileText },
        { label: 'Offers', path: '/admin/offers', icon: Tag },
        { label: 'Legal Pages', path: '/admin/legal-pages', icon: Scale },
        { label: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
                <div className="p-6 border-b border-gray-800 flex flex-col gap-1">
                    <span className="text-2xl font-bold text-white">Admin<span className="text-secondary">Panel</span></span>
                    <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">v1.2.0 - HTML Support Active</span>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const active = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-md transition-colors ${active ? 'bg-secondary text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                            >
                                <Icon className="h-5 w-5 mr-3" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
};

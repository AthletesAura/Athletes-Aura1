import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage.ts';
import { FreeResource, PlanInquiry } from '../types.ts';
import { Download, CheckCircle, Activity, Utensils } from 'lucide-react';

export const PersonalizedPlans: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Diet' | 'Workout'>('Diet');
    const [freeResources, setFreeResources] = useState<FreeResource[]>([]);
    const [formData, setFormData] = useState<Partial<PlanInquiry>>({
        name: '', email: '', phone: '', goals: ''
    });
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const unsubscribe = StorageService.subscribeFreeResources((items) => {
            setFreeResources(items);
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const inquiry: PlanInquiry = {
            id: Date.now().toString(),
            name: formData.name || '',
            email: formData.email || '',
            phone: formData.phone || '',
            goals: formData.goals || '',
            type: activeTab,
            date: new Date().toISOString()
        };
        await StorageService.addPlanInquiry(inquiry);
        setShowPopup(true);
        setFormData({ name: '', email: '', phone: '', goals: '' });
        
        // Hide popup after 3 seconds
        setTimeout(() => setShowPopup(false), 5000);
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="bg-black py-20 mb-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase mb-4">Custom Plans</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">Expertly crafted nutrition and training protocols, just for you.</p>
                </div>
            </div>

            {/* Success Popup */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
                    <div className="absolute inset-0 bg-black opacity-70"></div>
                    <div className="bg-white rounded-lg p-8 shadow-2xl relative z-10 max-w-md text-center animate-fade-in">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Request Received!</h3>
                        <p className="text-gray-600 mb-4">
                            A member of our team will analyze your goals and contact you shortly to build your {activeTab} plan.
                        </p>
                        <button onClick={() => setShowPopup(false)} className="bg-black text-white px-6 py-2 rounded font-bold uppercase text-sm">Close</button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
                    {/* Inquiry Form */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                        <div className="flex border-b border-gray-200">
                            <button 
                                onClick={() => setActiveTab('Diet')}
                                className={`flex-1 py-4 text-center font-bold uppercase transition ${activeTab === 'Diet' ? 'bg-secondary text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                            >
                                <Utensils className="inline-block h-5 w-5 mr-2 mb-1" /> Diet Plan
                            </button>
                            <button 
                                onClick={() => setActiveTab('Workout')}
                                className={`flex-1 py-4 text-center font-bold uppercase transition ${activeTab === 'Workout' ? 'bg-black text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                            >
                                <Activity className="inline-block h-5 w-5 mr-2 mb-1" /> Workout Plan
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold mb-2">Get Your Personalized {activeTab} Plan</h3>
                                <p className="text-gray-500 text-sm">Starting at ₹99. Includes consultation and 4-week protocol.</p>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input required type="text" className="w-full mt-1 border rounded px-3 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input required type="email" className="w-full mt-1 border rounded px-3 py-2" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <input required type="tel" className="w-full mt-1 border rounded px-3 py-2" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Primary Goals & Limitations</label>
                                    <textarea required rows={4} className="w-full mt-1 border rounded px-3 py-2" placeholder="e.g. Weight loss, gain muscle, knee injury..." value={formData.goals} onChange={e => setFormData({...formData, goals: e.target.value})}></textarea>
                                </div>
                                <button type="submit" className={`w-full py-3 rounded font-bold uppercase text-white transition hover:opacity-90 ${activeTab === 'Diet' ? 'bg-secondary' : 'bg-black'}`}>
                                    Request {activeTab} Plan
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Info & Free Resources */}
                    <div>
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold mb-4">Why Go Custom?</h2>
                            <p className="text-gray-600 mb-6">Generic plans yield generic results. By tailoring your {activeTab.toLowerCase()} to your specific metabolic rate, lifestyle, and preferences, we accelerate your progress by up to 300%.</p>
                            <ul className="space-y-3">
                                <li className="flex items-start"><CheckCircle className="h-5 w-5 text-secondary mr-2 shrink-0" /> <span>Accountability from expert coaches</span></li>
                                <li className="flex items-start"><CheckCircle className="h-5 w-5 text-secondary mr-2 shrink-0" /> <span>Adjustments based on weekly progress</span></li>
                                <li className="flex items-start"><CheckCircle className="h-5 w-5 text-secondary mr-2 shrink-0" /> <span>Sustainable habits, not quick fixes</span></li>
                            </ul>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                <Download className="h-5 w-5 mr-2 text-secondary" /> Free Resources
                            </h3>
                            <div className="space-y-4">
                                {freeResources.filter(r => r.type === activeTab).length > 0 ? (
                                    freeResources.filter(r => r.type === activeTab).map(resource => (
                                        <div key={resource.id} className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition">
                                            <div>
                                                <h4 className="font-bold text-sm">{resource.title}</h4>
                                                {resource.description && <p className="text-xs text-gray-500">{resource.description}</p>}
                                            </div>
                                            <a href={resource.link} target="_blank" rel="noreferrer" className="text-secondary hover:text-black font-bold text-xs uppercase border border-secondary hover:border-black px-3 py-1 rounded">
                                                Download
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">No free {activeTab.toLowerCase()} resources available at the moment.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

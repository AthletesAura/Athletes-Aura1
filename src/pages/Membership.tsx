import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage.ts';
import { MembershipTier } from '../types.ts';
import { Check, Star } from 'lucide-react';

export const Membership: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [plans, setPlans] = useState<MembershipTier[]>([]);
  const [cycle, setCycle] = useState<'monthly' | 'quarterly' | 'biannual' | 'yearly'>('monthly');

  useEffect(() => {
    const loadData = async () => {
      setSettings(await StorageService.getSettings());
      setPlans(await StorageService.getMemberships());
    };
    loadData();
  }, []);

  const getWhatsAppLink = (planName: string, price: number) => {
    if (!settings) return '#';
    const text = `Hi! I'm interested in the ${planName} membership (${cycle} plan at ₹${price}).`;
    return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  const getPrice = (plan: MembershipTier) => {
    switch (cycle) {
        case 'monthly': return plan.pricing.monthly;
        case 'quarterly': return plan.pricing.quarterly || plan.pricing.monthly * 3;
        case 'biannual': return plan.pricing.biannual || plan.pricing.monthly * 6;
        case 'yearly': return plan.pricing.yearly || plan.pricing.monthly * 12;
    }
  };

  return (
    <div className="bg-white pb-20">
      <div className="bg-black py-20 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase mb-4">Membership</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Invest in yourself. No hidden fees. Cancel anytime.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-center mb-12 flex-wrap gap-2">
            <div className="bg-gray-100 p-1 rounded-full flex flex-wrap justify-center">
                {['monthly', 'quarterly', 'biannual', 'yearly'].map((c) => (
                    <button 
                        key={c}
                        onClick={() => setCycle(c as any)}
                        className={`px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-bold uppercase transition ${cycle === c ? 'bg-white shadow text-black' : 'text-gray-500'}`}
                    >
                        {c === 'biannual' ? '6 Months' : c}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
                const price = getPrice(plan);
                return (
                    <div key={plan.id} className={`relative flex flex-col rounded-2xl border ${plan.highlight ? 'border-secondary shadow-2xl scale-105 z-10 bg-white' : 'border-gray-200 bg-white shadow-lg'} p-8`}>
                        {plan.highlight && (
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-secondary text-white px-4 py-1 rounded-full text-sm font-bold uppercase flex items-center shadow">
                                <Star className="w-3 h-3 mr-1 fill-current" /> Most Popular
                            </div>
                        )}
                        <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                        <p className="mt-2 text-gray-500 text-sm">{plan.description}</p>
                        <div className="my-6">
                            <span className="text-4xl font-extrabold">₹{price}</span>
                            <span className="text-gray-500 capitalize">/{cycle === 'biannual' ? '6mo' : cycle}</span>
                        </div>
                        <ul className="mb-8 space-y-4 flex-1">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start">
                                    <Check className="h-5 w-5 text-secondary mr-2 shrink-0" />
                                    <span className="text-gray-600">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <a 
                            href={getWhatsAppLink(plan.name, price)}
                            target="_blank"
                            rel="noreferrer"
                            className={`w-full py-4 rounded-lg font-bold uppercase text-center transition ${plan.highlight ? 'bg-secondary hover:bg-secondary-hover text-white' : 'bg-gray-900 hover:bg-black text-white'}`}
                        >
                            Choose Plan
                        </a>
                    </div>
                );
            })}
        </div>

        <div className="mt-20 bg-gray-50 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4">Team & Corporate Packages</h2>
                <p className="text-gray-600">Looking to train your sports team or corporate group?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-2">Sports Teams</h3>
                    <p className="text-gray-600 mb-4">Specialized strength & conditioning programs for teams. Includes facility rental options.</p>
                    <button className="text-secondary font-bold uppercase hover:underline">Contact for quote</button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-2">Corporate Wellness</h3>
                    <p className="text-gray-600 mb-4">Keep your workforce healthy and productive. Group discounts and private classes available.</p>
                    <button className="text-secondary font-bold uppercase hover:underline">Contact for quote</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

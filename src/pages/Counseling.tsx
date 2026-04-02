
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Clock, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../services/storage.ts';
import { CounselingService } from '../types.ts';

export const Counseling: React.FC = () => {
  const [services, setServices] = useState<CounselingService[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const unsubServices = StorageService.subscribeCounseling((s) => {
      setServices(s.filter(x => x.isEnabled));
    });
    
    const unsubSettings = StorageService.subscribeSettings((s) => {
      if (s) setSettings(s);
    });

    window.scrollTo(0, 0);
    
    return () => {
      unsubServices();
      unsubSettings();
    };
  }, []);

  const handleBook = (serviceName: string) => {
    if (!settings) return;
    const message = `Hi Athletes Aura! I'm interested in booking a ${serviceName} session. Please let me know the available slots.`;
    window.open(`https://wa.me/${settings.counselingWhatsapp || settings.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="pt-24 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Expert Counseling
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Performance is as much mental as it is physical. Get expert guidance on nutrition, psychology, and recovery.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full"
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-8 flex-grow">
                  {service.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                    <Clock className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Duration</p>
                      <p className="font-bold text-gray-900">{service.duration}</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                    <CreditCard className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Price</p>
                      <p className="font-bold text-gray-900">₹{service.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleBook(service.title)}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg"
                >
                  Book Session <MessageSquare size={18} />
                </button>
              </div>
            </motion.div>
          ))}

          {services.length === 0 && (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl">
              <p className="text-gray-500 text-lg">No counseling services available at the moment.</p>
            </div>
          )}
        </div>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-6">
              <CheckCircle2 size={24} />
            </div>
            <h4 className="text-xl font-bold mb-4">Certified Experts</h4>
            <p className="text-gray-600">All our counselors are certified professionals with years of experience in their respective fields.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-6">
              <Clock size={24} />
            </div>
            <h4 className="text-xl font-bold mb-4">Flexible Timing</h4>
            <p className="text-gray-600">Book sessions at your convenience. We offer both in-person and online consultations.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-6">
              <ArrowRight size={24} />
            </div>
            <h4 className="text-xl font-bold mb-4">Holistic Approach</h4>
            <p className="text-gray-600">We integrate counseling with your physical training for a truly comprehensive performance roadmap.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

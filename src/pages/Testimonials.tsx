
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';
import { StorageService } from '../services/storage.ts';
import { Testimonial, SiteSettings } from '../types.ts';
import { SEED_SETTINGS } from '../constants.ts';

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(SEED_SETTINGS);

  useEffect(() => {
    const unsubTestimonials = StorageService.subscribeTestimonials((t) => {
      setTestimonials(t);
    });
    const unsubSettings = StorageService.subscribeSettings((s) => {
      if (s) setSettings(s);
    });
    window.scrollTo(0, 0);
    return () => {
      unsubTestimonials();
      unsubSettings();
    };
  }, []);

  const whatsappMessage = encodeURIComponent("Hi Athletes Aura! I've seen the success stories and I'm ready to start my own journey towards peak performance.");
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="pt-24 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Success Stories
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Real results from real people. Join the community of high-performers.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 p-8 rounded-3xl relative hover:shadow-xl transition-all group"
            >
              <Quote className="absolute top-6 right-8 text-gray-200 group-hover:text-black/10 transition-colors" size={48} />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 text-lg italic mb-8 relative z-10">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center bg-black text-white p-12 rounded-3xl">
          <h2 className="text-3xl font-bold mb-6">Ready to Write Your Own Success Story?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join Athletes Aura today and start your journey towards peak performance.
          </p>
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-gray-200 transition-all"
          >
            Start Your Journey
          </a>
        </div>
      </div>
    </div>
  );
};

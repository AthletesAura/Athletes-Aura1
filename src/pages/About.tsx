import React, { useEffect, useState } from 'react';
import { SectionHeader } from '../components/SectionHeader.tsx';
import { StorageService } from '../services/storage.ts';
import { SiteSettings } from '../types.ts';
import { SEED_SETTINGS } from '../constants.ts';

export const About: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(SEED_SETTINGS);

  useEffect(() => {
    const unsub = StorageService.subscribeSettings((s) => {
      if (s) setSettings(s);
    });
    return () => unsub();
  }, []);

  return (
    <div className="bg-white">
      <div className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase mb-4">{settings.aboutUsTitle}</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">{settings.aboutUsSubtitle}</p>
        </div>
      </div>

      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
                <img 
                    src={settings.aboutUsImage} 
                    alt="Team" 
                    className="rounded-lg shadow-xl"
                />
            </div>
            <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-gray-600 mb-4 leading-relaxed whitespace-pre-line">
                    {settings.aboutUsText1}
                </p>
                <p className="text-gray-600 mb-4 leading-relaxed whitespace-pre-line">
                    {settings.aboutUsText2}
                </p>
            </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeader title="Our Values" subtitle="The pillars that define our culture" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                {[
                    { title: 'Discipline', desc: 'Consistency over intensity. Showing up is half the battle.' },
                    { title: 'Growth', desc: 'We never settle. We are always learning, improving, and evolving.' },
                    { title: 'Health', desc: 'Performance shouldn\'t come at the cost of long-term health.' },
                    { title: 'Community', desc: 'We lift each other up. Your win is our win.' }
                ].map((val, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-bold text-secondary mb-3">{val.title}</h3>
                        <p className="text-gray-600">{val.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};
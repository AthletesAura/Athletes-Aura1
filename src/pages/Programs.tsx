
import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage.ts';
import { Program, SiteSettings } from '../types.ts';
import { SEED_SETTINGS } from '../constants.ts';

export const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(SEED_SETTINGS);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const unsubPrograms = StorageService.subscribePrograms((p) => {
      setPrograms(p.filter(x => x.isEnabled));
    });
    
    const unsubSettings = StorageService.subscribeSettings((s) => {
      if (s) {
        setSettings(s);
        setCategories(s.programCategories);
      }
    });

    return () => {
      unsubPrograms();
      unsubSettings();
    };
  }, []);

  const getWhatsAppLink = (programName: string) => {
      const text = `Hi! I'm interested in the ${programName} program at Athletes Aura. Can I get more details?`;
      return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-black py-20 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase mb-4">Training Programs</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Expertly designed curriculum for every goal.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {categories.map(category => {
            const categoryPrograms = programs.filter(p => p.category === category);
            if (categoryPrograms.length === 0) return null;

            return (
                <div key={category} className="mb-16">
                    <h3 className="text-2xl font-bold border-l-4 border-secondary pl-4 mb-8 uppercase text-gray-800">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categoryPrograms.map(program => (
                            <div key={program.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition duration-300">
                                <div className="relative h-56">
                                    <img src={program.image} alt={program.name} className="w-full h-full object-cover" />
                                    {program.discountPercentage ? (
                                        <div className="absolute top-4 right-4 bg-red-600 text-white font-bold px-3 py-1 rounded-full text-sm">
                                            {program.discountPercentage}% OFF
                                        </div>
                                    ) : null}
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <h4 className="text-2xl font-bold mb-2">{program.name}</h4>
                                    <p className="text-gray-600 mb-6 flex-grow">{program.description}</p>
                                    
                                    <div className="mt-auto">
                                        {program.price && (
                                            <div className="text-3xl font-bold text-gray-900 mb-4">{program.price}</div>
                                        )}
                                        <a 
                                            href={getWhatsAppLink(program.name)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block w-full bg-secondary hover:bg-secondary-hover text-white text-center font-bold py-3 rounded uppercase transition"
                                        >
                                            Join Program
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

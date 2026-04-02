import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage.ts';
import { Coach } from '../types.ts';
import { Instagram, Linkedin, Youtube, Award, Calendar, BadgeCheck } from 'lucide-react';

export const Coaches: React.FC = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);

  useEffect(() => {
    const unsub = StorageService.subscribeCoaches((c) => {
      setCoaches(c);
    });
    return () => unsub();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase mb-4">Meet The Team</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">World-class experts dedicated to your performance.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 gap-12">
            {coaches.map((coach, index) => (
                <div key={coach.id} className={`flex flex-col md:flex-row gap-8 items-center bg-white p-8 rounded-xl shadow-lg ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="w-full md:w-1/3 shrink-0">
                        <img 
                            src={coach.image} 
                            alt={coach.name} 
                            className="w-full h-80 object-cover rounded-lg shadow-md" 
                        />
                    </div>
                    <div className="w-full md:w-2/3">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">{coach.name}</h2>
                                <p className="text-secondary font-bold text-xl uppercase tracking-wide">{coach.role}</p>
                            </div>
                            <div className="flex space-x-3 mt-4 md:mt-0">
                                {coach.socials.instagram && (
                                    <a href={`https://instagram.com/${coach.socials.instagram}`} className="bg-gray-100 p-2 rounded-full hover:bg-secondary hover:text-white transition">
                                        <Instagram className="h-5 w-5" />
                                    </a>
                                )}
                                {coach.socials.youtube && (
                                    <a href={`https://youtube.com/${coach.socials.youtube}`} className="bg-gray-100 p-2 rounded-full hover:bg-secondary hover:text-white transition">
                                        <Youtube className="h-5 w-5" />
                                    </a>
                                )}
                                {coach.socials.linkedin && (
                                    <a href={`https://linkedin.com/${coach.socials.linkedin}`} className="bg-gray-100 p-2 rounded-full hover:bg-secondary hover:text-white transition">
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                            <div className="bg-gray-50 p-4 rounded border border-gray-100">
                                <div className="flex items-center text-gray-500 mb-2">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span className="text-xs uppercase font-bold">Experience</span>
                                </div>
                                <span className="font-semibold text-gray-900">{coach.experience}</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded border border-gray-100">
                                <div className="flex items-center text-gray-500 mb-2">
                                    <BadgeCheck className="h-4 w-4 mr-2" />
                                    <span className="text-xs uppercase font-bold">Certifications</span>
                                </div>
                                <span className="font-semibold text-gray-900">{coach.certifications}</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded border border-gray-100">
                                <div className="flex items-center text-gray-500 mb-2">
                                    <Award className="h-4 w-4 mr-2" />
                                    <span className="text-xs uppercase font-bold">Achievements</span>
                                </div>
                                <span className="font-semibold text-gray-900">{coach.achievements}</span>
                            </div>
                        </div>
                        
                        <button className="px-6 py-2 border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition rounded">
                            Book Session
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
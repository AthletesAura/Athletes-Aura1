
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, Star, Users, Quote, Activity } from 'lucide-react';
import { StorageService } from '../services/storage.ts';
import { SectionHeader } from '../components/SectionHeader.tsx';
import { ContactForm } from '../components/ContactForm.tsx';
import { Program, Offer, Testimonial, SiteSettings } from '../types.ts';
import { SEED_SETTINGS } from '../constants.ts';

export const Home: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(SEED_SETTINGS);

  useEffect(() => {
    const unsubPrograms = StorageService.subscribePrograms((p) => {
      setPrograms(p.filter(x => x.isEnabled).slice(0, 3));
    });
    
    const unsubOffers = StorageService.subscribeOffers((o) => {
      setOffers(o.filter(x => x.isEnabled));
    });
    
    const unsubTestimonials = StorageService.subscribeTestimonials((t) => {
      setTestimonials(t.slice(0, 3));
    });
    
    const unsubSettings = StorageService.subscribeSettings((s) => {
      if (s) setSettings(s);
    });

    return () => {
      unsubPrograms();
      unsubOffers();
      unsubTestimonials();
      unsubSettings();
    };
  }, []);

  const getWhatsAppLink = (offerTitle: string) => {
    const text = `Hi! I saw the "${offerTitle}" offer on your website and I'm interested.`;
    return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div>
      <div className="relative h-[85vh] bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-60">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Gym Hero" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center text-white">
          <h1 className="text-5xl md:text-7xl font-extrabold uppercase leading-tight mb-6 whitespace-pre-line">
            {settings.homeHeroTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl font-light text-gray-300">
            {settings.homeHeroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/membership" className="px-8 py-4 bg-secondary hover:bg-secondary-hover text-white font-bold rounded text-lg uppercase transition text-center">
              Join Now
            </Link>
            <Link to="/programs" className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-bold rounded text-lg uppercase transition text-center">
              Book Assessment
            </Link>
          </div>
        </div>
      </div>

      {settings.offersEnabled && offers.length > 0 && (
        <section className="py-16 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
             <SectionHeader title="Limited Time Offers" subtitle="Start your journey with these exclusive deals" light />
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {offers.map(offer => (
                 <div key={offer.id} className="bg-white rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-1 transition duration-300">
                   <div className="relative h-48">
                      <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 font-bold rounded shadow">
                        {offer.discountText}
                      </div>
                   </div>
                   <div className="p-6">
                     <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                     <p className="text-gray-600 mb-4">{offer.description}</p>
                     <a 
                        href={getWhatsAppLink(offer.title)} 
                        target="_blank" 
                        rel="noreferrer"
                        className="block text-center w-full bg-black text-white py-2 font-bold uppercase hover:bg-gray-800 rounded"
                     >
                        Claim Offer
                     </a>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </section>
      )}

      {/* Personalized Plan Teaser */}
      <section className="py-16 bg-white border-b border-gray-100">
         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
               <div className="inline-flex items-center space-x-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-6">
                  <Activity className="h-5 w-5" />
                  <span className="font-bold uppercase text-sm">Online Coaching</span>
               </div>
               <h2 className="text-4xl font-extrabold uppercase mb-6 leading-tight">Get Your Personalized <span className="text-secondary">Diet & Workout</span> Plan</h2>
               <p className="text-lg text-gray-600 mb-8">
                  Can't make it to the facility? No problem. Get a science-backed nutrition and training plan tailored specifically to your body type, goals, and equipment availability.
               </p>
               <ul className="space-y-4 mb-8">
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-secondary mr-3"/> Customized Macro Splits</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-secondary mr-3"/> Home or Gym Workouts</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-secondary mr-3"/> Weekly Check-ins</li>
               </ul>
               <Link to="/personalized-plans" className="inline-block px-8 py-3 bg-black text-white font-bold uppercase rounded hover:bg-gray-800 transition">
                  Get Your Plan
               </Link>
            </div>
            <div className="w-full md:w-1/2 relative">
               <img 
                  src="https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="Personalized Plan" 
                  className="rounded-lg shadow-2xl"
               />
               <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded shadow-lg hidden md:block">
                  <p className="text-3xl font-extrabold text-secondary">100%</p>
                  <p className="text-sm font-bold uppercase">Customized for you</p>
               </div>
            </div>
         </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader title="Our Mission" subtitle="" align="left" />
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At Athletes Aura, we bridge the gap between elite athletic training and general fitness. 
                We believe that everyone deserves access to the same science-backed training methods used by professionals.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Science-backed programming',
                  'Elite equipment & facilities',
                  'Community of driven individuals',
                  'Holistic approach to health'
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-800 font-medium">
                    <CheckCircle className="h-5 w-5 text-secondary mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/about" className="text-secondary font-bold hover:text-black flex items-center transition">
                Read our full story <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-secondary rounded-lg opacity-20 transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Gym Interior" 
                className="relative rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Our Programs" subtitle="Designed to help you reach your peak performance" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map(program => (
              <div key={program.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">
                <div className="h-56 overflow-hidden">
                  <img src={program.image} alt={program.name} className="w-full h-full object-cover transform hover:scale-105 transition duration-500" />
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">{program.category}</span>
                  <h3 className="text-2xl font-bold mt-2 mb-3">{program.name}</h3>
                  <p className="text-gray-600 mb-6 line-clamp-3">{program.description}</p>
                  <Link to="/programs" className="flex items-center text-black font-bold hover:text-secondary uppercase text-sm">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/programs" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 md:py-4 md:text-lg md:px-10">
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
           <div>
             <Zap className="h-10 w-10 mx-auto mb-4 text-black" />
             <h4 className="text-4xl font-extrabold text-black">{settings.homeStats?.coaches || '15+'}</h4>
             <p className="font-medium text-black">Expert Coaches</p>
           </div>
           <div>
             <Users className="h-10 w-10 mx-auto mb-4 text-black" />
             <h4 className="text-4xl font-extrabold text-black">{settings.homeStats?.members || '1200+'}</h4>
             <p className="font-medium text-black">Members</p>
           </div>
           <div>
             <Star className="h-10 w-10 mx-auto mb-4 text-black" />
             <h4 className="text-4xl font-extrabold text-black">{settings.homeStats?.athletes || '50+'}</h4>
             <p className="font-medium text-black">Athletes</p>
           </div>
           <div>
             <CheckCircle className="h-10 w-10 mx-auto mb-4 text-black" />
             <h4 className="text-4xl font-extrabold text-black">{settings.homeStats?.results || '100%'}</h4>
             <p className="font-medium text-black">Results</p>
           </div>
        </div>
      </section>

       <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
             <SectionHeader title="Success Stories" subtitle="Hear from our community" />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map(t => (
                    <div key={t.id} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center mb-4">
                             <img src={t.image} alt={t.name} className="h-12 w-12 rounded-full mr-4" />
                             <div>
                                 <h4 className="font-bold text-sm">{t.name}</h4>
                                 <p className="text-xs text-gray-500 uppercase">{t.role}</p>
                             </div>
                        </div>
                        <div className="relative">
                            <Quote className="h-6 w-6 text-gray-300 absolute -top-2 -left-2 transform -scale-x-100" />
                            <p className="text-gray-600 text-sm italic pl-4 z-10 relative">{t.content}</p>
                        </div>
                    </div>
                ))}
             </div>
             <div className="text-center mt-10">
                 <Link to="/testimonials" className="text-secondary font-bold uppercase text-sm hover:underline">Read All Stories</Link>
             </div>
        </div>
       </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <SectionHeader title="Start Your Journey" subtitle="Contact us today for a free consultation" align="left" />
              <p className="text-gray-600 mb-8">
                Ready to take your fitness to the next level? Fill out the form, and one of our expert coaches will get back to you within 24 hours to schedule your initial assessment.
              </p>
              <div className="bg-white p-6 rounded-lg mb-8 shadow-sm">
                 <h4 className="font-bold text-lg mb-2">Opening Hours</h4>
                 <div className="whitespace-pre-line text-sm text-gray-600">
                    {settings.homeOpeningHours}
                 </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};

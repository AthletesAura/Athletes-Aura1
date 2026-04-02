import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Facebook, Instagram, Twitter, MapPin, Mail, Phone, Dumbbell } from 'lucide-react';
import { StorageService } from '../services/storage.ts';
import { SiteSettings, LegalPage } from '../types.ts';
import { SEED_SETTINGS } from '../constants.ts';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(SEED_SETTINGS);
  const [legalPages, setLegalPages] = useState<LegalPage[]>([]);
  const location = useLocation();

  useEffect(() => {
    const unsubSettings = StorageService.subscribeSettings((currentSettings) => {
      if (currentSettings) {
        setSettings(currentSettings);
        // Apply Favicon dynamically
        if (currentSettings.faviconUrl) {
          let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
          if (!link) {
            link = document.createElement('link');
            link.rel = 'shortcut icon';
            document.getElementsByTagName('head')[0].appendChild(link);
          }
          link.href = currentSettings.faviconUrl;
        }
      }
    });

    const unsubLegal = StorageService.subscribeLegalPages((pages) => {
      if (pages) setLegalPages(pages);
    });

    window.scrollTo(0, 0);

    return () => {
      unsubSettings();
      unsubLegal();
    };
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Coaches', path: '/coaches' },
    { name: 'Counseling', path: '/counseling' },
    { name: 'Custom Plan', path: '/personalized-plans' },
    { name: 'Membership', path: '/membership' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <nav className="bg-black text-white sticky top-0 z-50 shadow-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-4">
                 {/* Logic: Show uploaded logo OR default icon, but ALWAYS show text */}
                 {settings.logoUrl ? (
                   <div className="relative h-20 w-20 flex-shrink-0">
                     <img 
                       src={settings.logoUrl} 
                       alt="Logo" 
                       className="h-full w-full object-contain rounded-full bg-black border border-gray-800 p-1.5" 
                     />
                   </div>
                 ) : (
                   <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center">
                     <Dumbbell className="h-7 w-7 text-black" />
                   </div>
                 )}
                 <div className="flex flex-col">
                   <span className="font-black text-2xl lg:text-3xl tracking-tighter uppercase leading-none">
                      Athletes<span className="text-secondary">Aura</span>
                   </span>
                   <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Performance Center</span>
                 </div>
              </Link>
            </div>
            <div className="hidden xl:block">
              <div className="ml-6 flex items-baseline space-x-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                        location.pathname === link.path 
                        ? 'text-secondary bg-gray-900' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="xl:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="xl:hidden bg-gray-900 pb-4 max-h-[60vh] overflow-y-auto">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-black text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-xl font-bold mb-4 uppercase">Athletes Aura</h3>
              <p className="mb-6 text-sm">Performance for Athletes. Fitness for Everyone.</p>
              <div className="flex space-x-4">
                {settings.socials.instagram && (
                  <a href={settings.socials.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-secondary transition">
                    <Instagram className="h-6 w-6" />
                  </a>
                )}
                {settings.socials.facebook && (
                  <a href={settings.socials.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-secondary transition">
                    <Facebook className="h-6 w-6" />
                  </a>
                )}
                {settings.socials.twitter && (
                   <a href={settings.socials.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-secondary transition">
                    <Twitter className="h-6 w-6" />
                  </a>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-secondary shrink-0" />
                  <a 
                    href={settings.mapLinkUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-secondary transition"
                  >
                    {settings.address}
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-secondary shrink-0" />
                  <a href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-secondary shrink-0" />
                  <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
                </li>
              </ul>
            </div>

            <div>
               <h3 className="text-white text-lg font-bold mb-4">Legal & Links</h3>
               <ul className="space-y-2 text-sm">
                  {legalPages.filter(p => p.isVisible).map(page => (
                      <li key={page.id}>
                          <Link to={`/legal/${page.slug}`} className="hover:text-white transition">{page.title}</Link>
                      </li>
                  ))}
               </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-xs">
            <p>&copy; {new Date().getFullYear()} Athletes Aura. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {settings.whatsappNumber && (
        <a 
            href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20Athletes%20Aura!%20I%20am%20interested%20in%20knowing%20more.`}
            target="_blank"
            rel="noreferrer"
            className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl z-50 transition-transform hover:scale-110 flex items-center justify-center"
        >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
        </a>
      )}
    </div>
  );
};
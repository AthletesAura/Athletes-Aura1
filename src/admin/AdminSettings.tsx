
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Globe, Share2, CheckCircle, Info, Home, User, Phone, MapPin, Clock, Layout, ShieldCheck, Eye, EyeOff, X } from 'lucide-react';
import { StorageService } from '../services/storage.ts';
import { SiteSettings } from '../types.ts';
import { SEED_SETTINGS } from '../constants.ts';
import { ImageUpload } from '../components/ImageUpload.tsx';

type TabType = 'general' | 'website' | 'contact' | 'security';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(SEED_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('general');

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Security phrase state
  const [securityPhrase, setSecurityPhrase] = useState('');
  const [phraseSuccess, setPhraseSuccess] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const s = await StorageService.getSettings();
      if (s) setSettings(s);
    };
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await StorageService.saveSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSocial = (key: keyof SiteSettings['socials'], value: string) => {
    setSettings({
      ...settings,
      socials: {
        ...settings.socials,
        [key]: value
      }
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    try {
      await StorageService.updatePassword(newPassword);
      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError('Failed to update password.');
    }
  };

  const handlePhraseChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhraseSuccess(false);
    try {
      await StorageService.setSecurityPhrase(securityPhrase);
      setPhraseSuccess(true);
      setSecurityPhrase('');
      setTimeout(() => setPhraseSuccess(false), 3000);
    } catch (error) {
      console.error('Error setting phrase:', error);
    }
  };

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'general', label: 'General & Branding', icon: Globe },
    { id: 'website', label: 'Website Content', icon: Layout },
    { id: 'contact', label: 'Contact Info', icon: Phone },
    { id: 'security', label: 'Security', icon: ShieldCheck },
  ];

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings & Customization</h1>
          <p className="text-gray-500">Manage your website's branding, content, and security in one place.</p>
        </div>
        {saveSuccess && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold"
          >
            <CheckCircle size={20} /> Settings Saved!
          </motion.div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-black text-white shadow-lg' 
                  : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
        <AnimatePresence mode="wait">
          {activeTab === 'general' && (
            <motion.div
              key="general"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Branding & Visuals */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                  <Globe className="text-secondary" size={20} />
                  <h2 className="font-bold text-gray-900">Branding & Visuals</h2>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <ImageUpload 
                      value={settings.logoUrl || ''}
                      onChange={(url) => setSettings({...settings, logoUrl: url})}
                      label="Logo"
                    />
                  </div>
                  <div>
                    <ImageUpload 
                      value={settings.faviconUrl || ''}
                      onChange={(url) => setSettings({...settings, faviconUrl: url})}
                      label="Favicon"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                  <Share2 className="text-secondary" size={20} />
                  <h2 className="font-bold text-gray-900">Social Media Links</h2>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Instagram URL</label>
                    <input 
                      type="text" 
                      value={settings.socials.instagram || ''}
                      onChange={(e) => updateSocial('instagram', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Facebook URL</label>
                    <input 
                      type="text" 
                      value={settings.socials.facebook || ''}
                      onChange={(e) => updateSocial('facebook', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Twitter URL</label>
                    <input 
                      type="text" 
                      value={settings.socials.twitter || ''}
                      onChange={(e) => updateSocial('twitter', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">YouTube URL</label>
                    <input 
                      type="text" 
                      value={settings.socials.youtube || ''}
                      onChange={(e) => updateSocial('youtube', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">LinkedIn URL</label>
                    <input 
                      type="text" 
                      value={settings.socials.linkedin || ''}
                      onChange={(e) => updateSocial('linkedin', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder="https://linkedin.com/..."
                    />
                  </div>
                </div>
              </div>

              {/* Global Toggles */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                  <Info className="text-secondary" size={20} />
                  <h2 className="font-bold text-gray-900">Global Feature Toggles</h2>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div>
                      <p className="font-bold text-gray-900">Offers Section</p>
                      <p className="text-xs text-gray-500">Enable or disable the special offers section on the homepage.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setSettings({...settings, offersEnabled: !settings.offersEnabled})}
                      className={`w-14 h-8 rounded-full transition-all relative ${settings.offersEnabled ? 'bg-secondary' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${settings.offersEnabled ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'website' && (
            <motion.div
              key="website"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Home Page */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                  <Home className="text-secondary" size={20} />
                  <h2 className="font-bold text-gray-900">Home Page Content</h2>
                </div>
                <div className="p-8 space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Hero Title</label>
                    <textarea 
                      value={settings.homeHeroTitle || ''}
                      onChange={(e) => setSettings({...settings, homeHeroTitle: e.target.value})}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Hero Subtitle</label>
                    <textarea 
                      value={settings.homeHeroSubtitle || ''}
                      onChange={(e) => setSettings({...settings, homeHeroSubtitle: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Opening Hours</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-4 text-gray-400" size={18} />
                      <textarea 
                        value={settings.homeOpeningHours || ''}
                        onChange={(e) => setSettings({...settings, homeOpeningHours: e.target.value})}
                        rows={5}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        placeholder="Monday - Friday: 6:00 AM - 10:00 PM..."
                      />
                    </div>
                  </div>

                  {/* Home Stats */}
                  <div className="pt-6 border-t border-gray-50">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Home Page Stats</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Coaches</label>
                        <input 
                          type="text"
                          value={settings.homeStats?.coaches || ''}
                          onChange={(e) => setSettings({
                            ...settings, 
                            homeStats: { ...(settings.homeStats || { coaches: '', members: '', athletes: '', results: '' }), coaches: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none text-sm"
                          placeholder="15+"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Members</label>
                        <input 
                          type="text"
                          value={settings.homeStats?.members || ''}
                          onChange={(e) => setSettings({
                            ...settings, 
                            homeStats: { ...(settings.homeStats || { coaches: '', members: '', athletes: '', results: '' }), members: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none text-sm"
                          placeholder="1200+"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Athletes</label>
                        <input 
                          type="text"
                          value={settings.homeStats?.athletes || ''}
                          onChange={(e) => setSettings({
                            ...settings, 
                            homeStats: { ...(settings.homeStats || { coaches: '', members: '', athletes: '', results: '' }), athletes: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none text-sm"
                          placeholder="50+"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Results</label>
                        <input 
                          type="text"
                          value={settings.homeStats?.results || ''}
                          onChange={(e) => setSettings({
                            ...settings, 
                            homeStats: { ...(settings.homeStats || { coaches: '', members: '', athletes: '', results: '' }), results: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none text-sm"
                          placeholder="100%"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Us */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                  <User className="text-secondary" size={20} />
                  <h2 className="font-bold text-gray-900">About Us Page</h2>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Page Title</label>
                      <input 
                        type="text"
                        value={settings.aboutUsTitle || ''}
                        onChange={(e) => setSettings({...settings, aboutUsTitle: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Page Subtitle</label>
                      <input 
                        type="text"
                        value={settings.aboutUsSubtitle || ''}
                        onChange={(e) => setSettings({...settings, aboutUsSubtitle: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <ImageUpload 
                      value={settings.aboutUsImage || ''}
                      onChange={(url) => setSettings({...settings, aboutUsImage: url})}
                      label="About Us Image"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Story Paragraph 1</label>
                      <textarea 
                        value={settings.aboutUsText1 || ''}
                        onChange={(e) => setSettings({...settings, aboutUsText1: e.target.value})}
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Story Paragraph 2</label>
                      <textarea 
                        value={settings.aboutUsText2 || ''}
                        onChange={(e) => setSettings({...settings, aboutUsText2: e.target.value})}
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Program Categories Management */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                  <Layout className="text-secondary" size={20} />
                  <h2 className="font-bold text-gray-900">Program Categories</h2>
                </div>
                <div className="p-8 space-y-6">
                  <p className="text-sm text-gray-500">Manage the categories available for your training programs.</p>
                  <div className="space-y-3">
                    {settings.programCategories?.map((category, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input 
                          type="text"
                          value={category}
                          onChange={(e) => {
                            const newCats = [...(settings.programCategories || [])];
                            newCats[index] = e.target.value;
                            setSettings({...settings, programCategories: newCats});
                          }}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none"
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            const newCats = settings.programCategories?.filter((_, i) => i !== index);
                            setSettings({...settings, programCategories: newCats});
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={() => {
                        const newCats = [...(settings.programCategories || []), ''];
                        setSettings({...settings, programCategories: newCats});
                      }}
                      className="text-sm font-bold text-secondary hover:underline flex items-center gap-1"
                    >
                      + Add Category Option
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                  <Phone className="text-secondary" size={20} />
                  <h2 className="font-bold text-gray-900">Global Contact Information</h2>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contact Phone</label>
                      <input 
                        type="text"
                        value={settings.contactPhone || ''}
                        onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">WhatsApp Number</label>
                      <input 
                        type="text"
                        value={settings.whatsappNumber || ''}
                        onChange={(e) => setSettings({...settings, whatsappNumber: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        placeholder="919876543210"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contact Email</label>
                      <input 
                        type="email"
                        value={settings.contactEmail || ''}
                        onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Counseling WhatsApp (Optional)</label>
                      <input 
                        type="text"
                        value={settings.counselingWhatsapp || ''}
                        onChange={(e) => setSettings({...settings, counselingWhatsapp: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        placeholder="919876543210"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Physical Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text"
                        value={settings.address || ''}
                        onChange={(e) => setSettings({...settings, address: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Google Maps Redirect Link (for Footer)</label>
                    <input 
                      type="text"
                      value={settings.mapLinkUrl || ''}
                      onChange={(e) => setSettings({...settings, mapLinkUrl: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder="https://maps.google.com/..."
                    />
                  </div>

                  {/* Contact Interests Management */}
                  <div className="pt-6 border-t border-gray-50">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Contact Form Interests</label>
                    <div className="space-y-3">
                      {settings.contactInterests?.map((interest, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input 
                            type="text"
                            value={interest}
                            onChange={(e) => {
                              const newInterests = [...(settings.contactInterests || [])];
                              newInterests[index] = e.target.value;
                              setSettings({...settings, contactInterests: newInterests});
                            }}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none"
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              const newInterests = settings.contactInterests?.filter((_, i) => i !== index);
                              setSettings({...settings, contactInterests: newInterests});
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button"
                        onClick={() => {
                          const newInterests = [...(settings.contactInterests || []), ''];
                          setSettings({...settings, contactInterests: newInterests});
                        }}
                        className="text-sm font-bold text-secondary hover:underline flex items-center gap-1"
                      >
                        + Add Interest Option
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                  <ShieldCheck className="text-secondary" size={20} />
                  <h2 className="font-bold text-gray-900">Admin Password</h2>
                </div>
                <div className="p-8">
                  <div className="max-w-md space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                          placeholder="At least 6 characters"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm Password</label>
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        placeholder="Repeat new password"
                      />
                    </div>
                    
                    {passwordError && <p className="text-red-500 text-sm font-medium">{passwordError}</p>}
                    {passwordSuccess && <p className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle size={16} /> Password updated successfully!</p>}

                    <button 
                      type="button"
                      onClick={handlePasswordChange}
                      disabled={!newPassword || !confirmPassword}
                      className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                  <Info className="text-secondary" size={20} />
                  <h2 className="font-bold text-gray-900">Security Phrase (Optional)</h2>
                </div>
                <div className="p-8">
                  <div className="max-w-md space-y-4">
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                      Your security phrase is used to <span className="text-black font-bold">recover your account</span> if you forget your admin password. Keep it secret and memorable.
                    </p>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Security Phrase</label>
                      <input 
                        type="text"
                        value={securityPhrase}
                        onChange={(e) => setSecurityPhrase(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        placeholder="e.g. My childhood pet name"
                      />
                    </div>
                    {phraseSuccess && <p className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle size={16} /> Security phrase set!</p>}
                    <button 
                      type="button"
                      onClick={handlePhraseChange}
                      disabled={!securityPhrase}
                      className="bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
                    >
                      Set Phrase
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab !== 'security' && (
          <div className="flex justify-end pt-6">
            <button 
              type="submit"
              disabled={isSaving}
              className="bg-black text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-gray-800 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : <><Save size={20} /> Save All Settings</>}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};


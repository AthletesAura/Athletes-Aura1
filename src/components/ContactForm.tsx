import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage.ts';
import { Lead, SiteSettings } from '../types.ts';
import { SEED_SETTINGS } from '../constants.ts';

export const ContactForm: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(SEED_SETTINGS);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const [hasSetInitialInterest, setHasSetInitialInterest] = useState(false);

  useEffect(() => {
    const unsubscribe = StorageService.subscribeSettings((currentSettings) => {
      if (currentSettings) {
        setSettings(currentSettings);
        if (!hasSetInitialInterest && currentSettings.contactInterests?.length > 0) {
          setFormData(prev => ({ ...prev, interest: currentSettings.contactInterests[0] }));
          setHasSetInitialInterest(true);
        }
      }
    });
    return () => unsubscribe();
  }, [hasSetInitialInterest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const newLead: Lead = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString()
      };
      
      await StorageService.addLead(newLead);
      setStatus('success');
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        interest: settings.contactInterests?.[0] || 'General Inquiry', 
        message: '' 
      });
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error("Error submitting lead:", error);
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
      
      {status === 'success' && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
          Thank you! We've received your message and will contact you shortly.
        </div>
      )}

      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          Something went wrong. Please try again or contact us directly.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary"
            />
          </div>
          <div>
            <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">Primary Interest</label>
            <select
              id="interest"
              name="interest"
              required
              value={formData.interest}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary"
            >
              {settings.contactInterests?.map((interest) => (
                <option key={interest} value={interest}>{interest}</option>
              ))}
              {!settings.contactInterests?.length && (
                <option value="General Inquiry">General Inquiry</option>
              )}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-black text-white font-bold py-3 px-4 rounded-md hover:bg-gray-800 transition duration-300 disabled:opacity-50 uppercase tracking-wide"
        >
          {status === 'submitting' ? 'Sending...' : 'Submit Inquiry'}
        </button>
      </form>
    </div>
  );
};

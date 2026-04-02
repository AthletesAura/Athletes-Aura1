
import React from 'react';
import { Link as LinkIcon, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label = 'Image' }) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
      </div>

      <div className="flex gap-4 items-start">
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 relative group">
          {value ? (
            <>
              <img 
                src={value} 
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid+URL')}
                referrerPolicy="no-referrer"
              />
              <button 
                type="button"
                onClick={() => onChange('')}
                className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
              <ImageIcon size={24} />
              <span className="text-[10px] mt-1 uppercase font-bold">No Image</span>
            </div>
          )}
        </div>

        <div className="flex-grow">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon size={16} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm"
              placeholder="Paste image URL (e.g., https://images.unsplash.com/...)"
            />
          </div>
          <p className="mt-2 text-[10px] text-gray-500 font-medium">
            Tip: You can use direct links from Google Drive, Unsplash, or any image hosting service.
          </p>
        </div>
      </div>
    </div>
  );
};

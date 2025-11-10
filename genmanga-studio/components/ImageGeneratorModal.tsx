import React, { useState } from 'react';
import { Panel, StylePreset } from '../types';
import { Icon } from './Icon';

interface ImageGeneratorModalProps {
  panel: Panel;
  onClose: () => void;
  onGenerate: (prompt: string, style: StylePreset) => void;
}

const stylePresets: StylePreset[] = [
    { name: 'Manhwa Action', promptSuffix: 'full color, dynamic action manhwa style, vibrant lighting, glowing effects, digital art, epic composition, webtoon, cinematic', previewUrl: 'https://picsum.photos/seed/manhwa/100' },
    { name: 'Character Art', promptSuffix: 'full color character portrait, detailed face, expressive eyes, modern manhwa art style, sharp lines, webtoon aesthetic', previewUrl: 'https://picsum.photos/seed/portrait/100' },
    { name: 'Mystical Aura', promptSuffix: 'glowing magical aura, energy particles, vibrant neon colors, dark background, manhwa special effect, cinematic lighting', previewUrl: 'https://picsum.photos/seed/aura/100' },
    { name: 'Classic Shonen', promptSuffix: 'black and white shonen manga style, sharp lines, high contrast, screentones, dramatic perspective, action lines', previewUrl: 'https://picsum.photos/seed/shonen/100' },
];

export const ImageGeneratorModal: React.FC<ImageGeneratorModalProps> = ({ panel, onClose, onGenerate }) => {
  const [prompt, setPrompt] = useState(panel.prompt || '');
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(stylePresets[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prompt, selectedStyle);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-95 animate-modal-in">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold font-manga text-indigo-400">Generate Panel Image</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <Icon name="close" className="w-6 h-6" />
            </button>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-8 space-y-6">
                 <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                        Describe the scene
                    </label>
                    <textarea
                        id="prompt"
                        rows={4}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A knight with a glowing sword faces a shadow monster"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                        Choose a style
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stylePresets.map(style => (
                            <button
                                type="button"
                                key={style.name}
                                onClick={() => setSelectedStyle(style)}
                                className={`relative rounded-lg overflow-hidden border-2 transition-all ${selectedStyle.name === style.name ? 'border-indigo-500 scale-105' : 'border-transparent hover:border-indigo-400'}`}
                            >
                                <img src={style.previewUrl} alt={style.name} className="w-full h-24 object-cover" />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1">
                                    <span className="text-white font-bold text-center text-sm">{style.name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-gray-700/50 px-8 py-4 flex justify-end rounded-b-2xl">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-all duration-200">
                    <Icon name="generate" className="w-5 h-5" />
                    Generate
                </button>
            </div>
        </form>
      </div>
       <style>{`
        @keyframes modal-in {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-modal-in { animation: modal-in 0.3s ease-out forwards; }
    `}</style>
    </div>
  );
};

import React from 'react';
import { Icon } from './Icon';

interface HeaderProps {
    projectTitle: string;
    onTitleChange: (newTitle: string) => void;
    onAutoGenerate?: () => void; // Optional for editor view
    onBack?: () => void; // Optional for editor view
}

export const Header: React.FC<HeaderProps> = ({ projectTitle, onTitleChange, onAutoGenerate, onBack }) => {
  const isDashboard = !onBack;
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 shadow-md z-20 flex-shrink-0">
      <div className="flex items-center gap-3">
        {onBack ? (
            <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                 <Icon name="back" className="h-6 w-6" />
            </button>
        ) : (
            <div className="bg-indigo-500 p-2 rounded-lg">
                <Icon name="logo" className="h-6 w-6 text-white" />
            </div>
        )}
        <h1 className="text-xl md:text-2xl font-bold font-manga tracking-wider text-white">
          GenManga Studio
        </h1>
      </div>
       <input
        type="text"
        value={projectTitle}
        onChange={(e) => onTitleChange(e.target.value)}
        className="text-center text-lg font-semibold bg-gray-900 rounded-md py-1 px-3 border-2 border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors duration-200 md:w-1/3"
        placeholder="Manga Title"
        disabled={isDashboard}
       />
      <div className="flex items-center gap-4">
        {onAutoGenerate && (
            <button 
            onClick={onAutoGenerate}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-200"
            >
                <Icon name="generate" className="h-5 w-5" />
                <span className="hidden md:inline">Auto-Generate</span>
            </button>
        )}
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-200">
            <Icon name="user" className="h-5 w-5" />
            <span className="hidden md:inline">Account</span>
        </button>
      </div>
    </header>
  );
};

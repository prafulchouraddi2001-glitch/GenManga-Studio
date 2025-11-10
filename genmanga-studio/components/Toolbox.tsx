
import React from 'react';
import { Icon } from './Icon';
import { PanelLayout } from '../types';

interface ToolboxProps {
  onAddPanel: (layout: PanelLayout) => void;
  onDeletePanel: () => void;
  onGenerateImage: () => void;
  onAddSpeechBubble: () => void;
  isPanelSelected: boolean;
  saveProject: () => void;
  onTranslate: (language: string) => void;
  isTranslating: boolean;
}

const ToolButton: React.FC<{ onClick: () => void; icon: string; label: string; disabled?: boolean; hotkey?: string, isLoading?: boolean }> = ({ onClick, icon, label, disabled, hotkey, isLoading }) => {
    const baseClasses = "flex flex-col items-center justify-center gap-2 w-full p-3 rounded-lg text-sm font-medium transition-all duration-200";
    const disabledClasses = "bg-gray-700 text-gray-500 cursor-not-allowed";
    const enabledClasses = "bg-gray-700/50 hover:bg-indigo-500 hover:text-white text-gray-300";

    return (
        <button onClick={onClick} disabled={disabled || isLoading} className={`${baseClasses} ${disabled || isLoading ? disabledClasses : enabledClasses}`}>
            {isLoading ? <div className="w-7 h-7 border-2 border-dashed rounded-full animate-spin border-white"></div> : <Icon name={icon} className="w-7 h-7" />}
            <span>{label}</span>
            {hotkey && <span className="text-xs text-gray-400">({hotkey})</span>}
        </button>
    );
};


export const Toolbox: React.FC<ToolboxProps> = ({ onAddPanel, onDeletePanel, onGenerateImage, onAddSpeechBubble, isPanelSelected, saveProject, onTranslate, isTranslating }) => {
  const panelLayouts: { name: string, layout: PanelLayout }[] = [
    { name: 'Full', layout: { gridColumnStart: 1, gridColumnEnd: 4, gridRowStart: 1, gridRowEnd: 2 } },
    { name: 'Half', layout: { gridColumnStart: 1, gridColumnEnd: 3, gridRowStart: 1, gridRowEnd: 2 } },
    { name: 'Tall', layout: { gridColumnStart: 1, gridColumnEnd: 2, gridRowStart: 1, gridRowEnd: 3 } },
    { name: 'Square', layout: { gridColumnStart: 1, gridColumnEnd: 2, gridRowStart: 1, gridRowEnd: 2 } },
  ];
    
  return (
    <aside className="w-64 bg-gray-800 p-4 flex flex-col gap-6 border-l border-gray-700 z-10 overflow-y-auto">
        <div>
            <h2 className="text-lg font-bold font-manga text-indigo-400 mb-3 border-b border-gray-600 pb-2">ADD PANELS</h2>
            <div className="grid grid-cols-2 gap-2">
                {panelLayouts.map(p => (
                    <button key={p.name} onClick={() => onAddPanel(p.layout)} className="bg-gray-700 hover:bg-gray-600 text-gray-300 rounded p-2 text-center text-sm transition-colors">
                        {p.name}
                    </button>
                ))}
            </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6">
            <h2 className="text-lg font-bold font-manga text-indigo-400 mb-3 border-b border-gray-600 pb-2">EDIT PANEL</h2>
             <div className="space-y-3">
                <ToolButton onClick={onGenerateImage} icon="image" label="Generate Image" disabled={!isPanelSelected} hotkey="G" />
                <ToolButton onClick={onAddSpeechBubble} icon="text" label="Add Dialogue" disabled={!isPanelSelected} hotkey="T" />
                <ToolButton onClick={onDeletePanel} icon="delete" label="Delete Panel" disabled={!isPanelSelected} hotkey="Del" />
            </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
             <h2 className="text-lg font-bold font-manga text-indigo-400 mb-3 border-b border-gray-600 pb-2">PROJECT</h2>
             <div className="space-y-3">
                <ToolButton onClick={() => onTranslate('Japanese')} icon="translate" label="Translate" isLoading={isTranslating} />
                <ToolButton onClick={saveProject} icon="save" label="Save Project" hotkey="Ctrl+S" />
                <ToolButton onClick={() => window.print()} icon="export" label="Export PDF/PNG" />
             </div>
        </div>
    </aside>
  );
};


import React from 'react';
import { Panel as PanelType, PanelLayout, SpeechBubbleData } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { SpeechBubble } from './SpeechBubble';

interface PanelProps {
  panelData: PanelType;
  isSelected: boolean;
  isGenerating: boolean;
  onSelect: () => void;
  onUpdateLayout: (layout: PanelLayout) => void;
  activeEditingBubbleId: string | null;
  setActiveEditingBubbleId: (id: string | null) => void;
  onUpdateSpeechBubble: (bubbleId: string, updates: Partial<SpeechBubbleData>) => void;
  onDeleteSpeechBubble: (bubbleId: string) => void;
}

export const Panel: React.FC<PanelProps> = ({ 
    panelData, 
    isSelected, 
    isGenerating, 
    onSelect,
    onUpdateLayout,
    activeEditingBubbleId,
    setActiveEditingBubbleId,
    onUpdateSpeechBubble,
    onDeleteSpeechBubble
}) => {
  const { layout, imageUrl, speechBubbles } = panelData;
  const style = {
    gridColumn: `${layout.gridColumnStart} / ${layout.gridColumnEnd}`,
    gridRow: `${layout.gridRowStart} / ${layout.gridRowEnd}`,
  };

  return (
    <div
      className="panel-wrapper relative"
      style={style}
      onClick={onSelect}
    >
      <div className={`relative w-full h-full bg-gray-200 border-2 transition-all duration-200 overflow-hidden ${isSelected ? 'border-indigo-500' : 'border-black'}`}>
        {isGenerating && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-10">
            <LoadingSpinner />
            <p className="text-white mt-4 text-lg">Generating Art...</p>
          </div>
        )}
        {imageUrl ? (
          <img src={imageUrl} alt={panelData.prompt} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500">Select this panel and generate an image</p>
          </div>
        )}

        {speechBubbles.map((bubble) => (
          <SpeechBubble
            key={bubble.id}
            data={bubble}
            panelId={panelData.id}
            onUpdate={onUpdateSpeechBubble}
            onDelete={() => onDeleteSpeechBubble(bubble.id)}
            isEditing={bubble.id === activeEditingBubbleId}
            setIsEditing={setActiveEditingBubbleId}
          />
        ))}

      </div>
    </div>
  );
};

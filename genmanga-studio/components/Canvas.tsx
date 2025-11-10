
import React from 'react';
import { Panel as PanelType, PanelLayout, SpeechBubbleData } from '../types';
import { Panel } from './Panel';

interface CanvasProps {
  panels: PanelType[];
  selectedPanelId: string | null;
  onSelectPanel: (panelId: string) => void;
  isGenerating: boolean;
  updatePanelLayout: (panelId: string, layout: PanelLayout) => void;
  activeEditingBubbleId: string | null;
  setActiveEditingBubbleId: (id: string | null) => void;
  onUpdateSpeechBubble: (bubbleId: string, updates: Partial<SpeechBubbleData>) => void;
  onDeleteSpeechBubble: (bubbleId: string) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
    panels,
    selectedPanelId,
    onSelectPanel,
    isGenerating,
    updatePanelLayout,
    activeEditingBubbleId,
    setActiveEditingBubbleId,
    onUpdateSpeechBubble,
    onDeleteSpeechBubble
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-800 shadow-2xl p-2 aspect-[210/297]">
      <div 
        id="manga-page" 
        className="w-full h-full bg-white grid grid-cols-3 grid-rows-2 gap-2"
        style={{ gridTemplateRows: 'repeat(2, minmax(0, 1fr))' }}
        >
        {panels.map((panel) => (
          <Panel
            key={panel.id}
            panelData={panel}
            isSelected={panel.id === selectedPanelId}
            isGenerating={isGenerating && panel.id === selectedPanelId}
            onSelect={() => onSelectPanel(panel.id)}
            onUpdateLayout={(layout) => updatePanelLayout(panel.id, layout)}
            activeEditingBubbleId={activeEditingBubbleId}
            setActiveEditingBubbleId={setActiveEditingBubbleId}
            onUpdateSpeechBubble={onUpdateSpeechBubble}
            onDeleteSpeechBubble={onDeleteSpeechBubble}
          />
        ))}
      </div>
    </div>
  );
};

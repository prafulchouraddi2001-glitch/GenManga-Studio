import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './Header';
import { Toolbox } from './Toolbox';
import { Canvas } from './Canvas';
import { ImageGeneratorModal } from './ImageGeneratorModal';
import { Panel, SpeechBubbleData, StylePreset, PanelLayout, Chapter } from '../types';
import { generateMangaImage, generateText } from '../services/geminiService';
import { toast } from 'react-hot-toast';

interface EditorProps {
    chapterData: Chapter;
    onSaveChapter: (chapter: Chapter) => void;
    onBackToDashboard: () => void;
}

export const Editor: React.FC<EditorProps> = ({ chapterData, onSaveChapter, onBackToDashboard }) => {
  const [chapter, setChapter] = useState(chapterData);
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);
  const [isGeneratorOpen, setGeneratorOpen] = useState(false);
  const [isGenerating, setGenerating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeEditingBubbleId, setActiveEditingBubbleId] = useState<string | null>(null);

  const selectedPanel = chapter.panels.find(p => p.id === selectedPanelId);

  // Debounced save
  useEffect(() => {
    const handler = setTimeout(() => {
        if (JSON.stringify(chapter) !== JSON.stringify(chapterData)) {
            onSaveChapter(chapter);
        }
    }, 1500);
    return () => clearTimeout(handler);
  }, [chapter, chapterData, onSaveChapter]);

  const updatePanel = useCallback((panelId: string, updates: Partial<Panel>) => {
    setChapter(prev => ({
      ...prev,
      panels: prev.panels.map(p => p.id === panelId ? { ...p, ...updates } : p)
    }));
  }, []);

  const handleSelectPanel = (panelId: string) => {
    setSelectedPanelId(panelId);
    setActiveEditingBubbleId(null);
  };

  const handleAddPanel = (layout: PanelLayout) => {
    const newPanel: Panel = {
      id: `panel-${Date.now()}`,
      layout,
      prompt: '',
      imageUrl: null,
      speechBubbles: [],
    };
    setChapter(prev => ({ ...prev, panels: [...prev.panels, newPanel] }));
  };

  const handleDeletePanel = (panelId: string) => {
    setChapter(prev => ({ ...prev, panels: prev.panels.filter(p => p.id !== panelId) }));
    if (selectedPanelId === panelId) {
      setSelectedPanelId(null);
    }
  };

  const openImageGenerator = () => {
    if (selectedPanelId) {
      setGeneratorOpen(true);
    } else {
      toast.error('Please select a panel first!');
    }
  };

  const handleGenerateImage = async (prompt: string, style: StylePreset) => {
    if (!selectedPanelId) return;
    setGenerating(true);
    setGeneratorOpen(false);
    updatePanel(selectedPanelId, { prompt });

    try {
      const fullPrompt = `${prompt}, ${style.promptSuffix}`;
      const base64Image = await generateMangaImage(fullPrompt);
      const imageUrl = `data:image/png;base64,${base64Image}`;
      updatePanel(selectedPanelId, { imageUrl });
      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Image generation failed:', error);
      toast.error('Failed to generate image. Check console for details.');
      updatePanel(selectedPanelId, { imageUrl: null });
    } finally {
      setGenerating(false);
    }
  };

  const handleAddSpeechBubble = () => {
    if (!selectedPanelId) return;
    const newBubble: SpeechBubbleData = {
      id: `bubble-${Date.now()}`,
      text: 'Your text here...',
      position: { x: 20, y: 20 },
      width: 150,
      height: 80,
    };
    const updatedBubbles = [...(selectedPanel?.speechBubbles || []), newBubble];
    updatePanel(selectedPanelId, { speechBubbles: updatedBubbles });
    setActiveEditingBubbleId(newBubble.id);
  };

  const handleUpdateSpeechBubble = (bubbleId: string, updates: Partial<SpeechBubbleData>) => {
    if (!selectedPanelId || !selectedPanel) return;
    const updatedBubbles = selectedPanel.speechBubbles.map(b =>
      b.id === bubbleId ? { ...b, ...updates } : b
    );
    updatePanel(selectedPanelId, { speechBubbles: updatedBubbles });
  };
    
  const handleDeleteSpeechBubble = (bubbleId: string) => {
    if (!selectedPanelId || !selectedPanel) return;
    const updatedBubbles = selectedPanel.speechBubbles.filter(b => b.id !== bubbleId);
    updatePanel(selectedPanelId, { speechBubbles: updatedBubbles });
  }

  const handleTranslateProject = async (targetLanguage: string) => {
    setIsTranslating(true);
    toast.loading(`Translating to ${targetLanguage}...`);
    try {
      const originalTexts: { panelId: string, bubbleId: string, text: string }[] = [];
      chapter.panels.forEach(panel => {
        panel.speechBubbles.forEach(bubble => {
          originalTexts.push({ panelId: panel.id, bubbleId: bubble.id, text: bubble.text });
        });
      });

      if (originalTexts.length === 0) {
        toast.dismiss();
        toast.error("No text to translate.");
        setIsTranslating(false);
        return;
      }
      
      const prompt = `Translate the following JSON array of dialogue into ${targetLanguage}. Maintain the JSON structure and IDs, only translating the 'text' field. \n\n${JSON.stringify(originalTexts.map(t => ({id: t.bubbleId, text: t.text})))}`;
      const responseText = await generateText(prompt);

      const jsonString = responseText.replace(/```json|```/g, '').trim();
      const translatedTexts: {id: string, text: string}[] = JSON.parse(jsonString);

      const newPanels = chapter.panels.map(panel => {
        const newSpeechBubbles = panel.speechBubbles.map(bubble => {
          const translated = translatedTexts.find(t => t.id === bubble.id);
          return translated ? { ...bubble, text: translated.text } : bubble;
        });
        return { ...panel, speechBubbles: newSpeechBubbles };
      });
      
      setChapter(prev => ({ ...prev, panels: newPanels }));

      toast.dismiss();
      toast.success(`Translation to ${targetLanguage} complete!`);

    } catch(error) {
      console.error("Translation failed:", error);
      toast.dismiss();
      toast.error("Failed to translate. Check console for details.");
    } finally {
      setIsTranslating(false);
    }
  }

  const handleSaveProject = () => {
    onSaveChapter(chapter);
    toast.success("Chapter Saved!");
  }

  useEffect(() => {
    const handleUnselect = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.panel-wrapper') && !target.closest('.toolbox')) {
            setSelectedPanelId(null);
            setActiveEditingBubbleId(null);
        }
    };
    document.addEventListener('mousedown', handleUnselect);
    return () => document.removeEventListener('mousedown', handleUnselect);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header 
        projectTitle={chapter.title} 
        onTitleChange={(newTitle) => setChapter(p => ({ ...p, title: newTitle }))}
        onBack={onBackToDashboard}
        />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col p-4 md:p-8 overflow-auto">
          <Canvas
            panels={chapter.panels}
            selectedPanelId={selectedPanelId}
            onSelectPanel={handleSelectPanel}
            isGenerating={isGenerating}
            updatePanelLayout={(id, layout) => updatePanel(id, { layout })}
            activeEditingBubbleId={activeEditingBubbleId}
            setActiveEditingBubbleId={setActiveEditingBubbleId}
            onUpdateSpeechBubble={handleUpdateSpeechBubble}
            onDeleteSpeechBubble={handleDeleteSpeechBubble}
          />
        </main>
        <Toolbox
          onAddPanel={handleAddPanel}
          onDeletePanel={() => selectedPanelId && handleDeletePanel(selectedPanelId)}
          onGenerateImage={openImageGenerator}
          onAddSpeechBubble={handleAddSpeechBubble}
          isPanelSelected={!!selectedPanelId}
          saveProject={handleSaveProject}
          onTranslate={handleTranslateProject}
          isTranslating={isTranslating}
        />
      </div>
      {isGeneratorOpen && selectedPanel && (
        <ImageGeneratorModal
          panel={selectedPanel}
          onClose={() => setGeneratorOpen(false)}
          onGenerate={handleGenerateImage}
        />
      )}
    </div>
  );
};

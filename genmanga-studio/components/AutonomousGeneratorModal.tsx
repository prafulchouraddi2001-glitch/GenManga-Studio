import React, { useState, useEffect } from 'react';
import { Chapter } from '../types';
import { Icon } from './Icon';
import { autonomousDirector } from '../services/autonomousDirector';

interface AutonomousGeneratorModalProps {
  onClose: () => void;
  onComplete: (project: Omit<Chapter, 'id' | 'lastModified' | 'chapter_number' | 'description' | 'status'>) => void;
}

export const AutonomousGeneratorModal: React.FC<AutonomousGeneratorModalProps> = ({ onClose, onComplete }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusLog, setStatusLog] = useState<string[]>([]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStatusLog(['Initiating autonomous generation...']);
    try {
      const newProject = await autonomousDirector.generateMangaSeries((status) => {
        setStatusLog(prev => [...prev, status]);
      });
      onComplete(newProject);
    } catch (error) {
      console.error("Autonomous generation failed:", error);
      setStatusLog(prev => [...prev, 'Error: Generation failed. Check the console for details.']);
      setIsGenerating(false); // Make sure button is re-enabled on error
    } 
    // Do not set isGenerating to false on success, as the modal will close.
  };

  useEffect(() => {
    const logContainer = document.getElementById('status-log-container');
    if (logContainer) {
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  }, [statusLog]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-95 animate-modal-in">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold font-manga text-green-400">Autonomous Manga Generation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" disabled={isGenerating}>
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8 space-y-6">
          <p className="text-gray-300">
            The AI director will now take over. It will invent a story, design characters, generate artwork, write dialogue, and lay out the pages. This process is fully automated and requires no human input.
          </p>
          
          <div 
            id="status-log-container"
            className="w-full h-48 bg-gray-900 rounded-lg p-3 text-sm font-mono text-green-300 overflow-y-auto border border-gray-700"
          >
            {statusLog.map((log, index) => (
              <p key={index} className="whitespace-pre-wrap animate-fade-in">{`> ${log}`}</p>
            ))}
            {isGenerating && <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse mt-2"></div>}
          </div>
        </div>
        <div className="bg-gray-700/50 px-8 py-4 flex justify-end rounded-b-2xl">
          <button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-all duration-200"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <Icon name="generate" className="w-5 h-5" />
                Create New Manga
              </>
            )}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes modal-in {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-modal-in { animation: modal-in 0.3s ease-out forwards; }
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

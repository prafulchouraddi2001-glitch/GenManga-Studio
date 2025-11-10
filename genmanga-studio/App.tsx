import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Dashboard } from './components/Dashboard';
import { Editor } from './components/Editor';
import { AutonomousGeneratorModal } from './components/AutonomousGeneratorModal';
import { useChapters } from './hooks/useMangaProjects';
import { Chapter } from './types';

const App: React.FC = () => {
  const { chapters, addChapter, updateChapter, deleteChapter, loading, setChapters, loadChapters } = useChapters();
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor'>('dashboard');
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [isAutonomousGeneratorOpen, setAutonomousGeneratorOpen] = useState(false);

  const handleSelectChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setCurrentView('editor');
  };

  const handleBackToDashboard = () => {
    setSelectedChapterId(null);
    setCurrentView('dashboard');
    loadChapters(); // Refresh chapters when returning to dashboard
  };

  const handleAutonomousGenerationComplete = async (newProjectData: Omit<Chapter, 'id' | 'lastModified' | 'chapter_number' | 'description' | 'status'>) => {
    const nextChapterNumber = chapters.length > 0 ? Math.max(...chapters.map(c => c.chapter_number)) + 1 : 1;
    
    const newChapterData: Omit<Chapter, 'id' | 'lastModified'> = {
        ...newProjectData,
        chapter_number: nextChapterNumber,
        description: `An autonomously generated chapter.`,
        status: 'Draft',
    };
    
    // The new createChapter function in supabaseClient requires the full data
    const fullChapterPayload = {
        ...newChapterData,
        lastModified: Date.now(),
        id: `temp-id-${Date.now()}` // temporary id
    }

    const newChapter = await addChapter(fullChapterPayload);
    setAutonomousGeneratorOpen(false);
    if (newChapter) {
        toast.success('New manga chapter generated! Opening editor...');
        setTimeout(() => {
            // Need to find the actual ID from the state after it's loaded.
            // This is a bit of a workaround for the current hook structure.
            loadChapters().then(() => {
                const latestChapter = chapters.sort((a,b) => b.lastModified - a.lastModified)[0];
                if (latestChapter) {
                    handleSelectChapter(latestChapter.id);
                }
            })
        }, 1000);
    } else {
        toast.error('Failed to create new chapter in the database.');
    }
  }
  
  const selectedChapter = chapters.find(p => p.id === selectedChapterId);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 overflow-hidden">
        <Toaster position="top-center" reverseOrder={false} toastOptions={{
            style: { background: '#334155', color: '#fff' },
        }} />
        
        {currentView === 'dashboard' ? (
            <Dashboard 
                chapters={chapters}
                loading={loading}
                onSelectChapter={handleSelectChapter}
                onDeleteChapter={deleteChapter}
                onStartAutonomousGeneration={() => setAutonomousGeneratorOpen(true)}
                setChapters={setChapters}
            />
        ) : selectedChapter ? (
            <Editor 
                key={selectedChapter.id}
                chapterData={selectedChapter}
                onSaveChapter={updateChapter}
                onBackToDashboard={handleBackToDashboard}
            />
        ) : (
            <div className="flex items-center justify-center h-full">
                <p>Chapter not found. Returning to dashboard...</p>
                {/* A simple mechanism to prevent getting stuck on a bad state */}
                {(() => {
                    setTimeout(() => handleBackToDashboard(), 2000);
                    return null;
                })()}
            </div>
        )}

        {isAutonomousGeneratorOpen && (
            <AutonomousGeneratorModal
                onClose={() => setAutonomousGeneratorOpen(false)}
                onComplete={handleAutonomousGenerationComplete}
            />
        )}
    </div>
  );
};

export default App;

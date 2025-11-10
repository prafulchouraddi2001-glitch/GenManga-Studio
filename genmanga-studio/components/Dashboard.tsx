import React, { useState } from 'react';
import { Chapter, Character, StoryArc, PowerSystem } from '../types';
import { Icon } from './Icon';
import { Header } from './Header';
import { LoadingSpinner } from './LoadingSpinner';
import { toast } from 'react-hot-toast';
import { createChapter, createCharacter, createStoryArc, createPowerSystem } from '../services/supabaseClient';

// --- GENERIC FORM MODAL ---
interface FormModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}
const FormModal: React.FC<FormModalProps> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 animate-modal-in">
      <div className="flex justify-between items-center p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold font-manga text-indigo-400">{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <Icon name="close" className="w-6 h-6" />
        </button>
      </div>
      {children}
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

// --- FORM COMPONENTS ---

interface CreateChapterFormProps {
  onClose: () => void;
  onSuccess: (newChapter: Chapter) => void;
}
const CreateChapterForm: React.FC<CreateChapterFormProps> = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [chapterNumber, setChapterNumber] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Planned'>('Planned');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || chapterNumber === null) {
      toast.error('Title and Chapter Number are required.');
      return;
    }
    setIsSubmitting(true);
    
    const { data, error } = await createChapter({
      chapter_number: chapterNumber,
      title,
      description,
      status,
      panels: [],
      lastModified: new Date().toISOString()
    });

    setIsSubmitting(false);

    if (error) {
      toast.error(`Failed to create chapter: ${error.message}`);
    } else if (data) {
      toast.success('Chapter created successfully!');
      onSuccess({ ...data, panels: [], lastModified: Date.parse(data.lastModified) });
      onClose();
    }
  };

  return (
    <FormModal title="Create New Chapter" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="p-8 space-y-4">
            <div>
                <label htmlFor="chapter-title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input id="chapter-title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
                <label htmlFor="chapter-number" className="block text-sm font-medium text-gray-300 mb-1">Chapter Number</label>
                <input id="chapter-number" type="number" value={chapterNumber} onChange={e => setChapterNumber(parseInt(e.target.value, 10))} required className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
                <label htmlFor="chapter-desc" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea id="chapter-desc" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
                <label htmlFor="chapter-status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select id="chapter-status" value={status} onChange={e => setStatus(e.target.value as any)} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-indigo-500">
                    <option>Planned</option>
                    <option>Draft</option>
                </select>
            </div>
        </div>
        <div className="bg-gray-700/50 px-8 py-4 flex justify-end rounded-b-2xl">
            <button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                {isSubmitting ? 'Creating...' : 'Create Chapter'}
            </button>
        </div>
      </form>
    </FormModal>
  );
};

const CreateCharacterForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [abilities, setAbilities] = useState('');
    const [role, setRole] = useState<'Protagonist' | 'Antagonist' | 'Supporting' | 'Side Character'>('Supporting');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const { error } = await createCharacter({ name, description, abilities, role });
        setIsSubmitting(false);
        if (error) toast.error(`Failed to create character: ${error.message}`);
        else {
            toast.success(`Character "${name}" created!`);
            onClose();
        }
    };
    
    return (
        <FormModal title="Create New Character" onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-8 space-y-4">
                     <div>
                        <label htmlFor="char-name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                        <input id="char-name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="char-desc" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea id="char-desc" value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-indigo-500" />
                    </div>
                     <div>
                        <label htmlFor="char-abilities" className="block text-sm font-medium text-gray-300 mb-1">Abilities</label>
                        <textarea id="char-abilities" value={abilities} onChange={e => setAbilities(e.target.value)} required rows={3} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="char-role" className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                        <select id="char-role" value={role} onChange={e => setRole(e.target.value as any)} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-indigo-500">
                            <option>Protagonist</option>
                            <option>Antagonist</option>
                            <option>Supporting</option>
                            <option>Side Character</option>
                        </select>
                    </div>
                </div>
                <div className="bg-gray-700/50 px-8 py-4 flex justify-end rounded-b-2xl">
                    <button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">
                        {isSubmitting ? 'Saving...' : 'Save Character'}
                    </button>
                </div>
            </form>
        </FormModal>
    );
};

const CreateStoryArcForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    // Simplified form state
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const { error } = await createStoryArc({ title, summary, status: 'Planned' });
        setIsSubmitting(false);
        if (error) toast.error(`Failed to create story arc: ${error.message}`);
        else {
            toast.success(`Story Arc "${title}" created!`);
            onClose();
        }
    };

    return (
        <FormModal title="Create New Story Arc" onClose={onClose}>
             <form onSubmit={handleSubmit}>
                <div className="p-8 space-y-4">
                    <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white" />
                    <textarea placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)} required rows={4} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white" />
                </div>
                <div className="bg-gray-700/50 px-8 py-4 flex justify-end rounded-b-2xl">
                    <button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">
                        {isSubmitting ? 'Saving...' : 'Save Arc'}
                    </button>
                </div>
            </form>
        </FormModal>
    );
};

const CreatePowerSystemForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [rules, setRules] = useState('');
    const [limitations, setLimitations] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const { error } = await createPowerSystem({ name, description, rules, limitations });
        setIsSubmitting(false);
        if (error) toast.error(`Failed to create power system: ${error.message}`);
        else {
            toast.success(`Power System "${name}" created!`);
            onClose();
        }
    };
    
    return (
        <FormModal title="Create New Power System" onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-8 space-y-4">
                    <input type="text" placeholder="Name (e.g., Aura, Alchemy)" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white" />
                    <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white" />
                    <textarea placeholder="Rules" value={rules} onChange={e => setRules(e.target.value)} required rows={3} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white" />
                    <textarea placeholder="Limitations" value={limitations} onChange={e => setLimitations(e.target.value)} required rows={3} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white" />
                </div>
                <div className="bg-gray-700/50 px-8 py-4 flex justify-end rounded-b-2xl">
                    <button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">
                        {isSubmitting ? 'Saving...' : 'Save System'}
                    </button>
                </div>
            </form>
        </FormModal>
    );
};


// --- DASHBOARD COMPONENT ---
interface DashboardProps {
  chapters: Chapter[];
  loading: boolean;
  onSelectChapter: (chapterId: string) => void;
  onDeleteChapter: (chapterId: string) => void;
  onStartAutonomousGeneration: () => void;
  setChapters: React.Dispatch<React.SetStateAction<Chapter[]>>;
}

const ChapterCard: React.FC<{ chapter: Chapter; onSelect: () => void; onDelete: () => void; }> = ({ chapter, onSelect, onDelete }) => {
    const thumbnailUrl = chapter.panels.find(p => p.imageUrl)?.imageUrl;
    const statusColor = {
        Draft: 'bg-yellow-500',
        Inking: 'bg-blue-500',
        Complete: 'bg-green-500',
        Planned: 'bg-gray-500',
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-1 transition-transform duration-300">
            <div className="relative aspect-video bg-gray-700">
                {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt={chapter.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <Icon name="logo" className="w-12 h-12 text-gray-500" />
                    </div>
                )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                 <h3 className="absolute bottom-2 left-4 text-lg font-bold text-white font-manga">
                    Ch. {chapter.chapter_number}: {chapter.title}
                 </h3>
                 <span className={`absolute top-2 right-2 text-xs font-bold text-white px-2 py-1 rounded-full ${statusColor[chapter.status]}`}>
                    {chapter.status}
                 </span>
            </div>
            <div className="p-4">
                <p className="text-sm text-gray-400 mb-4 h-10 overflow-hidden">
                    {chapter.description || 'No description.'}
                </p>
                <div className="flex justify-between gap-2">
                    <button onClick={onSelect} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-md transition-colors">
                        Edit
                    </button>
                    <button onClick={onDelete} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md transition-colors">
                        <Icon name="delete" className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ chapters, loading, onSelectChapter, onDeleteChapter, onStartAutonomousGeneration, setChapters }) => {
  const [modalOpen, setModalOpen] = useState<'chapter' | 'character' | 'arc' | 'power' | null>(null);

  const handleChapterCreated = (newChapter: Chapter) => {
    setChapters(prev => [...prev, newChapter].sort((a,b) => a.chapter_number - b.chapter_number));
  }

  return (
    <div className="flex flex-col h-screen">
        <Header projectTitle="Dashboard" onTitleChange={() => {}} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold font-manga text-white">Manga Chapters</h2>
                    <div className="flex gap-2">
                         <button onClick={() => setModalOpen('chapter')} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all">
                            <Icon name="text" className="w-5 h-5" />
                            <span>New Chapter</span>
                        </button>
                        <button onClick={onStartAutonomousGeneration} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all">
                            <Icon name="generate" className="w-5 h-5" />
                            <span>Create with AI</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-16"><LoadingSpinner /></div>
                ) : chapters.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {chapters.map(chapter => (
                            <ChapterCard key={chapter.id} chapter={chapter} onSelect={() => onSelectChapter(chapter.id)} onDelete={() => onDeleteChapter(chapter.id)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 px-6 bg-gray-800 rounded-lg">
                        <h3 className="text-xl font-semibold text-white">Welcome to GenManga Studio!</h3>
                        <p className="text-gray-400 mt-2 mb-4">Click "New Chapter" or "Create with AI" to get started.</p>
                    </div>
                )}

                <div className="mt-12 border-t border-gray-700 pt-8">
                    <h2 className="text-3xl font-bold font-manga text-white mb-6">World Building</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button onClick={() => setModalOpen('character')} className="p-6 bg-gray-800 rounded-lg text-left hover:bg-gray-700 transition-colors">
                            <h3 className="text-xl font-bold font-manga text-indigo-400">Characters</h3>
                            <p className="text-gray-400 mt-1">Create and manage your story's cast.</p>
                        </button>
                        <button onClick={() => setModalOpen('arc')} className="p-6 bg-gray-800 rounded-lg text-left hover:bg-gray-700 transition-colors">
                            <h3 className="text-xl font-bold font-manga text-indigo-400">Story Arcs</h3>
                            <p className="text-gray-400 mt-1">Outline the major plot points and sagas.</p>
                        </button>
                        <button onClick={() => setModalOpen('power')} className="p-6 bg-gray-800 rounded-lg text-left hover:bg-gray-700 transition-colors">
                            <h3 className="text-xl font-bold font-manga text-indigo-400">Power Systems</h3>
                            <p className="text-gray-400 mt-1">Define the rules of magic and abilities.</p>
                        </button>
                    </div>
                </div>
            </div>
        </main>
        
        {modalOpen === 'chapter' && <CreateChapterForm onClose={() => setModalOpen(null)} onSuccess={handleChapterCreated} />}
        {modalOpen === 'character' && <CreateCharacterForm onClose={() => setModalOpen(null)} />}
        {modalOpen === 'arc' && <CreateStoryArcForm onClose={() => setModalOpen(null)} />}
        {modalOpen === 'power' && <CreatePowerSystemForm onClose={() => setModalOpen(null)} />}

    </div>
  );
};

import { useState, useEffect, useCallback } from 'react';
import { Chapter, Panel, Json } from '../types';
import { toast } from 'react-hot-toast';
import { supabase } from '../services/supabaseClient';

const defaultChapterData: Omit<Chapter, 'id' | 'lastModified'> = {
  chapter_number: 1,
  title: 'The Beginning',
  description: 'This is the very first chapter of a new adventure!',
  status: 'Draft',
  panels: [
    {
      id: 'panel-1',
      layout: { gridColumnStart: 1, gridColumnEnd: 3, gridRowStart: 1, gridRowEnd: 2 },
      prompt: 'A close-up of a determined anime hero, sharp eyes, wind blowing through his spiky black hair, shonen manga style, high contrast',
      imageUrl: 'https://picsum.photos/seed/manga1/800/400',
      speechBubbles: [
        { id: 'bubble-1', text: "I won't give up!", position: { x: 350, y: 50 }, width: 180, height: 90 },
      ],
    },
    {
      id: 'panel-2',
      layout: { gridColumnStart: 3, gridColumnEnd: 4, gridRowStart: 1, gridRowEnd: 3 },
      prompt: 'A magical girl casting a powerful spell, glowing energy swirling around her, shojo manga style, detailed background',
      imageUrl: 'https://picsum.photos/seed/manga2/400/800',
      speechBubbles: [
          { id: 'bubble-2', text: "By the power of the stars!", position: { x: 30, y: 500 }, width: 220, height: 100 },
      ],
    },
  ],
};


export const useChapters = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChapters = useCallback(async () => {
    setLoading(true);
    const { data: savedChapters, error } = await supabase
        .from('chapters')
        .select('*')
        .order('chapter_number', { ascending: true });

    if (error) {
        console.error('Failed to load chapters from Supabase:', error);
        const errorMessage = error.message || 'An unknown error occurred. Check the console for details.';
        toast.error(`Failed to load chapters: ${errorMessage}`);
        setChapters([]);
    } else if (savedChapters && savedChapters.length === 0) {
        // No chapters exist, create the default one.
        // Fix: The type of defaultChapterData needs to be cast to 'any' to match the 'Insert' type for Supabase, specifically for the 'panels' property.
        const { data: newChapter, error: insertError } = await supabase
            .from('chapters')
            .insert({ ...(defaultChapterData as any), lastModified: new Date().toISOString() })
            .select()
            .single();
        
        if (insertError) {
            console.error('Failed to create default chapter:', insertError);
            toast.error(`Failed to create initial chapter: ${insertError.message}`);
        } else if (newChapter) {
            const chapterWithNumericDate = {...newChapter, panels: newChapter.panels as Panel[], lastModified: Date.parse(newChapter.lastModified)};
            setChapters([chapterWithNumericDate]);
        }
    } else if (savedChapters) {
        setChapters(savedChapters.map(p => ({...p, panels: p.panels as Panel[], lastModified: Date.parse(p.lastModified)})));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadChapters();
  }, [loadChapters]);
  
  const addChapter = useCallback(async (newChapterData: Chapter): Promise<Chapter | null> => {
    // The chapter is already added to state optimistically from the form, so we just refresh.
    loadChapters();
    return newChapterData;
  }, [loadChapters]);

  const updateChapter = useCallback(async (updatedChapter: Chapter) => {
    // Fix: Destructure 'id' from the payload, as it should not be in the update object.
    const { id, ...chapterPayload } = updatedChapter;
    const chapterWithTimestamp = { ...chapterPayload, lastModified: new Date().toISOString() };
    const { error } = await supabase
        .from('chapters')
        .update(chapterWithTimestamp as any)
        .eq('id', updatedChapter.id);

    if (error) {
        console.error('Failed to update chapter in Supabase:', error);
        toast.error('Failed to save chapter changes.');
    } else {
         setChapters(prevChapters =>
            prevChapters.map(p => p.id === updatedChapter.id ? { ...updatedChapter, lastModified: Date.now() } : p)
                      .sort((a, b) => a.chapter_number - b.chapter_number)
        );
    }
  }, []);

  const deleteChapter = useCallback(async (chapterId: string) => {
    const chapterToDelete = chapters.find(p => p.id === chapterId);
    if (window.confirm(`Are you sure you want to delete "${chapterToDelete?.title}"?`)) {
        const { error } = await supabase.from('chapters').delete().eq('id', chapterId);
        if (error) {
            console.error('Failed to delete chapter from Supabase:', error);
            toast.error('Failed to delete chapter.');
        } else {
            setChapters(prevChapters => prevChapters.filter(p => p.id !== chapterId));
            toast.success('Chapter deleted.');
        }
    }
  }, [chapters]);


  return { chapters, addChapter, updateChapter, deleteChapter, loading, setChapters, loadChapters };
};
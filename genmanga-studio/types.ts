// Fix: Export the Json type and correct its definition to align with JSON standards.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface SpeechBubbleData {
  id: string;
  text: string;
  position: { x: number; y: number };
  width: number;
  height: number;
}

export interface PanelLayout {
  gridColumnStart: number;
  gridColumnEnd: number;
  gridRowStart: number;
  gridRowEnd: number;
}


export interface Panel {
  id: string;
  layout: PanelLayout;
  prompt: string;
  imageUrl: string | null;
  speechBubbles: SpeechBubbleData[];
}

export interface Chapter {
  id:string;
  chapter_number: number;
  title: string;
  description: string | null;
  status: 'Draft' | 'Inking' | 'Complete' | 'Planned';
  panels: Panel[];
  lastModified: number;
}

export interface Character {
    id: string;
    name: string;
    description: string;
    abilities: string;
    role: 'Protagonist' | 'Antagonist' | 'Supporting' | 'Side Character';
    created_at: string;
}

export interface StoryArc {
    id: string;
    title: string;
    summary: string;
    start_chapter: number | null;
    end_chapter: number | null;
    status: 'Planned' | 'In Progress' | 'Completed';
    created_at: string;
}

export interface PowerSystem {
    id: string;
    name: string;
    description: string;
    rules: string;
    limitations: string;
    created_at: string;
}

export interface StylePreset {
  name: string;
  promptSuffix: string;
  previewUrl: string;
}
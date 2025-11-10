import { generateStructuredText, generateMangaImage } from './geminiService';
import { Chapter, Panel, PanelLayout, SpeechBubbleData } from '../types';
import { Type } from '@google/genai';

type UpdateStatusFn = (status: string) => void;

interface StoryConcept {
    title: string;
    genre: string;
    synopsis: string;
    characters: { name: string; description: string; }[];
}

interface PanelPlan {
    panelNumber: number;
    layoutSuggestion: 'full' | 'half' | 'tall' | 'square';
    visualPrompt: string;
    dialogue: { character: string; text: string }[];
}

const layoutMap: { [key: string]: PanelLayout } = {
    full: { gridColumnStart: 1, gridColumnEnd: 4, gridRowStart: 1, gridRowEnd: 1 },
    half: { gridColumnStart: 1, gridColumnEnd: 3, gridRowStart: 1, gridRowEnd: 1 },
    tall: { gridColumnStart: 1, gridColumnEnd: 2, gridRowStart: 1, gridRowEnd: 3 },
    square: { gridColumnStart: 1, gridColumnEnd: 2, gridRowStart: 1, gridRowEnd: 2 },
};

const storyConceptSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A catchy title for a one-shot manga chapter, in the style of an action/fantasy webtoon." },
        genre: { type: Type.STRING, description: "The genre, should be action, fantasy, or sci-fi." },
        synopsis: { type: Type.STRING, description: "A brief, 2-3 sentence summary of the chapter's plot, focusing on action and cool powers." },
        characters: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING, description: "A brief visual and personality description of a cool character, mentioning their powers or abilities." }
                },
                required: ['name', 'description']
            }
        }
    },
    required: ['title', 'genre', 'synopsis', 'characters']
};

const pagePlanSchema = {
    type: Type.OBJECT,
    properties: {
        panels: {
            type: Type.ARRAY,
            description: "An array of 4-6 panels that make up a single manga page.",
            items: {
                type: Type.OBJECT,
                properties: {
                    panelNumber: { type: Type.INTEGER },
                    layoutSuggestion: { type: Type.STRING, enum: ['full', 'half', 'tall', 'square'] },
                    visualPrompt: { type: Type.STRING, description: "A detailed visual description for an AI image generator. Describe the scene, character actions, emotions, and composition for a modern, full-color webtoon." },
                    dialogue: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                character: { type: Type.STRING, description: "Name of the character speaking." },
                                text: { type: Type.STRING, description: "The dialogue text." }
                            },
                            required: ['character', 'text']
                        }
                    }
                },
                required: ['panelNumber', 'layoutSuggestion', 'visualPrompt', 'dialogue']
            }
        }
    },
    required: ['panels']
};


const generateMangaSeries = async (updateStatus: UpdateStatusFn): Promise<Omit<Chapter, 'id' | 'lastModified'| 'chapter_number' | 'description' | 'status'>> => {
    // 1. Generate Story Concept
    updateStatus('Generating story concept...');
    const conceptPrompt = "Create an original concept for a short, self-contained one-shot chapter in the style of a modern action/fantasy webtoon like Solo Leveling. Provide a title, genre, synopsis, and 2-3 character descriptions with cool powers.";
    const concept = await generateStructuredText<StoryConcept>(conceptPrompt, storyConceptSchema);

    // 2. Generate Page Plan (panels)
    updateStatus(`Creating page layout for "${concept.title}"...`);
    const pagePlanPrompt = `Based on this webtoon concept, create a detailed plan for a single page with 4-5 dynamic panels. For each panel, provide a detailed visual prompt for an image generator, a suggested layout, and any dialogue.
    
    Concept:
    Title: ${concept.title}
    Genre: ${concept.genre}
    Synopsis: ${concept.synopsis}
    Characters: ${concept.characters.map(c => `${c.name}: ${c.description}`).join('\n')}
    `;
    const pagePlan = await generateStructuredText<{ panels: PanelPlan[] }>(pagePlanPrompt, pagePlanSchema);

    // 3. Generate Images and Assemble Panels
    const panels: Panel[] = [];
    const sortedPanels = pagePlan.panels.sort((a, b) => a.panelNumber - b.panelNumber);

    for (const plan of sortedPanels) {
        updateStatus(`Generating image for panel ${plan.panelNumber}/${pagePlan.panels.length}...`);
        
        const styleSuffix = "full color, dynamic action manhwa style, vibrant lighting, glowing effects, digital art, epic composition, webtoon, cinematic";
        const imagePrompt = `${plan.visualPrompt}, ${concept.genre}, ${styleSuffix}`;
        
        const imageUrl = `data:image/png;base64,${await generateMangaImage(imagePrompt)}`;
        
        const speechBubbles: SpeechBubbleData[] = plan.dialogue.map((d, i) => ({
            id: `bubble-${Date.now()}-${i}`,
            text: d.text,
            position: { x: 20 + i*10, y: 20 + i*10 }, // Basic initial positioning
            width: 150,
            height: 80,
        }));

        const newPanel: Panel = {
            id: `panel-${Date.now()}-${plan.panelNumber}`,
            layout: layoutMap[plan.layoutSuggestion] || layoutMap.square,
            prompt: plan.visualPrompt,
            imageUrl: imageUrl,
            speechBubbles: speechBubbles
        };
        panels.push(newPanel);
    }
    
    updateStatus('Assembling final project...');

    return {
        title: concept.title,
        panels: panels
    };
};

export const autonomousDirector = {
    generateMangaSeries,
};

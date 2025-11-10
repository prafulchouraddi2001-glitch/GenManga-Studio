
import React, { useState, useRef, useEffect } from 'react';
import { SpeechBubbleData } from '../types';
import { Icon } from './Icon';

interface SpeechBubbleProps {
  data: SpeechBubbleData;
  panelId: string;
  onUpdate: (bubbleId: string, updates: Partial<SpeechBubbleData>) => void;
  onDelete: () => void;
  isEditing: boolean;
  setIsEditing: (id: string | null) => void;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({ data, panelId, onUpdate, onDelete, isEditing, setIsEditing }) => {
  const [text, setText] = useState(data.text);
  const dragRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isEditing) return;
    e.stopPropagation();
    isDragging.current = true;
    if (dragRef.current) {
        const rect = dragRef.current.getBoundingClientRect();
        offset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !dragRef.current) return;
    e.stopPropagation();
    const parent = dragRef.current.parentElement;
    if (parent) {
      const parentRect = parent.getBoundingClientRect();
      let x = e.clientX - parentRect.left - offset.current.x;
      let y = e.clientY - parentRect.top - offset.current.y;
      
      x = Math.max(0, Math.min(x, parentRect.width - dragRef.current.offsetWidth));
      y = Math.max(0, Math.min(y, parentRect.height - dragRef.current.offsetHeight));

      onUpdate(data.id, { position: { x, y } });
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.select();
    }
  }, [isEditing]);
  
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(data.id);
  }

  const handleBlur = () => {
    onUpdate(data.id, { text });
    setIsEditing(null);
  };
  
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      ref={dragRef}
      className="absolute speech-bubble cursor-grab active:cursor-grabbing"
      style={{
        left: `${data.position.x}px`,
        top: `${data.position.y}px`,
        width: `${data.width}px`,
        height: 'auto',
        minHeight: `${data.height}px`,
        zIndex: isEditing ? 30 : 20,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onClick={stopPropagation}
    >
        <svg viewBox="0 0 32 32" className="absolute w-full h-full" style={{filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))'}}>
            <path d="M 1 1 H 31 V 17 H 17 L 9 27 V 17 H 1 Z" fill="white" stroke="black" strokeWidth="1"></path>
        </svg>
        <div className="relative p-3 w-full h-full">
            {isEditing ? (
                <textarea
                    ref={textAreaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onBlur={handleBlur}
                    className="w-full h-full bg-transparent text-black border-none outline-none resize-none font-manga text-sm"
                />
            ) : (
                <p className="text-black font-manga text-sm select-none break-words">
                    {data.text}
                </p>
            )}
        </div>
         {isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
            >
              <Icon name="close" className="w-3 h-3" />
            </button>
          )}
    </div>
  );
};

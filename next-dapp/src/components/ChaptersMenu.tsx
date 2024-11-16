'use client';
import { Menu, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';

interface Chapter {
  id: number;
  title: string;
}

interface ChaptersMenuProps {
  chapters: Chapter[];
  currentChapter: number;
  completedChaptersAmt: number;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  setCurrentChapter: (chapter: number) => void;
}

export function ChaptersMenu({
  chapters,
  currentChapter,
  completedChaptersAmt,
  isMenuOpen,
  setIsMenuOpen,
  setCurrentChapter,
}: ChaptersMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsMenuOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="hover:bg-green-50 transition-colors duration-300"
      >
        <Menu className="h-6 w-6 text-green-600" />
      </Button>
      {isMenuOpen && (
        <div className="absolute top-full left-0 mt-4 w-72 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl z-50 border border-white/20 transition-all duration-300">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Learning Path
            </h3>
          </div>
          <div className="space-y-2 p-4">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                className={`flex items-center w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                  chapter.id <= completedChaptersAmt + 1
                    ? 'bg-green-50 hover:bg-green-100'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (chapter.id <= completedChaptersAmt + 1) {
                    setCurrentChapter(chapter.id);
                    setIsMenuOpen(false);
                  }
                }}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-lg mr-3 transition-colors duration-300 ${
                    chapter.id === currentChapter
                      ? 'bg-green-600 text-white'
                      : chapter.id <= completedChaptersAmt + 1
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {chapter.id}
                </div>
                <span
                  className={`font-medium ${chapter.id > completedChaptersAmt + 1 ? 'text-gray-400' : ''}`}
                >
                  {chapter.title}
                </span>
                {chapter.id <= completedChaptersAmt && (
                  <Check className="w-5 h-5 ml-auto text-green-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

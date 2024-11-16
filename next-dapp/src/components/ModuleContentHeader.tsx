'use client';

import { ChevronLeft } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import chapters from '@/app/module-content/chapters.json';
import { useState } from 'react';
import { ChaptersMenu } from '@/components/ChaptersMenu';

interface ModuleContentHeaderProps {
  currentChapter: number;
  chapterTitle: string;
  completedChaptersAmt: number;
  totalChapters: number;
  setCurrentChapter: (chapter: number) => void;
}

export function ModuleContentHeader({
  currentChapter,
  chapterTitle,
  completedChaptersAmt,
  totalChapters,
  setCurrentChapter,
}: ModuleContentHeaderProps) {
  const progress = (completedChaptersAmt / totalChapters) * 100;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-10">
      <div className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-md mx-4 border border-gray-150 z-10">
        <ChaptersMenu
          chapters={chapters}
          currentChapter={currentChapter}
          completedChaptersAmt={completedChaptersAmt}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          setCurrentChapter={setCurrentChapter}
        />

        <div className="flex items-center space-x-3">
          <div className="text-sm font-medium text-green-600">
            Chapter {currentChapter}
          </div>
          <ChevronLeft className="h-4 w-4 text-gray-400" />
          <div className="text-sm text-gray-600">{chapterTitle}</div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {completedChaptersAmt}/{totalChapters} completed
          </div>
          <div style={{ width: 48, height: 48 }}>
            <CircularProgressbar
              value={progress}
              text={`${Math.round(progress)}%`}
              styles={buildStyles({
                textSize: '24px',
                pathColor: `rgba(22, 163, 74, ${progress / 100})`,
                textColor: '#16a34a',
                trailColor: '#e2e8f0',
                pathTransitionDuration: 0.5,
              })}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

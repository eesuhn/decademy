'use client';

import { useState, useEffect } from 'react';
import { ModuleContentHeader } from '@/components/ModuleContentHeader';
import { ChapterContent } from '@/components/ChapterContent';
import { ModuleCompletionCard } from '@/components/ModuleCompletionCard';
import { QuizComponent } from '@/components/ModuleQuiz';
import chapters from './chapters.json';

export default function LearningPage() {
  const [currentModuleId, setCurrentModuleId] = useState(() =>
    Number(sessionStorage.getItem('currentModuleId'))
  );
  const [modulePageAmount, setModulePageAmount] = useState(() =>
    Number(sessionStorage.getItem('modulePageAmount'))
  );
  const [currentChapter, setCurrentChapter] = useState(() => {
    // Retrieve the current chapter from sessionStorage or default to 1
    return Number(sessionStorage.getItem('currentChapter')) || 1;
  });
  const [completedChaptersAmt, setCompletedChaptersAmt] = useState(() => {
    // Retrieve the completed chapters amount from sessionStorage or default to 0
    return Number(sessionStorage.getItem('completedChaptersAmt')) || 0;
  });
  const [showQuiz, setShowQuiz] = useState(false);
  const [moduleCompleted, setModuleCompleted] = useState(false);

  const totalChapters = chapters.length;
  const currentContent = chapters.find(
    (chapter) => chapter.id === currentChapter
  )?.content;

  useEffect(() => {
    // Store the current chapter and completed chapters amount in sessionStorage whenever they change
    sessionStorage.setItem('currentChapter', currentChapter.toString());
    sessionStorage.setItem(
      'completedChaptersAmt',
      completedChaptersAmt.toString()
    );
  }, [currentChapter, completedChaptersAmt]);

  const nextChapter = () => {
    if (currentChapter < totalChapters) {
      if (currentChapter <= completedChaptersAmt + 1) {
        setCurrentChapter((prev) => prev + 1);
        setCompletedChaptersAmt((prev) => Math.min(prev + 1, totalChapters));
      } else {
        alert(
          'You must complete the previous chapters before unlocking this one.'
        );
      }
    } else if (
      currentChapter === totalChapters &&
      completedChaptersAmt <= totalChapters
    ) {
      setCompletedChaptersAmt((prev) => Math.min(prev + 1, totalChapters));
      setShowQuiz(true);
    }
  };

  const handleQuizComplete = () => {
    setShowQuiz(false);
    setModuleCompleted(true);
    setCompletedChaptersAmt(totalChapters);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-5xl py-6">
        <ModuleContentHeader
          currentChapter={currentChapter}
          chapterTitle={chapters[currentChapter - 1].title}
          completedChaptersAmt={completedChaptersAmt}
          totalChapters={totalChapters}
          setCurrentChapter={setCurrentChapter}
        />
        <main className="p-4 mt-6">
          {showQuiz ? (
            <QuizComponent onComplete={handleQuizComplete} />
          ) : moduleCompleted ? (
            <ModuleCompletionCard
              moduleId={currentModuleId}
              pageAmount={modulePageAmount}
            />
          ) : (
            <ChapterContent
              content={currentContent}
              currentChapter={currentChapter}
              totalChapters={totalChapters}
              onNext={nextChapter}
              completedChaptersAmt={completedChaptersAmt}
            />
          )}
        </main>
      </div>
    </div>
  );
}

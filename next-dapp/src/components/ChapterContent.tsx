// ChapterContent.tsx
'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MarkdownRenderer } from '@/components/CodeBlock';

interface ChapterContentProps {
  content: {
    elements: {
      type: 'title' | 'subtitle' | 'paragraph' | 'image' | 'codeBlock';
      value: string;
    }[];
  };
  currentChapter: number;
  totalChapters: number;
  onNext: () => void;
  completedChaptersAmt: number;
}

export function ChapterContent({
  content,
  currentChapter,
  totalChapters,
  onNext,
  completedChaptersAmt,
}: ChapterContentProps) {
  return (
    <Card className="backdrop-blur-sm bg-white/80 shadow-md py-4 px-4 border-gray-150">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          {content.elements.find((element) => element.type === 'title')
            ?.value || ''}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {content.elements
          .filter((element) => element.type !== 'title')
          .map((element, index) => {
            switch (element.type) {
              case 'subtitle':
                return (
                  <h2
                    key={index}
                    className="text-xl font-semibold text-gray-800"
                  >
                    {element.value}
                  </h2>
                );
              case 'paragraph':
                return (
                  <p key={index} className="text-gray-600 leading-relaxed">
                    {element.value}
                  </p>
                );
              case 'image':
                return (
                  <Image
                    key={index}
                    src={element.value || ''}
                    alt="Chapter illustration"
                    width={500}
                    height={500}
                    className="w-2/3 max-h-96 object-cover rounded-2xl"
                  />
                );
              case 'codeBlock':
                return (
                  <MarkdownRenderer
                    key={index}
                    markdown={element.value || ''}
                  />
                );
              default:
                return null;
            }
          })}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-300"
          onClick={onNext}
        >
          {currentChapter === totalChapters
            ? 'Take Assessment'
            : 'Next Chapter'}
        </Button>
      </CardFooter>
    </Card>
  );
}

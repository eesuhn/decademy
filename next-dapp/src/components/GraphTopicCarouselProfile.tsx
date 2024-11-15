import { useState } from 'react';
import { GraphTopic } from '@/components/types/discoverType';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { TopicCardProfile } from '@/components/GraphTopicCardProfile';

interface TopicCarouselProps {
  topics: GraphTopic[] | undefined;
  onTopicClick: (topic: GraphTopic) => void;
}

export function TopicCarousel({ topics, onTopicClick }: TopicCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrevious = () => {
    setActiveIndex((current) =>
      topics && current === 0 ? topics.length - 1 : current - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((current) =>
      topics && current === topics.length - 1 ? 0 : current + 1
    );
  };

  const cardColors = [
    'bg-[#2e2e2e]', // Purple
    'bg-[#5BC2C3]', // Teal
    'bg-[#FF7F50]', // Coral
  ];

  return (
    <div className="flex flex-col h-[700px]">
      {/* Top navigation button */}
      <div className="flex justify-center py-4 z-30">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-md"
          onClick={handlePrevious}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>

      {/* Carousel container */}
      <div className="relative flex-1 w-full perspective-1000">
        <div className="absolute inset-0 flex items-center justify-center">
          {topics?.map((topic, index) => {
            const isCurrent = index === activeIndex;
            const isPrevious =
              index ===
              (activeIndex === 0 ? topics?.length - 1 : activeIndex - 1);
            const isNext =
              index ===
              (activeIndex === topics?.length - 1 ? 0 : activeIndex + 1);

            return (
              <div
                key={topic.id}
                className={`absolute transition-all duration-500 w-full max-w-md
                  ${isCurrent ? 'opacity-100 z-20 scale-100' : 'opacity-60 scale-90'}
                  ${isPrevious ? 'translate-y-[-100%] rotate-x-45 z-10' : ''}
                  ${isNext ? 'translate-y-[100%] -rotate-x-45 z-10' : ''}
                  ${!isCurrent && !isPrevious && !isNext ? 'opacity-0 scale-75' : ''}
                `}
                style={{
                  transform: `
                    ${isCurrent ? 'translateZ(0) rotateX(0)' : ''}
                    ${isPrevious ? 'translateY(-50%) rotateX(45deg)' : ''}
                    ${isNext ? 'translateY(50%) rotateX(-45deg)' : ''}
                    ${!isCurrent && !isPrevious && !isNext ? 'translateZ(-100px)' : ''}
                  `,
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => isCurrent && onTopicClick(topic)}
              >
                <TopicCardProfile
                  topic={topic}
                  onClick={() => isCurrent && onTopicClick(topic)}
                />
              </div>
            );
          })}
        </div>

        {/* Pagination dots */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {topics?.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all
                ${index === activeIndex ? 'bg-white h-4' : 'bg-white/50'}
              `}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Bottom navigation button */}
      <div className="flex justify-center py-4 z-30">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-md"
          onClick={handleNext}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

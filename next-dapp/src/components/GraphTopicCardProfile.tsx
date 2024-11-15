import { Card, CardHeader } from '@/components/ui/card';
import {
  TopicCardProps,
  GraphTopicCardProps,
} from '@/components/types/discoverType';
import { Progress } from '@/components/ui/progress';
import { MoreVertical, BookOpen, Users, Coins } from 'lucide-react';
import Image from 'next/image';

export function TopicCardProfile({ topic, onClick }: GraphTopicCardProps) {
  // Calculate completion percentage
  if (!topic.modules) {
    return;
  }
  let completedModules = 0;
  topic.modules.map((module) => {
    const feedbacks = module?.feedbacks; // Safely access feedbacks

    if (feedbacks && feedbacks[0].currentPage === module.totalPages) {
      completedModules += 1;
    }
  });
  const totalModules = topic.modules.length;
  const progress = (completedModules / totalModules) * 100 || 0;

  return (
    <div className="p-3 transform transition-all duration-300 hover:scale-105 hover:z-10">
      <Card
        onClick={onClick}
        className="overflow-hidden w-full max-w-sm cursor-pointer"
      >
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={'/' + topic.topicIMG}
              alt={topic.title || 'empty'}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300"
            />
          </div>
        </CardHeader>

        <div className="p-4 bg-[#ffffff] text-black">
          <div className="space-y-4">
            {/* Top section with title and menu */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg mb-2">{topic.title}</h3>
                <p className="text-sm text-black/80 line-clamp-2">
                  {topic.description}
                </p>
              </div>
              <button
                className="text-black/80 hover:text-black p-1 rounded-full hover:bg-white/10 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add menu functionality here
                }}
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Progress section */}
            <div className="space-y-2">
              <Progress value={progress} className="h-2 bg-white/20" />
              <div className="flex justify-between text-sm">
                <span className="text-black/80">
                  {completedModules} of {totalModules} tasks
                </span>
                <span className="text-black/80">{progress.toFixed(0)}%</span>
              </div>
            </div>

            {/* Stats section */}
            <div className="flex items-center space-x-4 pt-2 text-sm text-black/80">
              <div className="flex items-center">
                <Coins className="w-4 h-4 mr-1" />
                <span>{100} ETH</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                <span>{totalModules} Modules</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{topic.learnerInvolved} Learners</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

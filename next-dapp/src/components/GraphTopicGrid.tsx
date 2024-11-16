import React from 'react';
import { TopicCard } from '@/components/GraphTopicCard';
import { GraphTopic } from '@/components/types/discoverType';

const TopicGrid = ({
  topics,
  onTopicClick,
}: {
  topics: GraphTopic[] | null;
  onTopicClick: (topic: GraphTopic) => void;
}) => {
  if (!topics) return;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {topics.map((topic) => (
        <div
          key={topic.id}
          className="transform transition-all duration-300 hover:scale-[1.02]"
        >
          <TopicCard topic={topic} onClick={() => onTopicClick(topic)} />
        </div>
      ))}
    </div>
  );
};

export default TopicGrid;

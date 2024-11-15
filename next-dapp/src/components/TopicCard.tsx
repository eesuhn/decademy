import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Users, Book } from 'lucide-react';
import Image from 'next/image';
import { TopicCardProps } from '@/components/types/discoverType';

export function TopicCard({ topic, onClick }: TopicCardProps) {
  return (
    <div className="p-3 transform transition-all duration-300 hover:scale-105 hover:z-10">
      <Card
        onClick={onClick}
        className="w-full max-w-sm cursor-pointer transition-shadow duration-300 hover:shadow-xl"
      >
        <CardHeader>
          <Image
            src={topic.topicImg}
            alt={topic.title}
            width={250}
            height={150}
            className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300"
          />
        </CardHeader>
        <CardContent>
          <CardTitle className="mb-2">{topic.title}</CardTitle>
          <p className="text-sm text-gray-600 mb-4">{topic.description}</p>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Coins className="w-4 h-4 mr-1 text-yellow-500" />
              <span className="text-sm font-medium">
                {topic.poolAmount} ETH
              </span>
            </div>
            <Badge variant="secondary" className="text-xs">
              <Book className="w-3 h-3 mr-1" />
              {topic.modules.length} Modules
            </Badge>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1 text-blue-500" />
            <span className="text-sm">{topic.learners} Learners</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

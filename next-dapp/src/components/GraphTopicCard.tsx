// components/TopicCard.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Users, Book } from 'lucide-react';
import Image from 'next/image';
import { ethers } from 'ethers';
import { GraphTopicCardProps } from '@/components/types/discoverType';
import { useGetTopicPoolAmount } from '@/hooks/useGetTopicPoolAmount';
import { usePicsumImage } from '@/hooks/usePicsumImage';

export function TopicCard({ topic, onClick }: GraphTopicCardProps) {
  const [ethAmount, setEthAmount] = useState('');
  const { getTopicPoolAmount } = useGetTopicPoolAmount();
  const { picsumImage, isImageLoading } = usePicsumImage();

  useEffect(() => {
    const gettingPoolAmount = async () => {
      if (!topic.id) return;
      const poolAmount = await getTopicPoolAmount(parseInt(topic.id, 16));
      setEthAmount(ethers.utils.formatEther(poolAmount));
    };

    gettingPoolAmount();
  }, [topic]);

  return (
    <Card onClick={onClick} className="w-full max-w-sm cursor-pointer">
      <CardHeader>
        {isImageLoading ? (
          <p className="text-center">Loading image...</p>
        ) : picsumImage ? (
          <img
            src={picsumImage}
            alt="Random Picsum Image"
            className="w-full max-h-50 max-w-50 object-cover rounded-lg"
            width={250}
            height={150}
          />
        ) : (
          <p className="text-center">No image available</p>
        )}
      </CardHeader>
      <CardContent>
        <CardTitle className="mb-2">{topic.title}</CardTitle>
        <p className="text-sm text-gray-600 mb-4">{topic.description}</p>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <Coins className="w-4 h-4 mr-1 text-yellow-500" />
            <span className="text-sm font-medium">{ethAmount} ETH</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            <Book className="w-3 h-3 mr-1" />
            {topic?.modules?.length} Modules
          </Badge>
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1 text-blue-500" />
          <span className="text-sm">
            {topic?.learnerInvolved?.length} Learners
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

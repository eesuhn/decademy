'use client';

import { useState, useEffect } from 'react';
import { GraphTopic, Topic } from '@/components/types/discoverType';
import TopicConveyor from '@/components/GraphTopicCarouselDiscover';
import { ModulesModal } from '@/components/GraphModulesModal';
import TopicGrid from '@/components/GraphTopicGrid';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';
import { useEmitAddUserToTopic } from '@/hooks/useEmitAddUserToTopic';

export default function DiscoverTopics() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<GraphTopic | null>(null);
  const { emitAddUserToTopic } = useEmitAddUserToTopic();
  const [fetchedData, setFetchedData] = useState<GraphTopic[] | null>(null);
  const { getPublicAddr, loading } = useWeb3Auth();
  const [userWalletAddress, setUserWalletAddress] = useState('');

  const openModal = async (topic: GraphTopic) => {
    setSelectedTopic(topic);
    // await stake(2);
    if (topic.id !== undefined) {
      const result = await emitAddUserToTopic(parseInt(topic.id, 16));
      if (result === true) {
        console.log('User added to topic');
        setModalOpen(true);
      } else {
        console.log('No modules available for this topic');
      }
    } else {
      console.log('Topic ID is undefined');
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTopic(null);
  };

  useEffect(() => {
    // this function does a fetch request to "the graph" local node to get the data
    const fetchData = async () => {
      try {
        let address = await getPublicAddr();
        address = address.toLowerCase();
        setUserWalletAddress(address);

        const response = await fetch(
          process.env.NEXT_PUBLIC_GRAPHQL_API as string,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `
              query GetDiscoveryData {
                topics(first: 20) {
                  id
                  learnerInvolved
                  description
                  title
                  topicIMG
                  modules(first: 20) {
                    id
                    description
                    title
                    moduleIMG
                    totalPages
                    educator {
                      user {
                        name
                      }
                    }
                    learnerInvolved {
                      id
                    }
                    feedbacks(where: {learner_: {id: "${address}"}}) {
                      currentPage
                    }
                  }
                }
              } 
            `,
            }),
          }
        );

        // gets the json then sets the data
        const data = await response.json();
        setFetchedData(data.data.topics);
        console.log(fetchedData);
      } catch (error) {
        console.error('Error: Could not fetch data:', error);
      }
    };
    fetchData();
  }, [loading]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Trending Section */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-8">Trending Topics</h1>
        <TopicConveyor
          topics={fetchedData}
          onTopicClick={openModal}
          isModalOpen={isModalOpen}
          userWalletAddr={userWalletAddress}
        />
      </div>

      {/* Discover Section */}
      <div>
        <h1 className="text-3xl font-bold mb-8">Discover Topics</h1>
        <TopicGrid topics={fetchedData} onTopicClick={openModal} />
      </div>

      <ModulesModal
        isOpen={isModalOpen}
        onClose={closeModal}
        topic={selectedTopic}
        userWalletAddress={userWalletAddress}
      />
    </div>
  );
}

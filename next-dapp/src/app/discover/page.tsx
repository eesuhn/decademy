'use client';

import { useState, useEffect } from 'react';
import { GraphTopic, Topic } from '@/components/types/discoverType';
import TopicConveyor from '@/components/GraphTopicCarouselDiscover';
import { ModulesModal } from '@/components/GraphModulesModal';
import TopicGrid from '@/components/GraphTopicGrid';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';
import { useEmitAddUserToTopic } from '@/hooks/useEmitAddUserToTopic';
import { useStake } from '@/hooks/useStake';
import { StakePromptModal } from '@/components/StakePromptModal';
import Navbar from '@/components/Navbar';

export default function DiscoverTopics() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<GraphTopic | null>(null);
  const { emitAddUserToTopic } = useEmitAddUserToTopic();
  const [fetchedData, setFetchedData] = useState<GraphTopic[] | null>(null);
  const { getPublicAddr, loading } = useWeb3Auth();
  const [userWalletAddress, setUserWalletAddress] = useState('');
  const [isStakeModalOpen, setStakeModalOpen] = useState(false);
  const [pendingTopic, setPendingTopic] = useState<GraphTopic | null>(null);
  const { stake } = useStake();

  const openStakeModal = (topic: GraphTopic) => {
    setPendingTopic(topic);
    setStakeModalOpen(true);
  };

  const handleStakeSuccess = async () => {
    if (!pendingTopic) return;

    try {
      // First attempt to stake
      if (pendingTopic.id !== undefined) {
        await stake(parseInt(pendingTopic.id, 16));
      }

      // If staking is successful, then emit add user to topic
      if (pendingTopic.id !== undefined) {
        const result = await emitAddUserToTopic(parseInt(pendingTopic.id, 16));
        if (result === true) {
          console.log('User added to topic successfully');
          setSelectedTopic(pendingTopic);
          setModalOpen(true);
        } else {
          console.log('Failed to add user to topic');
        }
      }
    } catch (error) {
      console.error('Error in staking process:', error);
    } finally {
      setStakeModalOpen(false);
      setPendingTopic(null);
    }
  };

  const closeStakeModal = () => {
    setStakeModalOpen(false);
    setPendingTopic(null);
  };

  const closeModulesModal = () => {
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

  const randomizePoolAmount = () => {
    return Math.random() * 0.1 + 0.01;
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Trending Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-8">Trending Topics</h1>
          <TopicConveyor
            topics={fetchedData}
            onTopicClick={openStakeModal}
            isModalOpen={isModalOpen}
            userWalletAddr={userWalletAddress}
          />
        </div>

        {/* Discover Section */}
        <div>
          <h1 className="text-3xl font-bold mb-8">Discover Topics</h1>
          <TopicGrid topics={fetchedData} onTopicClick={openStakeModal} />
        </div>

        {/* Stake Modal */}
        <StakePromptModal
          isOpen={isStakeModalOpen}
          onClose={closeStakeModal}
          moduleTitle={pendingTopic?.title || ''}
          stakeAmount={randomizePoolAmount()}
          onStakeSuccess={handleStakeSuccess}
        />

        <ModulesModal
          isOpen={isModalOpen}
          onClose={closeStakeModal}
          topic={selectedTopic}
          userWalletAddress={userWalletAddress}
        />
      </div>
    </>
  );
}

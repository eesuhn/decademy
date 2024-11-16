'use client';

import { ProfileHeader } from '@/components/ProfileHeader';
import { useState, useEffect } from 'react';
import { GraphTopic, GraphUser } from '@/components/types/discoverType';
import { ModulesModal } from '@/components/GraphModulesModal';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { TopicCarousel } from '@/components/GraphTopicCarouselProfile';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';
import Navbar from '@/components/Navbar';

// Define an array of background colors for cards
const cardColors = [
  'bg-[#663399]', // Purple
  'bg-[#5BC2C3]', // Teal
  'bg-[#FF7F50]', // Coral
];

// Assuming you have a type for user data
interface UserEducatorStatus {
  isEducator: boolean;
  walletAddress: string;
  name: string;
  // Add other user fields as needed
}

export default function Profile() {
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<GraphTopic | null>(null);
  const [userData, setUserData] = useState<GraphUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getPublicAddr, loading } = useWeb3Auth();
  const [userPublicAddress, setUserPublicAddress] = useState('');

  // Fetch user data including educator status
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // if (loading) return;
        let address = await getPublicAddr();
        address = address.toLowerCase();
        setUserPublicAddress(address);
        // Replace this with your actual API call
        const response = await fetch(
          process.env.NEXT_PUBLIC_GRAPHQL_API as string,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `
              query GetUserInfo {
                user(id: "${address}") {
                  id
                  name
                  socialLinks
                  isVerified
                  educatorData {
                    id
                  }
                  learnerData {
                    id
                    topicsJoined {
                      id
                      title
                      description
                      topicIMG
                      attested
                      learnerInvolved
                      modules(
                        where: {learnerInvolved_: {id: "${address}"}}
                      ) {
                        id
                        title
                        description
                        totalPages
                        moduleIMG
                        learnerInvolved {
                          id
                        }
                        feedbacks(where: {learner_: {id: "${address}"}}) {
                          currentPage
                        }
                        educator {
                          user {
                            name
                          }
                        }
                      }
                    }
                  }
                }
              } 
            `,
            }),
          }
        );
        const data = await response.json();
        setUserData(data.data.user);
        console.log(await getPublicAddr());
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [loading]);

  const handleEducatorButton = () => {
    if (userData?.educatorData !== null) {
      router.push('/profile/educator');
    } else {
      router.push('/profile/educator');
    }
  };

  const openModal = (topic: GraphTopic) => {
    setSelectedTopic(topic);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTopic(null);
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            {/* Add margin top to bring header down */}
            <div className="mt-8">
              <ProfileHeader
                walletAddress={userData?.id || ''}
                name={userData?.name || ''}
                socialLinks={[
                  { platform: 'twitter', url: 'https://twitter.com/john_doe' },
                  { platform: 'github', url: 'https://github.com/johndoe' },
                ]}
              />
            </div>

            {/* Dashboard Action */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Learner Dashboard
                </h2>
                <Button
                  variant="default"
                  onClick={handleEducatorButton}
                  className="transition-all duration-200 hover:scale-105 bg-gray-600 hover:bg-gray-700 rounded-full"
                >
                  {userData?.educatorData !== null
                    ? 'Go to Educator Profile'
                    : 'Become an Educator'}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Topics with custom scroll */}
          <div className="h-full">
            <div className="bg-white rounded-3xl shadow-sm h-[calc(100vh-4rem)]">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Topics Joined</h3>
                  {/* <Button variant="outline" size="sm" className="rounded-full">
                  Filter by
                </Button> */}
                </div>
              </div>

              {/* Scrollable content */}
              <div className="p-6">
                <TopicCarousel
                  topics={userData?.learnerData?.topicsJoined}
                  onTopicClick={openModal}
                />
              </div>
            </div>
          </div>
        </div>

        <ModulesModal
          isOpen={isModalOpen}
          onClose={closeModal}
          topic={selectedTopic}
          userWalletAddress={userPublicAddress}
        />
      </div>
    </>
  );
}

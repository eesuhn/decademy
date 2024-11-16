'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';
import { useSignMessage } from '@/hooks/useSignMessage';
import { useEmitAttestTopic } from '@/hooks/useEmitAttestTopic';
import { ethers } from 'ethers';
import { GraphTopic } from '@/components/types/discoverType';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';

const topics = [
  {
    id: 1,
    title: 'Web Development',
    description:
      'Learn the fundamentals of web development, including HTML, CSS, and JavaScript.',
    image: 'default-nouns.svg',
  },
  {
    id: 2,
    title: 'Data Science',
    description:
      'Explore data analysis, machine learning, and statistical modeling techniques.',
    image: 'default-nouns.svg',
  },
  {
    id: 3,
    title: 'Mobile App Development',
    description:
      'Build cross-platform mobile applications using React Native and Flutter.',
    image: 'default-nouns.svg',
  },
];

export default function Page() {
  const { toast } = useToast();
  const [hoveredCard, setHoveredCard] = useState(null);
  const { signMessage, SigningModal, isLoading } = useSignMessage();
  const { emitAttestTopic } = useEmitAttestTopic();
  const [topics, setTopics] = useState<GraphTopic[] | null>(null);
  const { getPublicAddr, loading } = useWeb3Auth();
  const [userWalletAddress, setUserWalletAddress] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      let address = await getPublicAddr();
      address = address.toLowerCase();
      setUserWalletAddress(address);
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `
              query GetDiscoverAttest {
                topics(where: {attested: false}) {
                  description
                  id
                  title
                  topicIMG
                }
              } 
            `,
            }),
          }
        );

        const data = await response.json();
        setTopics(data.data.topics);
        console.log(data);
      } catch (error) {
        console.error('Error: Failed to fetch topics from The Graph:', error);
      }
    };
    fetchData();
  }, [loading]);

  async function handleButtonClick(topic: {
    id?: any;
    title?: any;
    description?: string;
    image?: string;
  }) {
    try {
      // Pack the data for signing
      const abiCoder = new ethers.utils.AbiCoder();
      const packedData = abiCoder.encode(
        ['uint256', 'string'],
        [topic.id, topic.title]
      );

      try {
        // Request signature through the signing modal
        const signature = await signMessage(packedData);

        // If signature is obtained, proceed with attestation
        if (signature) {
          await emitAttestTopic(topic.id);

          toast({
            title: 'Attestation successful',
            description: `${topic.title} has been attested.`,
          });
        }
      } catch (error) {
        // Handle signature rejection or error
        console.log('Signing cancelled or failed:', error);
      }
    } catch (error) {
      console.error('Attestation failed:', error);
      toast({
        title: 'Attestation failed',
        description: 'There was an error during the attestation process.',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4">
      <h1 className="text-5xl font-extrabold mb-12 text-gray-900 text-center">
        Attest Topics
      </h1>
      <div className="grid gap-8 md:grid-cols-3">
        {topics &&
          topics.map((topic) => (
            <Card
              key={topic.id}
              className="h-full flex flex-col p-6 bg-white bg-opacity-90 text-gray-800 rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="flex items-center mb-4">
                <div className="relative w-20 h-20">
                  <Image
                    src={
                      topic.topicIMG
                        ? '/' + topic.topicIMG
                        : '/' + topic.topicIMG
                    }
                    alt={topic.title || 'empty'}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <CardHeader className="p-0">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {topic.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 mt-2">
                    <p className="text-gray-600">{topic.description}</p>
                  </CardContent>
                </div>
              </div>
              <CardFooter className="p-0 mt-auto">
                <Button
                  size="lg"
                  onClick={() => handleButtonClick(topic)}
                  disabled={isLoading}
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 rounded-xl
                transition-all duration-300 transform hover:shadow-xl hover:from-green-600 hover:to-emerald-700"
                >
                  {isLoading ? 'Processing...' : 'Attest'}
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>

      {/* Include the SigningModal component */}
      <SigningModal />
    </div>
  );
}

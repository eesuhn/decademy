'use client';

import { TopicCarousel } from '@/components/TopicCarousel';
import { GrayButtonHover } from '@/components/ui/GrayButtonHover';
import { GreenButtonHover } from '@/components/ui/GreenButtonHover';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

function Section1() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 md:py-32 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div>
              <h2
                className="text-2xl md:text-3xl font-bold mb-4"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Stand a chance to
              </h2>
              <h1
                className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Learn For Free!
              </h1>
            </div>
            <p className="text-gray-600 text-lg md:text-xl max-w-xl leading-relaxed">
              Join our community of learners using our platform to master new
              skills. Everything you need to grow, all in one place.
            </p>
            <div className="flex gap-4">
              <GreenButtonHover> Sign Up </GreenButtonHover>
              <GrayButtonHover> Learn More </GrayButtonHover>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative mt-12 md:mt-0">
            <div className="relative w-full h-[400px]">
              <Image
                src="/learn-for-free.jpg"
                alt="Feature illustration"
                layout="fill"
                objectFit="contain"
                className="animate-float"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section2() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 md:py-32 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative mt-12 md:mt-0">
            <div className="relative w-full h-[400px]">
              <Image
                src="/community.jpg"
                alt="Community illustration"
                layout="fill"
                objectFit="contain"
                className="animate-float"
              />
            </div>
          </div>
          <div className="space-y-8">
            <h2
              className="text-5xl md:text-6xl font-black leading-tight tracking-tight"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Community Voted Topics
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-xl leading-relaxed">
              Our curriculum is shaped by the community. Vote on what you want
              to learn next and help others grow together.
            </p>
            <GreenButtonHover> Make your own course! </GreenButtonHover>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section3() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 md:py-32 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2
              className="text-5xl md:text-6xl font-black leading-tight tracking-tight"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Teach, Earn, and Inspire.
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-xl leading-relaxed">
              Become an educator on our vibrant platform! Create engaging
              modules on trending topics, share your passion for teaching, and
              get paid for your expertise.
            </p>
            <GreenButtonHover>Learn More</GreenButtonHover>
          </div>
          <div className="relative mt-12 md:mt-0">
            <div className="relative w-full h-[400px]">
              <Image
                src="/teach.jpg"
                alt="teach"
                layout="fill"
                objectFit="contain"
                className="animate-float"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section4() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 md:py-32 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative mt-12 md:mt-0 order-2 md:order-1">
            <div className="relative w-full h-[400px]">
              <Image
                src="/decentralized.jpg"
                alt="Decentralized illustration"
                layout="fill"
                objectFit="contain"
                className="animate-float"
              />
            </div>
          </div>

          <div className="space-y-8 order-1 md:order-2">
            <h2
              className="text-5xl md:text-6xl font-black leading-tight tracking-tight"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Fully Decentralized.
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-xl leading-relaxed">
              Own your learning journey. Our platform is built on blockchain
              technology, ensuring your achievements are truly yours.
            </p>
            <GreenButtonHover>Learn More</GreenButtonHover>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add floating animation
const styles = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
`;

export default function LandingPage() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Optional: Remove confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {/* Confetti Overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            colors={['#80fd82', '#5ad15c', '#1a2b3c', '#ffffff']} // Optional: matching your green button colors
          />
        </div>
      )}

      <style>{styles}</style>
      <Section1 />
      <TopicCarousel />
      <Section2 />
      <Section3 />
      <Section4 />
    </>
  );
}

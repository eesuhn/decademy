import React, { useState, useRef, useEffect } from 'react';
import { TopicCard } from '@/components/GraphTopicCard';
import { GraphTopic } from '@/components/types/discoverType';

const TopicConveyor = ({
  topics,
  onTopicClick,
  isModalOpen, // Add this prop
  userWalletAddr,
}: {
  topics: GraphTopic[] | null;
  onTopicClick: (topic: GraphTopic) => void;
  isModalOpen: boolean; // Add this type
  userWalletAddr: string;
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [dragVelocity, setDragVelocity] = useState(0);
  const lastDragX = useRef(0);
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Triple the topics to ensure smooth looping in both directions

  useEffect(() => {
    if (isPaused) return;

    // Apply momentum after dragging
    if (Math.abs(dragVelocity) > 0) {
      const decay = 0.95;
      let velocity = dragVelocity;

      const animate = () => {
        velocity *= decay;
        setCurrentOffset((prev) => {
          const newOffset = prev + velocity;
          // Reset position when reaching boundaries
          const maxOffset = containerRef.current?.offsetWidth || 0;
          if (Math.abs(newOffset) > maxOffset) {
            return newOffset % maxOffset;
          }
          return newOffset;
        });

        if (Math.abs(velocity) > 0.1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setDragVelocity(0);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, dragVelocity]);
  if (!topics) return;
  const extendedTopics = [...topics, ...topics, ...topics];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPaused(true);
    setDragStartX(e.clientX - currentOffset);
    lastDragX.current = e.clientX;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPaused) return;

    const newOffset = e.clientX - dragStartX;
    setCurrentOffset(newOffset);

    // Calculate drag velocity
    const deltaX = e.clientX - lastDragX.current;
    lastDragX.current = e.clientX;
    setDragVelocity(deltaX);
  };

  const handleMouseUp = () => {
    setIsPaused(false);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden px-4 py-8"
    >
      <div
        className="flex relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: isPaused ? 'grabbing' : 'grab',
        }}
      >
        <div
          className="flex gap-6 animate-conveyor"
          style={{
            animationPlayState: isPaused || isModalOpen ? 'paused' : 'running',
            transform: `translateX(${currentOffset}px)`,
            transition: isPaused ? 'none' : 'transform 0.5s ease-out',
          }}
        >
          {extendedTopics.map((topic, index) => (
            <div
              key={`${topic.id}-${index}`}
              className="flex-shrink-0 w-[400px]"
            >
              <TopicCard topic={topic} onClick={() => onTopicClick(topic)} />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes conveyor {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }

        .animate-conveyor {
          animation: conveyor 30s linear infinite;
          will-change: transform;
        }

        .animate-conveyor:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default TopicConveyor;

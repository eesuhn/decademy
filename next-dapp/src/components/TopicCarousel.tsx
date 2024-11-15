'use client';

import { useEffect, useState, useCallback } from 'react';
import { Topic } from '@/components/types/discoverType';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { TopicCard } from '@/components/TopicCard';

const topics: Topic[] = [
  {
    id: 1,
    title: 'Introduction to Blockchain',
    description:
      'Learn the fundamentals of blockchain technology and its applications.',
    topicIMG: 'default-nouns.svg',
    poolAmount: 0.5,
    modules: Array(12).fill(null),
    learners: 1200,
  },
  {
    id: 2,
    title: 'AI',
    description:
      'Learn the fundamentals of blockchain technology and its applications.',
    topicIMG: 'default-nouns.svg',
    poolAmount: 0.5,
    modules: Array(12).fill(null),
    learners: 1200,
  },
  {
    id: 3,
    title: 'Smart Contract',
    description:
      'Learn the fundamentals of blockchain technology and its applications.',
    topicIMG: 'default-nouns.svg',
    poolAmount: 0.5,
    modules: Array(12).fill(null),
    learners: 1200,
  },
  {
    id: 4,
    title: 'Zero Knowledge Proof',
    description:
      'Learn the fundamentals of blockchain technology and its applications.',
    topicIMG: 'default-nouns.svg',
    poolAmount: 0.5,
    modules: Array(12).fill(null),
    learners: 1200,
  },
];

export function TopicCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const onSelect = useCallback(() => {
    if (emblaApi) emblaApi.scrollTo(0);
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', onSelect);
      emblaApi.on('reInit', onSelect);
    }
  }, [emblaApi, onSelect]);

  return (
    <div className="container mx-auto w-full py-10 px-4 md:px-6">
      <h1
        className="text-center text-5xl md:text-5xl font-black leading-tight tracking-tight mb-10"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        Trending Topics
      </h1>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full relative"
        ref={emblaRef}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {topics.map((topic, index) => (
            <CarouselItem
              key={topic.id}
              className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <TopicCard topic={topic} onClick={() => {}} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
}

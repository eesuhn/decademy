'use client';
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RatingModal } from '@/components/RatingModal';
import { useEffect, useState } from 'react';
import { useEmitUpdateLearnerProgress } from '@/hooks/useEmitUpdateLearnerProgress';
import { useRouter } from 'next/navigation'; // Changed from next/router to next/navigation

interface ModuleCompletionCardProps {
  moduleId: number;
  pageAmount: number;
}

export function ModuleCompletionCard({
  moduleId,
  pageAmount,
}: ModuleCompletionCardProps) {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const { emitUpdateLearnerProgress, loading } = useEmitUpdateLearnerProgress();
  const router = useRouter();

  useEffect(() => {
    setIsRatingModalOpen(true);
  }, []);

  const handleCloseRatingModal = () => {
    setIsRatingModalOpen(false);
  };

  const handleRatingSubmit = async (rating: number) => {
    try {
      await emitUpdateLearnerProgress(moduleId, pageAmount, rating);

      console.log(`Successfully submitted rating: ${rating}`);
      setTimeout(() => {
        router.push('/discover');
      }, 2000);
      console.log(`Successfully submitted rating: ${rating}`);
      setTimeout(() => {
        router.push('/discover');
      }, 2000);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <>
      <Card className="max-w-2xl mx-auto backdrop-blur-sm bg-white/80 shadow-md border-gray-150">
        <CardHeader>
          <CardTitle className="text-center">
            <div className="flex justify-center mb-4">
              <Sparkles className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Congratulations!
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            You've mastered this module and successfully completed the
            assessment.
          </p>
        </CardContent>
      </Card>

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={handleCloseRatingModal}
        onSubmit={handleRatingSubmit}
      />
    </>
  );
}

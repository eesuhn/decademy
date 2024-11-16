'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Star, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmitUpdateLearnerProgress } from '@/hooks/useEmitUpdateLearnerProgress';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (rating: number) => void;
}

export function RatingModal({ isOpen, onClose, onSubmit }: RatingModalProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { emitUpdateLearnerProgress } = useEmitUpdateLearnerProgress();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating !== null) {
      if (onSubmit) {
        await onSubmit(rating);
      }
      setSubmitted(true);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setRating(null);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-gray-800 border-gray-200 sm:max-w-[425px]">
        {!submitted ? (
          <>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <Star className="w-5 h-5 text-emerald-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl text-gray-900">
                How did we do?
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Please let us know how we did with your support request. All
                feedback is appreciated to help us improve our offering!
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-between my-6">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                    rating === value
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800'
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={rating === null}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              SUBMIT
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center text-center py-4">
            <div className="relative mb-6">
              <Smartphone className="w-16 h-16 text-emerald-600 mb-2" />
              <div className="w-4 h-4 bg-emerald-600 rounded-full absolute -right-2 top-0 animate-bounce" />
            </div>
            <div className="bg-emerald-50 text-emerald-700 rounded-full px-4 py-1 mb-4">
              You selected {rating} out of 5
            </div>
            <DialogTitle className="text-2xl text-gray-900 mb-4">
              Thank you!
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              We appreciate you taking the time to give a rating. Redirecting
              you to discover more content...
            </DialogDescription>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

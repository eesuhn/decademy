import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Star, Smartphone } from 'lucide-react';

interface StakePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleTitle: string;
  stakeAmount: number;
  onStakeSuccess: () => void;
}

export function StakePromptModal({
  isOpen,
  onClose,
  moduleTitle,
  stakeAmount,
  onStakeSuccess,
}: StakePromptModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isStaking, setIsStaking] = useState(false);

  const handleStake = async () => {
    setIsStaking(true);
    try {
      // Simulate staking process
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      // Wait for animation to complete before calling success handler
      setTimeout(() => {
        onStakeSuccess();
      }, 1500);
    } catch (error) {
      console.error('Staking error:', error);
    } finally {
      setIsStaking(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1E252E] text-white border-gray-800 sm:max-w-[425px]">
        {!submitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-white">
                {moduleTitle}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Please stake {stakeAmount} ETH to access the module content.
              </DialogDescription>
            </DialogHeader>
            <Button
              onClick={handleStake}
              disabled={isStaking}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-6"
            >
              {isStaking ? 'STAKING...' : 'STAKE'}
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center text-center py-4">
            <div className="relative mb-6">
              <Smartphone className="w-16 h-16 text-orange-500 mb-2" />
              <div className="w-4 h-4 bg-orange-500 rounded-full absolute -right-2 top-0 animate-bounce" />
            </div>
            <DialogTitle className="text-2xl text-white mb-4">
              Thank you!
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Staking is complete. We appreciate your participation!
            </DialogDescription>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

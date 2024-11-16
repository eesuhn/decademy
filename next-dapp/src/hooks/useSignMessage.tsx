'use client';

import { useState, useCallback } from 'react';
import { keccak256, arrayify } from 'ethers/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useWeb3Auth } from './useWeb3Auth';
import { GreenButtonHover } from '@/components/ui/GreenButtonHover';
import { GrayButtonHover } from '@/components/ui/GrayButtonHover';
import { GrStatusGood } from 'react-icons/gr';

const formatHexString = (hex: string) => {
  // If it's not a hex string, return as is
  if (!hex.startsWith('0x')) return hex;

  // Split the hex string into chunks of 8 characters
  const chunks = hex.match(/.{1,8}/g) || [];
  return chunks.join(' ');
};

export function useSignMessage() {
  const { getSigner, loading } = useWeb3Auth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [packedData, setPackedData] = useState('');
  const [resolveSign, setResolveSign] = useState<
    ((value: string | PromiseLike<string>) => void) | null
  >(null);
  const [rejectSign, setRejectSign] = useState<((reason?: any) => void) | null>(
    null
  );

  const signMessage = useCallback((data: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      setIsModalOpen(true);
      setPackedData(data);
      setResolveSign(() => resolve);
      setRejectSign(() => reject);
    });
  }, []);

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      const signer = await getSigner();
      const messageHash = keccak256(packedData);
      const messageBytes = arrayify(messageHash);
      const signature = await signer.signMessage(messageBytes);
      resolveSign?.(signature);
    } catch (error) {
      console.error('Error signing message:', error);
      rejectSign?.(error);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const SigningModal = () => (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="p-0 bg-white text-black border-0 w-[400px]">
        <div className="flex flex-col">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Signature request</h2>
              <p className="ml-1 text-sm text-gray-600">
                Review request details before you confirm.
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Request from</span>
                <div className="flex items-center gap-2 ml-2">
                  <GrStatusGood className="w-4 h-4 text-green-600" />
                  <span>localhost:3000</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-3 space-y-2">
              <span className="text-gray-600">Message</span>
              <div className="break-words font-mono text-sm leading-relaxed tracking-wider overflow-x-hidden">
                {formatHexString(packedData)}
              </div>
            </div>
          </div>

          <div className="flex justify-end p-4 border-t border-gray-200">
            <div className="flex gap-4 w-full sm:w-auto">
              <GreenButtonHover
                onClick={handleConfirm}
                disabled={loading || isLoading}
              >
                {loading || isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing...
                  </>
                ) : (
                  'Sign'
                )}
              </GreenButtonHover>
              <GrayButtonHover variant="outline" onClick={handleCancel}>
                Cancel
              </GrayButtonHover>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return { signMessage, SigningModal, isLoading: loading || isLoading };
}

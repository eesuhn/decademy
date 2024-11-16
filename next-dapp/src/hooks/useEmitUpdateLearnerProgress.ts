import { useState } from 'react';
import { ethers } from 'ethers';
import { keccak256, arrayify } from 'ethers/lib/utils';
import { useWeb3Auth } from './useWeb3Auth';
import config from '@/config/sc';

type EmitUpdateLearnerProgressHookReturn = {
  emitUpdateLearnerProgress: (
    moduleId: number,
    pageAmount: number,
    rating: number
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
};

export const useEmitUpdateLearnerProgress =
  (): EmitUpdateLearnerProgressHookReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { getSigner } = useWeb3Auth();

    const emitUpdateLearnerProgress = async (
      moduleId: number,
      pageAmount: number,
      rating: number
    ) => {
      setLoading(true);
      setError(null);

      try {
        const signer = await getSigner();
        const userAddress = await signer.getAddress();

        // Create Web3Provider instance
        const web3Provider = new ethers.providers.Web3Provider(
          (window as any).ethereum,
          {
            name: 'Scroll Sepolia',
            chainId: 534351,
          }
        );

        // Initialize the relayer contract
        const privateKey = process.env
          .NEXT_PUBLIC_RELAYER_HOLDER_PRIVATE_KEY as string;
        const relayerSigner = new ethers.Wallet(privateKey, web3Provider);
        const relayerContract = new ethers.Contract(
          config.RELAYER_CONTRACT_ADDRESS,
          config.RELAYER_ABI,
          relayerSigner
        );

        // Get nonce for the user
        const nonce = await relayerContract.getNonce(userAddress);

        // Encode the parameters (walletAddr, moduleId, pageAmount, rating)
        const encodedParams = ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'uint256', 'uint256'],
          [userAddress, moduleId, pageAmount, rating]
        );

        // Prepare the message hash
        const messageHash = ethers.utils.solidityKeccak256(
          ['address', 'bytes', 'uint256'],
          [userAddress, encodedParams, nonce]
        );
        //   const ethSignedMessageHash = keccak256(
        //     ethers.utils.concat(['\x19Ethereum Signed Message:\n32', messageHash])
        //   );

        // Sign the message hash
        const signature = await signer.signMessage(
          ethers.utils.arrayify(messageHash)
        );

        // Send the meta-transaction to the relayer contract
        if (signature) {
          const tx = await relayerContract.metaTxEmitUpdateLearnerProgress(
            userAddress,
            userAddress,
            moduleId,
            pageAmount,
            rating,
            signature
          );
          await tx.wait();
        }
      } catch (error: any) {
        console.error('Error emitting update learner progress:', error);
        setError(error.message || 'Error emitting update learner progress');
      } finally {
        setLoading(false);
      }
    };

    return { emitUpdateLearnerProgress, loading, error };
  };

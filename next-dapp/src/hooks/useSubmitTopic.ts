import { useState } from 'react';
import { ethers } from 'ethers';
import { pack } from '@ethersproject/solidity';
import { keccak256, arrayify } from 'ethers/lib/utils';
import { useWeb3Auth } from './useWeb3Auth';
import config from '@/config/sc';

type SubmitTopicHookReturn = {
  submitTopic: (
    topic: string,
    description: string,
    topicIMG: string
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
};

export const useSubmitTopic = (): SubmitTopicHookReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getSigner } = useWeb3Auth();

  const submitTopic = async (
    topic: string,
    description: string,
    topicIMG: string
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
      const privateKey = process.env.NEXT_PUBLIC_RELAYER_PRIVATE_KEY as string;
      const relayerSigner = new ethers.Wallet(privateKey, web3Provider);
      const relayerContract = new ethers.Contract(
        config.RELAYER_CONTRACT_ADDRESS,
        config.RELAYER_ABI,
        relayerSigner
      );

      const nonce = await relayerContract.getNonce(userAddress);

      // Prepare the packed data for signing
      const packedData = pack(
        ['address', 'string', 'string', 'string', 'uint256'],
        [userAddress, topic, description, topicIMG, nonce]
      );
      const messageHash = keccak256(packedData);
      const messageBytes = arrayify(messageHash);
      const signature = await signer.signMessage(messageBytes);

      if (signature) {
        const tx = await relayerContract.metaTxSubmitTopic(
          userAddress,
          topic,
          description,
          topicIMG,
          signature
        );
        await tx.wait();
      }
    } catch (error: any) {
      console.error('Error submitting topic:', error);
      setError(error.message || 'Error submitting topic');
    } finally {
      setLoading(false);
    }
  };

  return { submitTopic, loading, error };
};

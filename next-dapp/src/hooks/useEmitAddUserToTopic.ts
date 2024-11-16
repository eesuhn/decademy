import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3Auth } from './useWeb3Auth';
import config from '@/config/sc';

type EmitAddUserToTopicHookReturn = {
  emitAddUserToTopic: (topicId: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
};

export const useEmitAddUserToTopic = (): EmitAddUserToTopicHookReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getSigner } = useWeb3Auth();

  const emitAddUserToTopic = async (topicId: number): Promise<boolean> => {
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
        .NEXT_PUBLIC_RELAYER_HOLDER_PRIVATE_KEY as string; // Replace with actual private key or use secure method
      const relayerSigner = new ethers.Wallet(privateKey, web3Provider);
      const relayerContract = new ethers.Contract(
        config.RELAYER_CONTRACT_ADDRESS,
        config.RELAYER_ABI,
        relayerSigner
      );

      // Get nonce for the user
      const nonce = await relayerContract.getNonce(userAddress);

      // Encode parameters as per the contract's expected format
      const encodedParams = ethers.utils.defaultAbiCoder.encode(
        ['address', 'uint256'],
        [userAddress, topicId]
      );

      // Generate the message hash matching the contract's pattern
      const messageHash = ethers.utils.solidityKeccak256(
        ['address', 'bytes', 'uint256'],
        [userAddress, encodedParams, nonce]
      );

      // Create the Ethereum signed message hash
      const ethSignedMessageHash = ethers.utils.hashMessage(
        ethers.utils.arrayify(messageHash)
      );

      // Sign the message hash
      const signature = await signer.signMessage(
        ethers.utils.arrayify(messageHash)
      );

      // Send the meta-transaction to the relayer contract
      if (signature) {
        const tx = await relayerContract.metaTxEmitAddUserToTopic(
          userAddress, // user
          userAddress, // walletAddr
          topicId, // topicId
          signature // signature
        );

        // Wait for the transaction to be mined
        await tx.wait();

        // Return true if transaction is successful
        return true;
      }

      return false; // If no signature, return false
    } catch (error: any) {
      console.error('Error emitting add user to module:', error);
      setError(error.message || 'Error emitting add user to module');
      return false; // Return false on error
    } finally {
      setLoading(false);
    }
  };

  return { emitAddUserToTopic, loading, error };
};

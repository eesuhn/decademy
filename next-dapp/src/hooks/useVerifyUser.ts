import { useState } from 'react';
import { ethers } from 'ethers';
import { pack } from '@ethersproject/solidity';
import { keccak256, arrayify, defaultAbiCoder as abi } from 'ethers/lib/utils';
import { useWeb3Auth } from './useWeb3Auth';
import config from '@/config/sc';

type VerifyUserHookReturn = {
  verifyUser: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

export const useVerifyUser = (): VerifyUserHookReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getSigner } = useWeb3Auth();

  const verifyUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const web3Provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        {
          name: 'Scroll Sepolia',
          chainId: 534351,
        }
      );

      const signer = await getSigner();
      const userAddress = await signer.getAddress();

      const privateKey = process.env.NEXT_PUBLIC_WORLD_PRIVATE as string;
      const relayerSigner = new ethers.Wallet(privateKey, web3Provider);
      const relayerContract = new ethers.Contract(
        config.RELAYER_CONTRACT_ADDRESS,
        config.RELAYER_ABI,
        relayerSigner
      );

      const nonce = await relayerContract.getNonce(userAddress);
      const packedData = pack(['address', 'uint256'], [userAddress, nonce]);

      const messageHash = keccak256(packedData);
      const messageBytes = arrayify(messageHash);
      const signature = await signer.signMessage(messageBytes);

      console.log('sig', signature);

      const tx = await relayerContract.metaTxVerifyCurrentUser(
        userAddress,
        signature
      );
      await tx.wait();

      console.log('Transaction successful');
    } catch (error: any) {
      console.error('Error verifying user:', error);
      setError(error.message || 'Error verifying user');
    } finally {
      setLoading(false);
    }
  };

  return { verifyUser, loading, error };
};

import { useState } from 'react';
import { ethers } from 'ethers';
import contractAbi from '../../../artifacts/contracts/GraphTest.sol/GraphTest.json'; // TODO: Update to env

type GetTopicPoolAmountResponse = {
  getTopicPoolAmount: (id: number) => Promise<number>;
  loading: boolean;
  error: string | null;
};

export const useGetTopicPoolAmount = (): GetTopicPoolAmountResponse => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contractAddress = '';

  const getTopicPoolAmount = async (topicId: number) => {
    setLoading(true);
    setError(null);

    try {
      const web3Provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        {
          name: 'Scroll Sepolia',
          chainId: 31337,
        }
      );

      const contractAbi = process.env.NEXT_PUBLIC_CONTRACT_ABI;
      const privateKey =
        process.env.NEXT_PUBLIC_RELAYER_HOLDER_PRIVATE_KEY as string;
      const signer = new ethers.Wallet(privateKey, web3Provider);
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi.abi,
        signer
      );

      const tx = await contract.getTopicStakedPool(topicId);

      setLoading(false);
      return tx;
    } catch (error: any) {
      console.error('Error getting pool amount from smart contract:', error);
      setError(
        error.message || 'Error getting pool amount from smart contract'
      );
      setLoading(false);
    }
  };
  return { getTopicPoolAmount, loading, error };
};

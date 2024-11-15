import { useState, useEffect } from 'react';

/**
 * Fetches a Noun image for the given wallet address.
 *
 * @param walletAddress
 * @returns
 */
async function fetchNounImage(walletAddress: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.cloudnouns.com/v1/pfp?text=${walletAddress}`
    );
    const svgData = await response.text();
    return svgData;
  } catch (error) {
    console.error('Failed to fetch Noun image:', error);
    return null;
  }
}

/**
 * Custom hook to fetch a Noun image for a given wallet address.
 *
 * @param walletAddress
 * @returns
 */
export function useNounImage(walletAddress: string) {
  const [nounImage, setNounImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      if (!walletAddress) {
        setNounImage(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const svgData = await fetchNounImage(walletAddress);
        setNounImage(svgData);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to load Noun image')
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [walletAddress]);

  return { nounImage, isLoading, error };
}

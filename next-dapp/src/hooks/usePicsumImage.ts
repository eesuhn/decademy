import { useState, useEffect } from 'react';

// Function to fetch the redirected image URL from picsum.photos
async function fetchPicsumImage(): Promise<string | null> {
  try {
    const response = await fetch(`https://picsum.photos/1000`);

    // Return the URL of the final redirected image
    return response.url;
  } catch (error) {
    console.error('Failed to fetch Noun image:', error);
    return null;
  }
}

/**
 * Custom hook to fetch a Noun image URL for a given wallet address.
 *
 * @param walletAddress
 * @returns
 */
export function usePicsumImage() {
  const [picsumImage, setPicsumImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setIsImageLoading(true);
        setError(null);

        // Fetch the image URL
        const imageUrl = await fetchPicsumImage();
        setPicsumImage(imageUrl);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to load Noun image')
        );
      } finally {
        setIsImageLoading(false);
      }
    };

    loadImage();
  }, []);

  return { picsumImage, isImageLoading, error };
}

import { useEffect, useState } from 'react';
import { pipeline } from '@huggingface/transformers';

export const useDetector = () => {
  const [detector, setDetector] = useState<any>(null);

  useEffect(() => {
    const initializeDetector = async () => {
      try {
        const detect = await pipeline('object-detection', 'Xenova/detr-resnet-50', {
          revision: 'main'
        });
        setDetector(() => async (image: string) => {
          return await detect(image);
        });
      } catch (error) {
        console.error('Failed to initialize detector:', error);
      }
    };
    initializeDetector();
  }, []);

  return detector;
};
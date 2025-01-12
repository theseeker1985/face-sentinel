import { useEffect, useState } from 'react';
import { pipeline } from '@huggingface/transformers';

type DetectorFunction = (image: string) => Promise<Array<{
  label: string;
  score: number;
  box: { xmin: number; ymin: number; xmax: number; ymax: number };
}>>;

export const useDetector = () => {
  const [detector, setDetector] = useState<DetectorFunction | null>(null);

  useEffect(() => {
    const initializeDetector = async () => {
      try {
        const detect = await pipeline('object-detection', 'Xenova/detr-resnet-50', {
          revision: 'main'
        });
        
        setDetector(() => async (image: string) => {
          const results = await detect(image);
          return results.map(result => ({
            label: result.label,
            score: result.score,
            box: {
              xmin: result.box.xmin,
              ymin: result.box.ymin,
              xmax: result.box.xmax,
              ymax: result.box.ymax
            }
          }));
        });
      } catch (error) {
        console.error('Failed to initialize detector:', error);
      }
    };

    initializeDetector();
  }, []);

  return detector;
};
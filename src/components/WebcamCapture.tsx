import React, { useRef, useEffect, useState } from 'react';
import { VideoDisplay } from './webcam/VideoDisplay';
import { Controls } from './webcam/Controls';
import { useDetector } from './webcam/useDetector';

export const WebcamCapture = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const detector = useDetector();

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const stopStream = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const captureFrame = async () => {
    if (videoRef.current && canvasRef.current && detector) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        try {
          const blob = await new Promise<Blob>((resolve) => 
            canvasRef.current!.toBlob((blob) => resolve(blob!), 'image/jpeg')
          );
          
          const imageUrl = URL.createObjectURL(blob);
          const results = await detector(imageUrl);
          URL.revokeObjectURL(imageUrl);
          
          results.forEach((detection: any) => {
            if (detection.label === 'person') {
              const [x, y, width, height] = detection.box;
              context.strokeStyle = '#3498db';
              context.lineWidth = 2;
              context.strokeRect(x, y, width, height);
            }
          });
        } catch (error) {
          console.error('Detection error:', error);
        }
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStreaming) {
      interval = setInterval(captureFrame, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStreaming, detector]);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <VideoDisplay
        isStreaming={isStreaming}
        videoRef={videoRef}
        canvasRef={canvasRef}
        onStartStream={startStream}
      />
      <Controls
        isStreaming={isStreaming}
        onStartStream={startStream}
        onStopStream={stopStream}
      />
    </div>
  );
};
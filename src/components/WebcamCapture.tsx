import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Pause, Play } from 'lucide-react';
import { pipeline } from '@huggingface/transformers';

export const WebcamCapture = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [detector, setDetector] = useState<any>(null);

  useEffect(() => {
    const initializeDetector = async () => {
      try {
        const detect = await pipeline('object-detection', 'Xenova/detr-resnet-50', {
          revision: 'main'
        });
        setDetector(detect);
      } catch (error) {
        console.error('Failed to initialize detector:', error);
      }
    };
    initializeDetector();
  }, []);

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
        // Set canvas dimensions to match video
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        
        // Draw current video frame
        context.drawImage(videoRef.current, 0, 0);
        
        try {
          // Get canvas data as base64 URL
          const imageData = canvasRef.current.toDataURL('image/jpeg');
          
          // Perform detection using the base64 image data
          const results = await detector(imageData);
          
          // Draw boxes around detected faces
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
      interval = setInterval(captureFrame, 100); // Capture every 100ms
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStreaming, detector]);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-monitor-accent">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center bg-monitor-background/80">
            <Button onClick={startStream} size="lg" className="gap-2">
              <Camera className="w-5 h-5" />
              Start Camera
            </Button>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-center gap-4">
        {isStreaming ? (
          <Button onClick={stopStream} variant="destructive" size="lg" className="gap-2">
            <Pause className="w-5 h-5" />
            Stop Camera
          </Button>
        ) : (
          <Button onClick={startStream} size="lg" className="gap-2">
            <Play className="w-5 h-5" />
            Start Camera
          </Button>
        )}
      </div>
    </div>
  );
};

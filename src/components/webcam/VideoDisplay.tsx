import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface VideoDisplayProps {
  isStreaming: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onStartStream: () => void;
}

export const VideoDisplay = ({ isStreaming, videoRef, canvasRef, onStartStream }: VideoDisplayProps) => {
  return (
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
          <Button onClick={onStartStream} size="lg" className="gap-2">
            <Camera className="w-5 h-5" />
            Start Camera
          </Button>
        </div>
      )}
    </div>
  );
};
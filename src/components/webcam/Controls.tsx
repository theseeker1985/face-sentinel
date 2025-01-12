import React from 'react';
import { Button } from '@/components/ui/button';
import { Pause, Play } from 'lucide-react';

interface ControlsProps {
  isStreaming: boolean;
  onStartStream: () => void;
  onStopStream: () => void;
}

export const Controls = ({ isStreaming, onStartStream, onStopStream }: ControlsProps) => {
  return (
    <div className="mt-4 flex justify-center gap-4">
      {isStreaming ? (
        <Button onClick={onStopStream} variant="destructive" size="lg" className="gap-2">
          <Pause className="w-5 h-5" />
          Stop Camera
        </Button>
      ) : (
        <Button onClick={onStartStream} size="lg" className="gap-2">
          <Play className="w-5 h-5" />
          Start Camera
        </Button>
      )}
    </div>
  );
};
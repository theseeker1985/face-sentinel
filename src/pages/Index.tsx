import React from 'react';
import { WebcamCapture } from '@/components/WebcamCapture';
import { FaceGallery } from '@/components/FaceGallery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  return (
    <div className="min-h-screen bg-monitor-background text-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Face Recognition System</h1>
        
        <Tabs defaultValue="camera" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="camera">Live Camera</TabsTrigger>
            <TabsTrigger value="gallery">Face Gallery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="camera" className="mt-4">
            <WebcamCapture />
          </TabsContent>
          
          <TabsContent value="gallery">
            <FaceGallery />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
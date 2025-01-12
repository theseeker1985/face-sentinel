import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Temporary mock data until we connect to Supabase
const mockFaces = [
  {
    id: 1,
    timestamp: new Date().toISOString(),
    imageUrl: '/placeholder.svg',
    attributes: {
      age: '25-30',
      gender: 'Male',
      hairColor: 'Brown',
      eyeColor: 'Blue'
    }
  },
  // Add more mock faces here
];

export const FaceGallery = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {mockFaces.map((face) => (
        <Card key={face.id} className="bg-monitor-accent border-monitor-highlight">
          <CardHeader>
            <CardTitle className="text-sm text-gray-400">
              {new Date(face.timestamp).toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square rounded-md overflow-hidden mb-4">
              <img
                src={face.imageUrl}
                alt={`Face ${face.id}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2 text-sm">
              <p>Age: {face.attributes.age}</p>
              <p>Gender: {face.attributes.gender}</p>
              <p>Hair: {face.attributes.hairColor}</p>
              <p>Eyes: {face.attributes.eyeColor}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
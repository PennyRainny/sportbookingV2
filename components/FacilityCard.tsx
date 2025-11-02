import React from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FacilityCardProps {
  name: string;
  type: string;
  image: string;
  status: 'open' | 'closed';
  onViewDetails: () => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({
  name,
  type,
  image,
  status,
  onViewDetails,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <Badge
          className="absolute top-4 right-4"
          style={{
            backgroundColor: status === 'open' ? '#6B8AFF' : '#FFC7D3',
            color: 'white',
          }}
        >
          {status === 'open' ? 'Available' : 'Closed'}
        </Badge>
      </div>
      <div className="p-5">
        <h3 className="mb-2">{name}</h3>
        <p className="text-gray-600 mb-4 capitalize">{type}</p>
        <Button
          onClick={onViewDetails}
          className="w-full rounded-xl transition-all"
          style={{ backgroundColor: '#6B8AFF' }}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

import React from 'react';
import { Badge } from './ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BookingCardProps {
  facilityName: string;
  facilityImage: string;
  date: string;
  time: string;
  status: 'approved' | 'pending' | 'cancelled';
  onClick: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  facilityName,
  facilityImage,
  date,
  time,
  status,
  onClick,
}) => {
  const statusColors = {
    approved: '#6B8AFF',
    pending: '#FFC7D3',
    cancelled: '#BFA2FF',
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
    >
      <div className="flex">
        <div className="w-32 h-32 flex-shrink-0">
          <ImageWithFallback
            src={facilityImage}
            alt={facilityName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <h4>{facilityName}</h4>
            <Badge
              style={{
                backgroundColor: statusColors[status],
                color: 'white',
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

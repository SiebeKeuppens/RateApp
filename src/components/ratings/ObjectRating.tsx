import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Star, Trophy, Users } from 'lucide-react';
import { RatingObject } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface ObjectRatingProps {
  object: RatingObject;
  onRate: (score: number) => void;
  hasRated?: boolean;
}

export const ObjectRating: React.FC<ObjectRatingProps> = ({ object, onRate, hasRated }) => {
  const { user } = useAuth();
  const [value, setValue] = useState(5.0);

  const handleRate = () => {
    if (!user) {
      alert("Please sign in to rate this item.");
      return;
    }
    onRate(value);
  };

  return (
    <Card className="flex flex-col items-center shadow-sm transition-all hover:shadow-md">
      <CardContent className="w-full pt-6">
        <div className="text-center w-full">
          <h4 className="text-lg font-bold tracking-tight mb-6">{object.name}</h4>

          {!hasRated ? (
            <div className="mb-6 space-y-5">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold tracking-tight mb-2 tabular-nums">
                  {value.toFixed(1)}
                </span>
                <div className="h-1 w-8 bg-primary rounded-full opacity-20"></div>
              </div>

              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />

              <Button
                onClick={handleRate}
                className="w-full h-10 font-semibold"
              >
                Submit Rating
              </Button>
            </div>
          ) : (
            <div className="mb-6 py-5 flex flex-col items-center bg-muted rounded-lg border border-dashed">
              <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Your Status</span>
              <div className="flex items-center space-x-2 text-primary font-bold text-sm">
                <Star size={14} className="fill-current" />
                <span>ALREADY RATED</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t pt-5">
            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Trophy size={12} />
                <span className="text-[10px] uppercase font-bold">Score</span>
              </div>
              <span className="text-base font-bold tabular-nums">
                {object.rating ? object.rating.toFixed(1) : '0.0'}
              </span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Users size={12} />
                <span className="text-[10px] uppercase font-bold">Votes</span>
              </div>
              <span className="text-base font-bold tabular-nums">
                {object.ratingCount || 0}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

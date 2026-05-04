import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Star, Trophy, Users } from 'lucide-react';
import { RatingObject } from '../../types';

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
    <div className="glass-panel p-8 flex flex-col items-center group transition-all duration-500">
      <div className="text-center w-full">
        <h4 className="text-xl font-semibold tracking-tight mb-8">{object.name}</h4>
        
        {!hasRated ? (
          <div className="mb-8 space-y-6">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold tracking-tighter mb-2 tabular-nums">
                {value.toFixed(1)}
              </span>
              <div className="h-1 w-8 bg-primary/20 rounded-full"></div>
            </div>
            
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={value}
              onChange={(e) => setValue(parseFloat(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            
            <button
              onClick={handleRate}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm uppercase tracking-widest hover:opacity-90 transition-all active:scale-[0.98]"
            >
              Submit Rating
            </button>
          </div>
        ) : (
          <div className="mb-8 py-6 flex flex-col items-center bg-secondary/30 rounded-xl border border-border/50">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 font-bold">Your Status</span>
            <div className="flex items-center space-x-2 text-primary font-bold">
              <Star size={16} className="fill-current" />
              <span>ALREADY RATED</span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 border-t border-border pt-6">
          <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Trophy size={12} />
              <span className="text-[9px] uppercase tracking-widest font-bold">Score</span>
            </div>
            <span className="text-lg font-bold tabular-nums">
              {object.rating ? object.rating.toFixed(1) : '0.0'}
            </span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Users size={12} />
              <span className="text-[9px] uppercase tracking-widest font-bold">Votes</span>
            </div>
            <span className="text-lg font-bold tabular-nums">
              {object.ratingCount || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

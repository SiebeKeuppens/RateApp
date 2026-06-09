import React, { useEffect, useState } from 'react';
import { themeService } from '../../services/themeService';
import { Theme, RatingObject } from '../../types';
import { ObjectRating } from '../ratings/ObjectRating';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';

interface ThemeViewProps {
  themeId: string;
  onBack: () => void;
}

export const ThemeView: React.FC<ThemeViewProps> = ({ themeId, onBack }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [objects, setObjects] = useState<RatingObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratedObjects, setRatedObjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadData() {
      const [themeData, objectsData] = await Promise.all([
        themeService.getTheme(themeId),
        themeService.getRatingObjects(themeId)
      ]);
      setTheme(themeData);
      setObjects(objectsData);

      if (user) {
        const userRatings = await themeService.getUserRatings(user.uid, themeId);
        setRatedObjects(userRatings);
      }

      setLoading(false);
    }
    loadData();
  }, [themeId, user]);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  if (!theme) return (
    <div className="text-center py-20">
      <p className="text-muted-foreground uppercase tracking-[0.2em] text-[10px] mb-4 font-bold">Theme not found</p>
      <Button variant="link" onClick={onBack} className="text-xs uppercase tracking-widest font-semibold">
        Return home
      </Button>
    </div>
  );

  const handleRate = async (objectId: string, score: number) => {
    if (!user) return;
    if (ratedObjects.has(objectId)) return;

    try {
      await themeService.addRating({
        themeId,
        objectId,
        userId: user.uid,
        score
      });

      setRatedObjects(prev => new Set(prev).add(objectId));

      // Update local state for immediate feedback
      setObjects(prev => prev.map(obj => {
        if (obj.id === objectId) {
          const currentCount = obj.ratingCount || 0;
          const currentRating = obj.rating || 0;
          const newCount = currentCount + 1;
          const newAvg = (currentRating * currentCount + score) / newCount;
          return { ...obj, rating: newAvg, ratingCount: newCount };
        }
        return obj;
      }));
    } catch (error: any) {
      console.error("Error rating object:", error);
      alert(error.message || "Failed to submit rating. Please try again.");
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <Button
        variant="ghost"
        onClick={onBack}
        className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 group px-0"
      >
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Collections
      </Button>

      <div className="mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-3">{theme.name}</h2>
        <div className="h-1 w-12 bg-primary/20 mb-4 rounded-full"></div>
        <p className="text-muted-foreground font-medium max-w-2xl leading-relaxed">{theme.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {objects.map(obj => (
          <ObjectRating
            key={obj.id}
            object={obj}
            onRate={(score) => handleRate(obj.id, score)}
            hasRated={ratedObjects.has(obj.id)}
          />
        ))}
      </div>
    </div>
  );
};

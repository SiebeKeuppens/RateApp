import React, { useEffect, useState } from 'react';
import { themeService } from '../../services/themeService';
import { Theme } from '../../types';
import { ChevronRight, Folder } from 'lucide-react';
import * as Icons from 'lucide-react';

interface ThemeListProps {
  onSelectTheme: (themeId: string) => void;
}

export const ThemeList: React.FC<ThemeListProps> = ({ onSelectTheme }) => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    themeService.getThemes().then(data => {
      setThemes(data);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {themes.map(theme => {
        // Dynamic icon resolution
        const IconComponent = (Icons as any)[theme.icon || 'Folder'] || Folder;
        
        return (
          <div 
            key={theme.id} 
            onClick={() => onSelectTheme(theme.id)}
            className="group relative flex flex-col h-full rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md cursor-pointer overflow-hidden"
          >
            <div className="aspect-[16/9] bg-muted/50 flex items-center justify-center transition-all duration-500 group-hover:bg-muted/80">
              <div 
                className="p-6 rounded-full transition-all duration-500 group-hover:scale-110 shadow-sm border bg-background"
                style={{ color: theme.color || 'currentColor' }}
              >
                <IconComponent size={40} strokeWidth={2} />
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow space-y-3">
              <h3 className="text-xl font-bold tracking-tight">
                {theme.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                {theme.description}
              </p>
              <div className="flex items-center text-xs font-semibold text-primary/70 group-hover:text-primary transition-colors pt-2">
                <span>Explore Collection</span>
                <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

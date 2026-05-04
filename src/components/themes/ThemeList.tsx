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
            className="group glass-panel rounded-xl overflow-hidden hover-glass cursor-pointer flex flex-col h-full"
          >
            <div className="aspect-[16/9] bg-secondary/30 flex items-center justify-center transition-all duration-700 group-hover:bg-secondary/50">
              <div 
                className="p-6 rounded-full transition-all duration-700 group-hover:scale-110 shadow-lg"
                style={{ backgroundColor: `${theme.color || 'currentColor'}22`, color: theme.color || 'currentColor' }}
              >
                <IconComponent size={48} strokeWidth={1.5} />
              </div>
            </div>
            <div className="p-8 flex flex-col flex-grow">
              <h3 className="text-2xl font-semibold tracking-tight mb-3 group-hover:translate-x-1 transition-transform duration-300">
                {theme.name}
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed mb-8 flex-grow">
                {theme.description}
              </p>
              <div className="flex items-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors font-bold">
                <span>Explore Collection</span>
                <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

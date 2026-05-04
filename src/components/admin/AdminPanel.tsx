import React, { useState, useEffect } from 'react';
import { themeService } from '../../services/themeService';
import { Theme, RatingObject } from '../../types';
import { Plus, Trash2, Layout, Box, Loader2, Check } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ICON_LIST = [
  'Folder', 'Camera', 'Music', 'Film', 'Coffee', 'Home', 'Smartphone', 'Monitor',
  'Watch', 'Package', 'Briefcase', 'Book', 'ShoppingBag', 'Headphones', 'Award', 'Zap',
  'Star', 'Heart', 'Smile', 'Sun', 'Moon', 'Cloud', 'Globe', 'Compass'
];

const COLOR_LIST = [
  '#2563eb', // Blue 600
  '#dc2626', // Red 600
  '#16a34a', // Green 600
  '#ca8a04', // Yellow 600
  '#9333ea', // Purple 600
  '#db2777', // Pink 600
  '#ea580c', // Orange 600
  '#0891b2', // Cyan 600
  '#4f46e5', // Indigo 600
  '#0d9488', // Teal 600
  '#ffffff', // White
  '#000000', // Black
];

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'themes' | 'objects'>('themes');

  // Theme Form
  const [themeName, setThemeName] = useState('');
  const [themeDesc, setThemeDesc] = useState('');
  const [themeIcon, setThemeIcon] = useState('Folder');
  const [themeColor, setThemeColor] = useState('#2563eb');
  
  // Object Form
  const [selectedThemeId, setSelectedThemeId] = useState('');
  const [objectName, setObjectName] = useState('');

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    setLoading(true);
    const data = await themeService.getThemes();
    setThemes(data);
    if (data.length > 0 && !selectedThemeId) {
      setSelectedThemeId(data[0].id);
    }
    setLoading(false);
  };

  const handleCreateTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      await themeService.addTheme({
        name: themeName,
        description: themeDesc,
        icon: themeIcon,
        color: themeColor,
        createdBy: user.uid
      });
      setThemeName('');
      setThemeDesc('');
      setThemeIcon('Folder');
      setThemeColor('#2563eb');
      loadThemes();
    } catch (error) {
      console.error("Error creating theme:", error);
    }
  };

  const handleCreateObject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThemeId) return;

    try {
      await themeService.addRatingObject({
        themeId: selectedThemeId,
        name: objectName,
        rating: 0,
        ratingCount: 0
      });
      setObjectName('');
      alert("Object added successfully!");
    } catch (error) {
      console.error("Error creating object:", error);
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-12">
        <h2 className="text-4xl font-extralight tracking-tighter mb-4 text-foreground">Administrative Control</h2>
        <div className="h-1 w-12 bg-primary/20 mb-4 rounded-full"></div>
        <p className="text-muted-foreground uppercase tracking-[0.2em] text-[10px] font-bold">Manage collections and items</p>
      </header>

      <div className="flex space-x-8 mb-12 border-b border-border">
        <button 
          onClick={() => setActiveTab('themes')}
          className={`pb-4 text-[10px] uppercase tracking-[0.2em] transition-colors font-bold ${activeTab === 'themes' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Themes
        </button>
        <button 
          onClick={() => setActiveTab('objects')}
          className={`pb-4 text-[10px] uppercase tracking-[0.2em] transition-colors font-bold ${activeTab === 'objects' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Rating Objects
        </button>
      </div>

      {activeTab === 'themes' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <section className="bg-secondary/10 p-8 rounded-2xl border border-border">
            <h3 className="text-sm uppercase tracking-widest mb-8 flex items-center font-bold">
              <Layout size={16} className="mr-2 text-primary" /> Create New Theme
            </h3>
            <form onSubmit={handleCreateTheme} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Theme Name</label>
                <input 
                  type="text" 
                  value={themeName} 
                  onChange={(e) => setThemeName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-4 text-sm focus:border-primary outline-none transition-colors"
                  placeholder="e.g. Minimalist Architecture"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Description</label>
                <textarea 
                  value={themeDesc} 
                  onChange={(e) => setThemeDesc(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-4 text-sm focus:border-primary outline-none transition-colors h-24"
                  placeholder="Describe the collection..."
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Select Icon</label>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 bg-background p-4 rounded-xl border border-border max-h-48 overflow-y-auto custom-scrollbar">
                  {ICON_LIST.map((iconName) => {
                    const IconComponent = (Icons as any)[iconName];
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setThemeIcon(iconName)}
                        className={`p-3 rounded-lg flex items-center justify-center transition-all ${
                          themeIcon === iconName 
                            ? 'bg-primary text-primary-foreground shadow-md scale-110 z-10' 
                            : 'bg-secondary/20 text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                        }`}
                        title={iconName}
                      >
                        <IconComponent size={18} strokeWidth={1.5} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Accent Color</label>
                <div className="flex flex-wrap gap-3 bg-background p-4 rounded-xl border border-border">
                  {COLOR_LIST.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setThemeColor(color)}
                      className="w-8 h-8 rounded-full border border-border/50 relative flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                      style={{ backgroundColor: color }}
                    >
                      {themeColor === color && (
                        <Check size={14} className={color === '#ffffff' ? 'text-black' : 'text-white'} />
                      )}
                    </button>
                  ))}
                  <div className="flex items-center ml-2 border-l border-border pl-4">
                    <input 
                      type="color" 
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="w-8 h-8 rounded-full bg-transparent border-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-[0.3em] py-4 rounded-lg hover:opacity-90 transition-all shadow-sm"
              >
                Deploy Theme
              </button>
            </form>
          </section>

          <section>
            <h3 className="text-sm uppercase tracking-widest mb-8 font-bold flex items-center">
               <Box size={16} className="mr-2 text-primary" /> Existing Themes
            </h3>
            {loading ? (
              <Loader2 className="animate-spin text-muted-foreground" />
            ) : (
              <div className="space-y-4">
                {themes.map(theme => (
                  <div key={theme.id} className="glass-panel p-6 flex justify-between items-center group rounded-xl border border-border hover:border-primary/20 transition-all">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: theme.color || 'currentColor' }}
                      ></div>
                      <div>
                        <p className="text-xs uppercase tracking-widest font-bold">{theme.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">{theme.description}</p>
                      </div>
                    </div>
                    <div className="text-[9px] text-muted-foreground font-mono bg-secondary px-2 py-1 rounded">{theme.id}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="max-w-2xl bg-secondary/10 p-8 rounded-2xl border border-border">
          <h3 className="text-sm uppercase tracking-widest mb-8 flex items-center font-bold">
            <Box size={16} className="mr-2 text-primary" /> Add Object to Theme
          </h3>
          <form onSubmit={handleCreateObject} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Target Theme</label>
              <select 
                value={selectedThemeId} 
                onChange={(e) => setSelectedThemeId(e.target.value)}
                className="w-full bg-background border border-border rounded-lg p-4 text-sm focus:border-primary outline-none transition-colors appearance-none"
              >
                {themes.map(t => (
                  <option key={t.id} value={t.id} className="bg-background">{t.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Object Name</label>
              <input 
                type="text" 
                value={objectName} 
                onChange={(e) => setObjectName(e.target.value)}
                className="w-full bg-background border border-border rounded-lg p-4 text-sm focus:border-primary outline-none transition-colors"
                placeholder="e.g. Concrete Villa"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-[0.3em] py-4 rounded-lg hover:opacity-90 transition-all shadow-sm"
            >
              Add Object
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { themeService } from '../../services/themeService';
import { Theme } from '../../types';
import { Layout, Box, Loader2, Check } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

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
      <header className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Administrative Control</h2>
        <div className="h-1 w-12 bg-primary/20 mb-3 rounded-full"></div>
        <p className="text-sm text-muted-foreground font-medium">Manage collections and items</p>
      </header>

      {/* Tabs — bespoke tab UI preserved with token classes */}
      <div className="flex space-x-6 mb-10 border-b">
        <button
          onClick={() => setActiveTab('themes')}
          className={`pb-3 text-sm font-semibold transition-colors ${activeTab === 'themes' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Themes
        </button>
        <button
          onClick={() => setActiveTab('objects')}
          className={`pb-3 text-sm font-semibold transition-colors ${activeTab === 'objects' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Rating Objects
        </button>
      </div>

      {activeTab === 'themes' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <section className="bg-muted/30 p-6 rounded-xl border">
            <h3 className="text-base font-bold tracking-tight mb-6 flex items-center">
              <Layout size={18} className="mr-2 text-primary" /> Create New Theme
            </h3>
            <form onSubmit={handleCreateTheme} className="space-y-6">
              <div className="space-y-2">
                <Label>Theme Name</Label>
                <Input
                  type="text"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  placeholder="e.g. Minimalist Architecture"
                  className="h-10 bg-background"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={themeDesc}
                  onChange={(e) => setThemeDesc(e.target.value)}
                  placeholder="Describe the collection..."
                  className="bg-background"
                  required
                />
              </div>

              {/* Icon picker — bespoke grid preserved */}
              <div className="space-y-3">
                <Label>Select Icon</Label>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 bg-background p-3 rounded-lg border max-h-48 overflow-y-auto">
                  {ICON_LIST.map((iconName) => {
                    const IconComponent = (Icons as any)[iconName];
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setThemeIcon(iconName)}
                        className={`p-2 rounded-md flex items-center justify-center transition-all ${
                          themeIcon === iconName
                            ? 'bg-primary text-primary-foreground shadow-sm scale-110'
                            : 'hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent'
                        }`}
                        title={iconName}
                      >
                        <IconComponent size={18} strokeWidth={2} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color picker — bespoke grid preserved */}
              <div className="space-y-3">
                <Label>Accent Color</Label>
                <div className="flex flex-wrap gap-3 bg-background p-3 rounded-lg border">
                  {COLOR_LIST.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setThemeColor(color)}
                      className="w-7 h-7 rounded-full border relative flex items-center justify-center transition-transform hover:scale-110"
                      style={{ backgroundColor: color }}
                    >
                      {themeColor === color && (
                        <Check size={14} className={color === '#ffffff' ? 'text-black' : 'text-white'} />
                      )}
                    </button>
                  ))}
                  <div className="flex items-center ml-2 border-l pl-3">
                    <input
                      type="color"
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="w-7 h-7 rounded-full bg-transparent border-none cursor-pointer p-0"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 font-bold">
                Deploy Theme
              </Button>
            </form>
          </section>

          <section>
            <h3 className="text-base font-bold tracking-tight mb-6 flex items-center">
              <Box size={18} className="mr-2 text-primary" /> Existing Themes
            </h3>
            {loading ? (
              <Loader2 className="animate-spin text-muted-foreground" />
            ) : (
              <div className="space-y-3">
                {themes.map(theme => (
                  <div key={theme.id} className="p-5 flex justify-between items-center rounded-xl border bg-card shadow-sm hover:border-primary/20 transition-all group">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-2.5 h-2.5 rounded-full shadow-sm"
                        style={{ backgroundColor: theme.color || 'currentColor' }}
                      ></div>
                      <div>
                        <p className="text-sm font-bold tracking-tight">{theme.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{theme.description}</p>
                      </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono bg-muted px-2 py-1 rounded border shadow-inner">{theme.id}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="max-w-2xl bg-muted/30 p-6 rounded-xl border">
          <h3 className="text-base font-bold tracking-tight mb-6 flex items-center">
            <Box size={18} className="mr-2 text-primary" /> Add Object to Theme
          </h3>
          <form onSubmit={handleCreateObject} className="space-y-6">
            <div className="space-y-2">
              <Label>Target Theme</Label>
              {/* Native <select> preserved — no Select dep */}
              <select
                value={selectedThemeId}
                onChange={(e) => setSelectedThemeId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
              >
                {themes.map(t => (
                  <option key={t.id} value={t.id} className="bg-background">{t.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Object Name</Label>
              <Input
                type="text"
                value={objectName}
                onChange={(e) => setObjectName(e.target.value)}
                placeholder="e.g. Concrete Villa"
                className="h-10 bg-background"
                required
              />
            </div>
            <Button type="submit" className="w-full h-11 font-bold">
              Add Object
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

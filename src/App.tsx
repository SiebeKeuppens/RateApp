import React, { useState } from 'react';
import { ThemeList } from './components/themes/ThemeList';
import { ThemeView } from './components/themes/ThemeView';
import { SignInModal } from './components/auth/SignInModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminGuard } from './components/admin/AdminGuard';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { auth } from './firebase';
import { LogOut, Settings, Layout, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const { user, profile, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);

  const handleLogoClick = () => {
    setSelectedThemeId(null);
    setIsAdminView(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <nav className="border-b border-border px-8 py-4 flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <h1 
          className="text-xl tracking-widest font-bold uppercase cursor-pointer flex items-center"
          onClick={handleLogoClick}
        >
          Rating<span className="font-thin text-muted-foreground">App</span>
        </h1>
        <div className="flex items-center space-x-6">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {user ? (
            <div className="flex items-center space-x-6">
              {isAdmin && (
                <button 
                  onClick={() => setIsAdminView(!isAdminView)}
                  className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isAdminView ? <Layout size={14} /> : <Settings size={14} />}
                  <span>{isAdminView ? 'View Site' : 'Admin'}</span>
                </button>
              )}
              
              <div className="flex items-center space-x-4 border-l border-border pl-6">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold tracking-tight">
                    {profile?.displayName || user.email}
                  </span>
                  {isAdmin && (
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Admin</span>
                  )}
                </div>
                <button 
                  onClick={() => auth.signOut()}
                  className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsSignInOpen(true)}
              className="text-sm font-semibold tracking-widest uppercase border border-input px-6 py-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-md"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-16 px-6">
        {isAdminView ? (
          <AdminGuard>
            <AdminPanel />
          </AdminGuard>
        ) : selectedThemeId ? (
          <ThemeView 
            themeId={selectedThemeId} 
            onBack={() => setSelectedThemeId(null)} 
          />
        ) : (
          <>
            <header className="mb-16 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
              <h2 className="text-5xl font-extralight tracking-tighter mb-4">Curated Collections</h2>
              <div className="h-1 w-12 bg-primary mx-auto mb-6 rounded-full"></div>
              <p className="text-muted-foreground tracking-[0.2em] uppercase text-[10px] font-medium">Explore and rate the exceptional</p>
            </header>
            
            <ThemeList onSelectTheme={(id) => setSelectedThemeId(id)} />
          </>
        )}
      </main>

      <SignInModal 
        isOpen={isSignInOpen} 
        onClose={() => setIsSignInOpen(false)} 
      />
    </div>
  );
};

export default App;

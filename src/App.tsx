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
      <nav className="border-b bg-background px-8 py-3 flex justify-between items-center">
        <h1 
          className="text-xl font-bold tracking-tight cursor-pointer flex items-center"
          onClick={handleLogoClick}
        >
          Rating<span className="text-muted-foreground">App</span>
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {user ? (
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <button 
                  onClick={() => setIsAdminView(!isAdminView)}
                  className="flex items-center space-x-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isAdminView ? <Layout size={14} /> : <Settings size={14} />}
                  <span>{isAdminView ? 'View Site' : 'Admin'}</span>
                </button>
              )}
              
              <div className="flex items-center space-x-4 border-l pl-4">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold">
                    {profile?.displayName || user.email}
                  </span>
                  {isAdmin && (
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Admin</span>
                  )}
                </div>
                <button 
                  onClick={() => auth.signOut()}
                  className="text-sm font-medium hover:underline text-muted-foreground hover:text-foreground"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsSignInOpen(true)}
              className="text-sm font-medium border px-4 py-2 hover:bg-accent transition-colors rounded-md shadow-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-12 px-6">
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
            <header className="mb-12 text-center animate-in fade-in duration-700">
              <h2 className="text-3xl font-bold tracking-tight mb-3">Curated Collections</h2>
              <div className="h-1 w-12 bg-primary mx-auto mb-4 rounded-full"></div>
              <p className="text-sm text-muted-foreground font-medium">Explore and rate the exceptional</p>
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

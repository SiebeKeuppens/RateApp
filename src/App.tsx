import React, { useState } from 'react';
import { ThemeList } from './components/themes/ThemeList';
import { ThemeView } from './components/themes/ThemeView';
import { SignInForm } from './components/auth/SignInForm';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminGuard } from './components/admin/AdminGuard';
import { useAuth } from './hooks/useAuth';
import { auth } from './firebase';
import { Settings, Layout } from 'lucide-react';
import { SuiteTopBar, ThemeToggle } from './suite';

const App: React.FC = () => {
  const { user, profile, isAdmin, hasAccess, appAccess, loading } = useAuth();
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user && !hasAccess && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center bg-background text-foreground">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-bold">Unauthorized</h1>
          <p className="text-muted-foreground">
            You are unauthorized to access this app. If you would like access, request it with the admin.
            You can contact him by email (siebe.keuppens@gmail.com) or discord (sie.be).
          </p>
          <button onClick={() => auth.signOut()} className="text-primary underline">Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {user ? (
        <SuiteTopBar
          app="rating"
          user={{
            email: user.email ?? '',
            displayName: profile?.displayName ?? user.displayName,
            photoURL: user.photoURL,
          }}
          isAdmin={isAdmin}
          appAccess={appAccess ?? {}}
          onSignOut={() => auth.signOut()}
          navSlot={
            isAdmin ? (
              <button
                onClick={() => setIsAdminView(!isAdminView)}
                className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
              >
                {isAdminView ? <Layout size={16} /> : <Settings size={16} />}
                <span>{isAdminView ? 'View Site' : 'Admin'}</span>
              </button>
            ) : undefined
          }
        />
      ) : (
        <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface-container/85 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-md bg-primary text-primary-foreground font-head font-bold text-sm">R</span>
              <span className="font-head font-semibold text-lg tracking-tight">RatingApp</span>
            </div>
            <ThemeToggle />
          </div>
        </header>
      )}

      <main className="max-w-7xl mx-auto py-12 px-4">
        {!user ? (
          <div className="flex justify-center pt-6">
            <div className="w-full max-w-md rounded-xl border border-outline-variant bg-card p-8 shadow-sm animate-in fade-in zoom-in-95 duration-300">
              <SignInForm />
            </div>
          </div>
        ) : isAdminView ? (
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
    </div>
  );
};

export default App;

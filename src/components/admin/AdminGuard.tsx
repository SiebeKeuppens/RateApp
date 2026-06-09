import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children, fallback }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      fallback || (
        <Card className="max-w-md mx-auto mt-20 bg-destructive/5 border-destructive/20 shadow-sm">
          <CardContent className="pt-10 pb-10 px-8 text-center">
            <div className="mb-6 flex justify-center text-destructive">
              <ShieldAlert size={48} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">Access Restricted</h2>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8">
              You do not have the required administrative permissions to access this control panel.
            </p>
            <div className="h-1 w-12 bg-destructive/20 mx-auto rounded-full"></div>
          </CardContent>
        </Card>
      )
    );
  }

  return <>{children}</>;
};

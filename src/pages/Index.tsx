import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Dashboard } from './Dashboard';
import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-cream to-secondary/30">
        <div className="text-center animate-fade-in">
          <div className={cn(
            "inline-flex items-center justify-center p-4 rounded-2xl mb-4 float-animation",
            "bg-gradient-to-br from-sage-light to-sage/30"
          )}>
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading SpiritGuide...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Dashboard />;
};

export default Index;

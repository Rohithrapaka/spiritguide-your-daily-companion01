import React from 'react';
import { Ghost, Eye, EyeOff, Shield } from 'lucide-react';
import { usePrivacy } from '@/contexts/PrivacyContext';
import { cn } from '@/lib/utils';

export const PrivacyToggle: React.FC = () => {
  const { privacyMode, togglePrivacyMode, isBlurred, toggleBlur } = usePrivacy();

  return (
    <div className="flex items-center gap-2">
      {/* Quick Blur Button */}
      <button
        onClick={toggleBlur}
        className={cn(
          "p-2 rounded-full transition-all duration-300 border border-border",
          "hover:shadow-soft",
          isBlurred 
            ? "bg-destructive text-destructive-foreground" 
            : "bg-secondary text-secondary-foreground"
        )}
        title={isBlurred ? "Unblur content" : "Quick blur"}
      >
        {isBlurred ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>

      {/* Privacy Mode Toggle */}
      <button
        onClick={togglePrivacyMode}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300",
          "border border-border hover:shadow-soft",
          privacyMode 
            ? "bg-primary text-primary-foreground" 
            : "bg-secondary text-secondary-foreground"
        )}
        title={privacyMode ? "Privacy mode: ON" : "Privacy mode: OFF"}
      >
        {privacyMode ? (
          <>
            <Ghost className="h-4 w-4" />
            <span className="text-sm font-medium">Ghost Mode</span>
          </>
        ) : (
          <>
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Normal</span>
          </>
        )}
      </button>
    </div>
  );
};

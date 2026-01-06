import React, { createContext, useContext, useState, useCallback } from 'react';

interface PrivacyContextType {
  privacyMode: boolean;
  togglePrivacyMode: () => void;
  isBlurred: boolean;
  toggleBlur: () => void;
  setBlurred: (blurred: boolean) => void;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [privacyMode, setPrivacyMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('spiritguide-privacy') === 'true';
    }
    return false;
  });
  const [isBlurred, setIsBlurred] = useState(false);

  const togglePrivacyMode = useCallback(() => {
    setPrivacyMode(prev => {
      const newValue = !prev;
      localStorage.setItem('spiritguide-privacy', String(newValue));
      return newValue;
    });
  }, []);

  const toggleBlur = useCallback(() => {
    setIsBlurred(prev => !prev);
  }, []);

  const setBlurred = useCallback((blurred: boolean) => {
    setIsBlurred(blurred);
  }, []);

  return (
    <PrivacyContext.Provider value={{ 
      privacyMode, 
      togglePrivacyMode, 
      isBlurred, 
      toggleBlur,
      setBlurred 
    }}>
      {children}
    </PrivacyContext.Provider>
  );
};

export const usePrivacy = () => {
  const context = useContext(PrivacyContext);
  if (context === undefined) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
};

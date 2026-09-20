import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [selectedResumeId, setSelectedResumeId] = useState(() => localStorage.getItem('selectedResumeId') || null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (selectedResumeId) localStorage.setItem('selectedResumeId', selectedResumeId);
    else localStorage.removeItem('selectedResumeId');
  }, [selectedResumeId]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      selectedResumeId, setSelectedResumeId,
      sidebarOpen, setSidebarOpen
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

// 1. Create a global error context
// src/contexts/ErrorContext.tsx
import { createContext, ReactNode, useState, useCallback } from 'react';

export interface ErrorState {
  message: string;
  severity: 'error' | 'warning' | 'info';
  timestamp: number;
}

interface ErrorContextType {
  error: ErrorState | null;
  setError: (error: ErrorState) => void;
  clearError: () => void;
  handleError: (error: unknown, fallbackMessage?: string) => void;
}

export const ErrorContext = createContext<ErrorContextType>(null!);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<ErrorState | null>(null);
  
  const clearError = useCallback(() => setError(null), []);

  const handleError = useCallback((error: unknown, fallbackMessage = 'An unexpected error occurred') => {
    const errorMessage = error instanceof Error ? error.message : fallbackMessage;
    
    setError({
      message: errorMessage,
      severity: 'error',
      timestamp: Date.now()
    });
  }, []);

  return (
    <ErrorContext.Provider value={{ error, setError, clearError, handleError }}>
      {children}
    </ErrorContext.Provider>
  );
}
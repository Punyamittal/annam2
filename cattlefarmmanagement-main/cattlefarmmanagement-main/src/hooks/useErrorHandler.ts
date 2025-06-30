// src/hooks/useErrorHandler.ts
import { useContext, useCallback } from 'react';
import { ErrorContext } from '../contexts/ErrorContext';

export function useErrorHandler() {
  const { handleError, clearError } = useContext(ErrorContext);

  const handleApiError = useCallback(async (apiCall: () => Promise<any>, fallbackMessage?: string) => {
    try {
      return await apiCall();
    } catch (error) {
      handleError(error, fallbackMessage);
      throw error;
    }
  }, [handleError]);

  return { handleApiError, clearError };
}
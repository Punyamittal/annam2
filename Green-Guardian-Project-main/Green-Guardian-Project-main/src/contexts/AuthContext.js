import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Account } from 'appwrite';

// Initialize Appwrite client
const client = new Client();

client
  .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID || 'your-project-id');

const account = new Account(client);

// Create the authentication context
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if the user is already logged in when the app loads
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (err) {
        console.error('Error checking user status:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  // Register function
  const register = async (email, password, name) => {
    setIsLoading(true);
    setError(null);
    try {
      // Create user account
      await account.create('unique()', email, password, name);
      
      // Log in the user after successful registration
      await account.createEmailSession(email, password);
      
      // Get user details
      const currentUser = await account.get();
      setUser(currentUser);
      
      return { success: true, user: currentUser };
    } catch (err) {
      setError(err.message || 'Failed to register');
      return { success: false, error: err.message || 'Failed to register' };
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      await account.createEmailSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      return { success: true, user: currentUser };
    } catch (err) {
      setError(err.message || 'Failed to login');
      return { success: false, error: err.message || 'Failed to login' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await account.deleteSession('current');
      setUser(null);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to logout');
      return { success: false, error: err.message || 'Failed to logout' };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    setIsLoading(true);
    setError(null);
    try {
      await account.createRecovery(email, `${window.location.origin}/reset-password`);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to send password reset email');
      return { success: false, error: err.message || 'Failed to send password reset email' };
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm password reset function
  const confirmPasswordReset = async (userId, secret, password, confirmPassword) => {
    setIsLoading(true);
    setError(null);
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      await account.updateRecovery(userId, secret, password, confirmPassword);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to reset password');
      return { success: false, error: err.message || 'Failed to reset password' };
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    register,
    login,
    logout,
    resetPassword,
    confirmPasswordReset
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

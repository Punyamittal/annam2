import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login, logout, createAccount } from '../services/auth';

// Create the authentication context
const AuthContext = createContext({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  error: null,
});

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if the user is already logged in when the app loads
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Error checking user status:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  // Login function
  const handleLogin = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await login(email, password);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return { success: true, user: currentUser };
    } catch (err) {
      setError(err.message || 'Failed to login');
      return { success: false, error: err.message || 'Failed to login' };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const handleRegister = async (email, password, name) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createAccount(email, password, name);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return { success: true, user: currentUser };
    } catch (err) {
      setError(err.message || 'Failed to register');
      return { success: false, error: err.message || 'Failed to register' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await logout();
      setUser(null);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to logout');
      return { success: false, error: err.message || 'Failed to logout' };
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isPublicPath = publicPaths.includes(router.pathname);

  useEffect(() => {
    // If authentication is still loading, do nothing
    if (isLoading) return;

    // If not authenticated and not on a public path, redirect to login
    if (!isAuthenticated && !isPublicPath) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router, isPublicPath]);

  // If still loading and not on a public path, show loading state
  if (isLoading && !isPublicPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  // Always render children for public paths
  // For protected paths, render only if authenticated or still loading
  return children;
};

export default ProtectedRoute;

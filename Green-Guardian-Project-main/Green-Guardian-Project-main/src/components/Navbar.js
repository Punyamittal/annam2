import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to home page or login page after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-green-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-white font-bold text-xl">
                GreenGuardian
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link
                to="/"
                className={`${
                  location.pathname === '/'
                    ? 'bg-green-800 text-white'
                    : 'text-green-100 hover:bg-green-600 hover:text-white'
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                Home
              </Link>
              <Link
                to="/map-view"
                className={`${
                  location.pathname === '/map-view'
                    ? 'bg-green-800 text-white'
                    : 'text-green-100 hover:bg-green-600 hover:text-white'
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                Map View
              </Link>
              <Link
                to="/satellite"
                className={`${
                  location.pathname === '/satellite'
                    ? 'bg-green-800 text-white'
                    : 'text-green-100 hover:bg-green-600 hover:text-white'
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                Satellite
              </Link>
              <Link
                to="/farming"
                className={`${
                  location.pathname === '/farming'
                    ? 'bg-green-800 text-white'
                    : 'text-green-100 hover:bg-green-600 hover:text-white'
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                Farming
              </Link>
              <Link
                to="/challenges"
                className={`${
                  location.pathname === '/challenges'
                    ? 'bg-green-800 text-white'
                    : 'text-green-100 hover:bg-green-600 hover:text-white'
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                Challenges
              </Link>
              <Link
                to="/emergency"
                className={`${
                  location.pathname === '/emergency'
                    ? 'bg-green-800 text-white'
                    : 'text-green-100 hover:bg-green-600 hover:text-white'
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                Emergency
              </Link>
              <Link
                to="/settings"
                className={`${
                  location.pathname === '/settings'
                    ? 'bg-green-800 text-white'
                    : 'text-green-100 hover:bg-green-600 hover:text-white'
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                Settings
              </Link>
            </div>
          </div>
          
          {/* Auth buttons - desktop */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {!isLoading && (
              isAuthenticated ? (
                <div className="ml-3 relative">
                  <div>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="bg-green-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-800 focus:ring-white"
                      id="user-menu"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </div>
                    </button>
                  </div>

                  {isProfileOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-medium">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="text-white bg-green-600 hover:bg-green-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-green-700 hover:bg-green-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign up
                  </Link>
                </div>
              )
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-green-100 hover:text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`${
                location.pathname === '/'
                  ? 'bg-green-800 text-white'
                  : 'text-green-100 hover:bg-green-600 hover:text-white'
              } block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/map-view"
              className={`${
                location.pathname === '/map-view'
                  ? 'bg-green-800 text-white'
                  : 'text-green-100 hover:bg-green-600 hover:text-white'
              } block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Map View
            </Link>
            <Link
              to="/satellite"
              className={`${
                location.pathname === '/satellite'
                  ? 'bg-green-800 text-white'
                  : 'text-green-100 hover:bg-green-600 hover:text-white'
              } block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Satellite
            </Link>
            <Link
              to="/farming"
              className={`${
                location.pathname === '/farming'
                  ? 'bg-green-800 text-white'
                  : 'text-green-100 hover:bg-green-600 hover:text-white'
              } block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Farming
            </Link>
            <Link
              to="/challenges"
              className={`${
                location.pathname === '/challenges'
                  ? 'bg-green-800 text-white'
                  : 'text-green-100 hover:bg-green-600 hover:text-white'
              } block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Challenges
            </Link>
            <Link
              to="/emergency"
              className={`${
                location.pathname === '/emergency'
                  ? 'bg-green-800 text-white'
                  : 'text-green-100 hover:bg-green-600 hover:text-white'
              } block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Emergency
            </Link>
            <Link
              to="/settings"
              className={`${
                location.pathname === '/settings'
                  ? 'bg-green-800 text-white'
                  : 'text-green-100 hover:bg-green-600 hover:text-white'
              } block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Settings
            </Link>
          </div>
          
          {/* Auth buttons - mobile */}
          {!isLoading && (
            isAuthenticated ? (
              <div className="pt-4 pb-3 border-t border-green-800">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{user?.name || 'User'}</div>
                    <div className="text-sm font-medium text-green-100">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-green-100 hover:text-white hover:bg-green-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-base font-medium text-green-100 hover:text-white hover:bg-green-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left block px-4 py-2 text-base font-medium text-green-100 hover:text-white hover:bg-green-600"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-green-800">
                <div className="space-y-1 px-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-white text-green-700 hover:bg-green-100 mt-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

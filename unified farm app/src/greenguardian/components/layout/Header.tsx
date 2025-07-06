import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-green-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
          <span className="text-xl font-bold">GreenGuardian</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="flex-grow flex justify-center">
          <nav className="flex space-x-6">
            <Link to="/" className="hover:text-green-200 transition-colors">
              Home
            </Link>
            <Link to="/map" className="hover:text-green-200 transition-colors">
              Map View
            </Link>
            <Link
              to="/satellite"
              className="hover:text-green-200 transition-colors"
            >
              Satellite
            </Link>
            <Link
              to="/farming"
              className="hover:text-green-200 transition-colors"
            >
              Farming
            </Link>
            <Link
              to="/gamification"
              className="hover:text-green-200 transition-colors"
            >
              Challenges
            </Link>
            <Link
              to="/emergency"
              className="hover:text-green-200 transition-colors"
            >
              Emergency
            </Link>
            {/* <Link to="/settings" className="hover:text-green-200 transition-colors">Settings</Link> */}
          </nav>
        </div>

        {/* Authentication Links - Desktop */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-1 hover:text-green-200 transition-colors"
              >
                <span>{user?.name || "Account"}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-medium">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-500">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-green-200 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-white text-green-700 hover:bg-green-100 px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none ml-4"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-green-800 px-4 py-2">
          <Link
            to="/"
            className="block py-2 hover:text-green-200 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/map"
            className="block py-2 hover:text-green-200 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Map View
          </Link>
          <Link
            to="/satellite"
            className="block py-2 hover:text-green-200 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Satellite
          </Link>
          <Link
            to="/farming"
            className="block py-2 hover:text-green-200 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Farming
          </Link>
          <Link
            to="/gamification"
            className="block py-2 hover:text-green-200 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Challenges
          </Link>
          <Link
            to="/emergency"
            className="block py-2 hover:text-green-200 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Emergency
          </Link>
          <Link
            to="/settings"
            className="block py-2 hover:text-green-200 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Settings
          </Link>

          {/* Authentication Links - Mobile */}
          <div className="border-t border-green-700 mt-2 pt-2">
            {isAuthenticated ? (
              <>
                <div className="py-2 text-green-200">
                  Signed in as {user?.name || "User"}
                </div>
                <Link
                  to="/profile"
                  className="block py-2 hover:text-green-200 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Your Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 hover:text-green-200 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 hover:text-green-200 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block py-2 hover:text-green-200 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;

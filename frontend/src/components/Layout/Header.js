import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Mock user for testing when backend auth is not working
  const mockUser = {
    id: 1,
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@faith.edu.ph',
    role: 'admin',
    department: 'Computer Science',
    isActive: true
  };

  // Use mock user if real user is not available
  const currentUser = user || mockUser;

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideDesktop = desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target);
      const isOutsideMobile = mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target);
      
      // Close if click is outside both dropdowns (or if one doesn't exist, check the other)
      if (isDropdownOpen) {
        if (desktopDropdownRef.current && mobileDropdownRef.current) {
          // Both exist, check if outside both
          if (isOutsideDesktop && isOutsideMobile) {
            setIsDropdownOpen(false);
          }
        } else if (desktopDropdownRef.current && isOutsideDesktop) {
          // Only desktop exists
          setIsDropdownOpen(false);
        } else if (mobileDropdownRef.current && isOutsideMobile) {
          // Only mobile exists
          setIsDropdownOpen(false);
        }
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/auth/login');
  };

  const getUserInitials = () => {
    if (currentUser?.firstName && currentUser?.lastName) {
      return `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`.toUpperCase();
    }
    if (currentUser?.firstName) {
      return currentUser.firstName.charAt(0).toUpperCase();
    }
    if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    if (currentUser?.firstName && currentUser?.lastName) {
      return `${currentUser.firstName} ${currentUser.lastName}`;
    }
    if (currentUser?.firstName) {
      return currentUser.firstName;
    }
    if (currentUser?.email) {
      return currentUser.email;
    }
    return 'User';
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to={currentUser?.role === 'admin' ? '/admin' : '/dashboard'} 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity no-underline"
          >
            <img 
              src="/faith logo.png" 
              alt="FAITH Colleges Logo" 
              className="h-8 w-auto max-h-8 object-contain"
            />
            <span className="text-lg font-semibold text-gray-800 cursor-pointer">
              One Faith. One Archive.
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            <Link
              to="/thesis"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/thesis') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Thesis
            </Link>
            <Link
              to="/researchers"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/researchers') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Researchers
            </Link>
            <Link
              to="/settings"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/settings') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Settings
            </Link>
            {currentUser?.role !== 'student' && (
              <Link
                to="/calendar"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/calendar') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Calendar
              </Link>
            )}
            
            {/* User Avatar with Dropdown */}
            <div className="relative ml-4" ref={desktopDropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-3 px-3 py-1.5 rounded-full transition-all duration-200 ${
                  isDropdownOpen ? 'bg-blue-50 shadow-inner ring-1 ring-blue-200' : 'hover:bg-gray-100'
                }`}
              >
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                  {getUserInitials()}
                </div>
                <span className="text-base font-medium text-gray-700 hidden lg:inline">{getUserDisplayName().split(' ')[0]}</span>
                <ChevronDownIcon 
                  className={`h-5 w-5 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1.5 z-50"
                >
                  <div className="px-3 py-1.5 border-b border-gray-200">
                    <p className="text-xs font-medium text-gray-800">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-500">{currentUser?.role || 'User'}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 transition-colors no-underline"
                    >
                      <UserCircleIcon className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 transition-colors no-underline"
                    >
                      <Cog6ToothIcon className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Settings</span>
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 text-red-600" />
                      <span className="font-medium">Log out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </nav>

          {/* Mobile menu button and avatar */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile Avatar */}
            <div className="relative" ref={mobileDropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-2 px-2 py-1 rounded-full transition-all duration-200 ${
                  isDropdownOpen ? 'bg-blue-50 shadow-inner ring-1 ring-blue-200' : 'hover:bg-gray-100'
                }`}
              >
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                  {getUserInitials()}
                </div>
              </button>

              {/* Mobile Dropdown Menu */}
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1.5 z-50"
                >
                  <div className="px-3 py-1.5 border-b border-gray-200">
                    <p className="text-xs font-medium text-gray-800">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-500">{currentUser?.role || 'User'}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 transition-colors no-underline"
                    >
                      <UserCircleIcon className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 transition-colors no-underline"
                    >
                      <Cog6ToothIcon className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Settings</span>
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 text-red-600" />
                      <span className="font-medium">Log out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
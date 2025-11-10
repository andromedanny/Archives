import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Check localStorage for token and user as fallback
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const hasToken = !!token;
  const hasStoredUser = !!storedUser;

  console.log('ProtectedRoute:', { 
    path: location.pathname, 
    isAuthenticated, 
    isLoading, 
    userRole: user?.role, 
    allowedRoles,
    hasToken,
    hasStoredUser
  });

  // If still loading authentication state, show spinner
  if (isLoading) {
    console.log('ProtectedRoute: Still loading, showing spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If we have a token and stored user, but state isn't authenticated yet, use stored data
  // This handles the case where login just succeeded but context hasn't updated yet
  // Also check if we just logged in (within last 5 seconds)
  const justLoggedIn = sessionStorage.getItem('justLoggedIn') === 'true';
  
  if (!isAuthenticated && hasToken && hasStoredUser && !isLoading) {
    console.log('ProtectedRoute: Using stored authentication data (login just completed)', { justLoggedIn });
    try {
      const parsedUser = JSON.parse(storedUser);
      // Allow access if no role restriction or role matches
      if (allowedRoles.length === 0 || allowedRoles.includes(parsedUser.role)) {
        console.log('ProtectedRoute: Allowing access based on stored credentials', { role: parsedUser.role });
        // Clear the justLoggedIn flag after successful access
        if (justLoggedIn) {
          setTimeout(() => sessionStorage.removeItem('justLoggedIn'), 1000);
        }
        return children;
      } else {
        console.log('ProtectedRoute: Role mismatch', { userRole: parsedUser.role, allowedRoles });
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have permission to access this page.
              </p>
            </div>
          </div>
        );
      }
    } catch (e) {
      console.error('Error parsing stored user:', e);
      // If we can't parse user and we just logged in, give it another moment
      if (justLoggedIn) {
        console.log('ProtectedRoute: Just logged in, showing loading while parsing');
        return (
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        );
      }
      // Otherwise clear storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
  }

  // If authenticated normally, proceed
  if (isAuthenticated) {
    // Check role if required
    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      console.log('ProtectedRoute: Role check failed', { userRole: user.role, allowedRoles });
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have permission to access this page.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="btn-primary"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }
    console.log('ProtectedRoute: Access granted, rendering children');
    return children;
  }

  // If not authenticated and no token, redirect to login
  if (!isAuthenticated && !hasToken) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  
  // Fallback: if we have token but not authenticated, show loading
  if (hasToken && !isAuthenticated) {
    console.log('ProtectedRoute: Has token but not authenticated, showing loading');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Should not reach here, but just in case
  console.log('ProtectedRoute: Unexpected state, redirecting to login');
  return <Navigate to="/auth/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;

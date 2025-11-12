import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        try {
          // Try to verify token with backend (with timeout)
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Auth check timeout')), 5000)
          );
          
          const authPromise = authAPI.getMe();
          
          const response = await Promise.race([authPromise, timeoutPromise]);
          console.log('Auth check: Backend verification successful');
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: response.data.user,
              token,
            },
          });
          // Update localStorage with fresh user data
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (error) {
          // If backend verification fails (network error, timeout, etc.), use cached user data
          console.log('Auth check: Backend verification failed, using cached user data', error.message);
          try {
            const parsedUser = JSON.parse(user);
            // Only use cached data if it's valid
            if (parsedUser && parsedUser.id && parsedUser.email) {
              dispatch({
                type: 'AUTH_SUCCESS',
                payload: {
                  user: parsedUser,
                  token,
                },
              });
            } else {
              throw new Error('Invalid cached user data');
            }
          } catch (parseError) {
            console.error('Auth check: Failed to parse user data', parseError);
            // Only clear storage if it's definitely invalid
            // Don't clear on network errors - allow offline mode
            if (error.response && error.response.status === 401) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              dispatch({ type: 'AUTH_FAILURE', payload: null });
            } else {
              // Network error - use cached data
              try {
                const parsedUser = JSON.parse(user);
                dispatch({
                  type: 'AUTH_SUCCESS',
                  payload: {
                    user: parsedUser,
                    token,
                  },
                });
              } catch (e) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                dispatch({ type: 'AUTH_FAILURE', payload: null });
              }
            }
          }
        }
      } else {
        console.log('Auth check: No token or user found');
        dispatch({ type: 'AUTH_FAILURE', payload: null });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      console.log('Login attempt:', { email: credentials.email });
      const response = await authAPI.login(credentials);
      console.log('Login response:', response.data);
      
      const { user, token } = response.data;

      if (!user || !token) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set flag to prevent immediate redirect by interceptor
      sessionStorage.setItem('justLoggedIn', 'true');
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });

      toast.success(`Welcome back, ${user.firstName || user.email}!`);
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || error.message || 'Login failed';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: message,
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authAPI.register(userData);
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });

      toast.success(`Welcome to One Faith One Archive, ${user.firstName}!`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: message,
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      dispatch({
        type: 'UPDATE_USER',
        payload: response.data.user,
      });
      localStorage.setItem('user', JSON.stringify({ ...state.user, ...response.data.user }));
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await authAPI.changePassword(passwordData);
      toast.success('Password changed successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import BackgroundImage from '../UI/BackgroundImage';

const AuthLayout = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'auto' }}>
      <BackgroundImage />
      
      {/* Single Box with Header, Content, and Footer */}
      <div className="relative z-10 w-full max-w-md" style={{ position: 'relative', zIndex: 10 }}>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <div className="text-center">
              <h1 className="text-lg font-semibold text-white">
                One Faith. One Archive.
              </h1>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 py-8 bg-white">
            <Outlet />
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              © 2025 <span className="text-blue-600 font-medium">One Faith One Archive</span>. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

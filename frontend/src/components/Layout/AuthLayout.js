import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import BackgroundImage from '../UI/BackgroundImage';

const AuthLayout = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-6">
      <BackgroundImage />
      
      {/* Single Box with Header, Content, and Footer */}
      <div className="relative z-10 w-full max-w-sm">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gray-100 px-4 py-3">
            <div className="text-center">
              <h1 className="text-sm font-semibold text-gray-800">
                One Faith One Archive
              </h1>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-4 py-3">
            <Outlet />
          </div>

          {/* Footer */}
          <div className="bg-gray-100 px-4 py-2 border-t">
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

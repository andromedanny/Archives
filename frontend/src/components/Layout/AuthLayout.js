import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BookOpenIcon } from '@heroicons/react/24/outline';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <BookOpenIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-gray-900">
                One Faith Archive
              </h1>
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          A Web-Based Platform for Digitizing and Preserving Faith-Based Thesis
        </p>
      </div>

      {/* Main Content */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          © 2024 One Faith One Archive. All rights reserved.
        </p>
        <div className="mt-2">
          <Link
            to="/"
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

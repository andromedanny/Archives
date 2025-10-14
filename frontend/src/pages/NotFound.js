import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center"
      >
        <div className="mx-auto h-24 w-24 bg-primary-100 rounded-full flex items-center justify-center">
          <span className="text-4xl font-bold text-primary-600">404</span>
        </div>
        
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
          Page not found
        </h1>
        
        <p className="mt-2 text-sm text-gray-600">
          Sorry, we couldn't find the page you're looking for.
        </p>
        
        <div className="mt-8 space-y-4">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <HomeIcon className="mr-2 h-4 w-4" />
            Go back home
          </Link>
          
          <div>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Go back
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;

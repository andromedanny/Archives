import React from 'react';


import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';

const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>FAITH Colleges Thesis Archive</title>
        <meta name="description" content="Welcome to the FAITH Colleges Thesis Archive - A comprehensive platform for digitizing and preserving faith-based theses" />
      </Helmet>
      
      <BackgroundImage />
      <Header />
      
      <main className="min-h-screen flex flex-col justify-center items-center pt-16 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-4/5 max-w-6xl mx-auto"
        >
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
            <img 
              src="/faith logo.png" 
              alt="FAITH Colleges Logo" 
              className="h-16 w-auto"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
              Welcome to the FAITH Colleges Thesis Archive
            </h1>
          </div>
          
          <p className="text-center text-lg text-gray-700 mb-8">
            Use the navigation above to explore the archive.
          </p>

          {/* Quick Stats or Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-gray-600">Thesis Documents</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Researchers</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
              <div className="text-gray-600">Departments</div>
            </div>
      </motion.div>
      </motion.div>
      </main>
      
      <Footer />
    </>
  );
};

export default Dashboard;
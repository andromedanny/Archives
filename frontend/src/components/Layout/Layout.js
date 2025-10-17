import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BackgroundImage from '../UI/BackgroundImage';

const Layout = () => {
  return (
    <div className="min-h-screen relative">
      <BackgroundImage />
      <Header />
      
      {/* Page content */}
      <main className="relative z-10">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;

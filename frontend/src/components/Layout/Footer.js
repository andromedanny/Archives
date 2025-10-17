import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      className="fixed bottom-0 left-0 right-0 bg-blue-900 text-white text-center py-3 z-10"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-sm">
        &copy; 2025 FAITH Colleges Thesis Archive. All rights reserved.
      </p>
    </motion.footer>
  );
};

export default Footer;

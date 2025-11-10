import React from 'react';

const BackgroundImage = () => {
  return (
    <div 
      className="fixed inset-0 w-full h-full opacity-50"
      style={{
        backgroundImage: "url('/FAITH-AERIAL-1024x576.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        zIndex: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    />
  );
};

export default BackgroundImage;

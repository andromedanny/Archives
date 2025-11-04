import React from 'react';

const BackgroundImage = () => {
  return (
    <div 
      className="fixed inset-0 w-full h-full opacity-60 -z-10"
      style={{
        backgroundImage: "url('/FAITH-AERIAL-1024x576.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    />
  );
};

export default BackgroundImage;

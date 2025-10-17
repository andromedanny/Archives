import React from 'react';

const BackgroundImage = () => {
  return (
    <div 
      className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed opacity-70 -z-10"
      style={{
        backgroundImage: "url('/FAITH-AERIAL-1024x576.jpg')"
      }}
    />
  );
};

export default BackgroundImage;

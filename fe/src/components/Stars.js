import React, { useState, useEffect } from 'react';
import image from '../assets/stars.png';

const ImageOverlay = ({
  alt = 'Overlay Image',
  width = '30vh',
  mobileWidth = null,
  top = '30%',
  left = null,
  right = null,
  bottom = null,
  rotate = '0deg',
  mirror = false,
  zIndex = 6,
  pointerEvents = 'none',
  showOnMobile = true, // Show/hide flag for mobile
  showOnDesktop = true, // Show/hide flag for desktop
  overflow = 'hidden'
}) => {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If the image should not show on the current device, return null
  if ((isMobile && !showOnMobile) || (!isMobile && !showOnDesktop)) {
    return null;
  }

  const positionStyles = {
    ...(top !== null && { top }),
    ...(left !== null && { left }),
    ...(right !== null && { right }),
    ...(bottom !== null && { bottom }),
  };

  const styles = {
    width: isMobile && mobileWidth ? mobileWidth : width,
    objectFit: 'cover',
    position: 'absolute',
    transform: `${mirror ? 'scaleX(-1)' : ''} rotate(${rotate})`,
    zIndex,
    pointerEvents,
    ...positionStyles,
  
  };

  return (
    <div style={{ position: 'absolute', width: '98vw', height: '100%', overflow: overflow, zIndex }}>
      <img src={image} alt={alt} style={styles} />
    </div>
  );
};

export default ImageOverlay;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  showOnMobile = true,
  showOnDesktop = true,
  overflow = 'hidden',
  animationSpeed = 25,         // ⏱ Customize speed
  floatIntensity = 10,         // 🔁 How much it floats
  twinkle = true               // ✨ Optional twinkle effect
}) => {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if ((isMobile && !showOnMobile) || (!isMobile && !showOnDesktop)) return null;

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
    <div style={{ position: 'absolute', width: '98vw', height: '100%', overflow, zIndex: -1 }}>
      <motion.img
        src={image}
        alt={alt}
        style={styles}
        animate={{
          y: [0, floatIntensity, 0, -floatIntensity, 0],
          x: [0, floatIntensity / 2, 0, -floatIntensity / 2, 0],
          ...(twinkle && { scale: [1, 1.02, 0.98, 1.01, 1] })
        }}
        transition={{
          duration: animationSpeed,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  );
};

export default ImageOverlay;

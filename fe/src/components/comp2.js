import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';

const Comp2 = ({
  title = "About Us",
  paragraphs = [],
  images = [],
  align = "left",
  reverse = false,
  padding = {
    desktop: "50px",
    mobile: "20px",
  }
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 768;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getTextAlign = () => (reverse ? "right" : "left");

  const getImageStyle = (index) => {
    const styles = [
      { width: "200px", height: "300px", mobileWidth: "100%", mobileHeight: "200px", borderRadius: "90px" },
      { width: "28vw", height: "300px", mobileWidth: "100%", mobileHeight: "200px", borderRadius: "40px" },
      { width: "32vw", height: "300px", mobileWidth: "100%", mobileHeight: "200px", borderRadius: "40px" },
      { width: "33vw", height: "300px", mobileWidth: "100%", mobileHeight: "200px", borderRadius: "50px" },
      { width: "24vw", height: "300px", mobileWidth: "100%", mobileHeight: "200px", borderRadius: "50px" },
    ];
    const style = styles[index] || styles[0];
    return {
      width: isMobile ? style.mobileWidth : style.width,
      height: isMobile ? style.mobileHeight : style.height,
      borderRadius: style.borderRadius,
      objectFit: "cover",
      border: "2px dashed #DF2126",
      display: "block",
      margin: "0 auto",
    };
  };

  // Floating animation variants for images (unchanged)
  const floatingVariants = [
    {
      float: {
        y: [0, -10, 0],
        transition: {
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
          delay: 0
        },
        willChange: 'transform'
      },
      initial: { y: 0 }
    },
    {
      float: {
        y: [0, -15, 0],
        transition: {
          duration: 2.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
          delay: 0.2
        },
        willChange: 'transform'
      },
      initial: { y: 0 }
    },
    {
      float: {
        y: [0, -8, 0],
        transition: {
          duration: 1.8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
          delay: 0.4
        },
        willChange: 'transform'
      },
      initial: { y: 0 }
    },
    {
      float: {
        y: [0, -12, 0],
        transition: {
          duration: 2.2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
          delay: 0.1
        },
        willChange: 'transform'
      },
      initial: { y: 0 }
    },
     {
      float: {
        y: [0, -10, 0],
        transition: {
          duration: 2.3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
          delay: 0.3
        },
        willChange: 'transform'
      },
      initial: { y: 0 }
    },
  ];

  // Text animation variants for "whileInView"
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div style={{
      padding: isMobile ? padding.mobile : padding.desktop,
      fontFamily: "Outfit, sans-serif",
      color: "#333",
    }}>
      {/* Title with motion and whileInView */}
      <motion.h2
        initial="hidden"
        whileInView="visible" // This is the key change!
        viewport={{ once: true, amount: 0.5 }} // Trigger once, when 50% of the element is in view
        variants={textVariants}
        style={{
          color: "#000",
          textAlign: reverse ? "right" : "left",
          fontFamily: "Rowdies, sans-serif",
          fontSize: isMobile ? "28px" : "40px",
          marginBottom: isMobile ? "20px" : "40px",
        }}
      >
        {title}
      </motion.h2>

      {/* Row 1: Text + 2 Images */}
      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : reverse ? "row-reverse" : "row",
        alignItems: "center",
        justifyContent: "start",
        marginBottom: "40px",
        gap: "20px",
      }}>
        {/* Text Column with motion for paragraphs and whileInView */}
        <div style={{
          flex: "1",
          display: "flex",
          justifyContent: reverse ? "flex-end" : "flex-start",
          paddingLeft: reverse && !isMobile ? "20px" : "0",
          paddingRight: !reverse && !isMobile ? "20px" : "0",
        }}>
          <div>
            {paragraphs.map((para, index) => (
              <motion.p
                key={index}
                initial="hidden"
                whileInView="visible" // This is the key change!
                viewport={{ once: true, amount: 0.5 }} // Trigger once, when 50% of the element is in view
                variants={textVariants}
                transition={{ delay: index * 0.1 }} // Staggered animation
                style={{
                  fontSize: isMobile ? "16px" : "20px",
                  textAlign: getTextAlign(),
                  marginBottom: "1.5em",
                  lineHeight: "1.6",
                  fontFamily:"Outfit"
                }}
              >
                {para}
              </motion.p>
            ))}
          </div>
        </div>

        {/* First 2 Images with motion */}
        <div style={{
          flex: "1",
          display: "flex",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          justifyContent:"flex-end"
        }}>
          {images.slice(0, 2).map((img, idx) => {
            const animationVariants = floatingVariants[idx % floatingVariants.length];
            return (
              <motion.div
                key={idx}
                variants={animationVariants}
                initial="initial"
                animate="float" // Images always float, so use animate for continuous loop
              >
                <img
                  src={img.src}
                  alt={`Image ${idx + 1}`}
                  style={getImageStyle(idx)}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Row 2: Remaining 3 Images with motion */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr",
        gap: "20px",
        justifyItems: "center",
        direction: reverse ? "rtl" : "ltr", // mirror image order if reverse
      }}>
        {images.slice(2, 5).map((img, idx) => {
          const animationVariants = floatingVariants[(idx + 2) % floatingVariants.length];
          return (
            <motion.div
              key={idx + 2}
              variants={animationVariants}
              initial="initial"
              animate="float" // Images always float
            >
              <img
                src={img.src}
                alt={`Image ${idx + 3}`}
                style={getImageStyle(idx + 2)}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Comp2;
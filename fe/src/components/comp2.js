import React, { useState, useEffect } from "react";

const Comp2 = ({
  title = "About Us",
  paragraphs = [],
  images = [],
  align = "left",
  reverse = false, // NEW PROP
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

  return (
    <div style={{
      padding: isMobile ? padding.mobile : padding.desktop,
      fontFamily: "Outfit, sans-serif",
      color: "#333",
    }}>
      {/* Title */}
      <h2 style={{
        color: "#000",
        textAlign: reverse ? "right" : "left",
        fontFamily: "Rowdies, sans-serif",
        fontSize: isMobile ? "28px" : "40px",
        marginBottom: isMobile ? "20px" : "40px",
      }}>
        {title}
      </h2>

      {/* Row 1: Text + 2 Images */}
      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : reverse ? "row-reverse" : "row",
        alignItems: "center",
        justifyContent: "start",
        marginBottom: "40px",
        gap: "20px",
      }}>
        {/* Text Column */}
        <div style={{
          flex: "1",
          display: "flex",
          justifyContent: reverse ? "flex-end" : "flex-start",
          paddingLeft: reverse && !isMobile ? "20px" : "0",
          paddingRight: !reverse && !isMobile ? "20px" : "0",
        }}>
          <div>
            {paragraphs.map((para, index) => (
              <p key={index} style={{
                fontSize: isMobile ? "16px" : "20px",
                textAlign: getTextAlign(),
                marginBottom: "1.5em",
                lineHeight: "1.6",
                fontFamily:"Outfit"
              }}>
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* First 2 Images */}
        <div style={{
          flex: "1",
          display: "flex",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          justifyContent:"flex-end"
        }}>
          {images.slice(0, 2).map((img, idx) => (
            <div key={idx}>
              <img
                src={img.src}
                alt={`Image ${idx + 1}`}
                style={getImageStyle(idx)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Remaining 3 Images */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr",
        gap: "20px",
        justifyItems: "center",
        direction: reverse ? "rtl" : "ltr", // mirror image order if reverse
      }}>
        {images.slice(2, 5).map((img, idx) => (
          <div key={idx + 2}>
            <img
              src={img.src}
              alt={`Image ${idx + 3}`}
              style={getImageStyle(idx + 2)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comp2;

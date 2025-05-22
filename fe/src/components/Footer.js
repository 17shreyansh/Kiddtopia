import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import {
  InstagramOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Form } from "./Newsletter";
import Logo from "../assets/logo.png";
import C1 from "../assets/c1.png";
import C2 from "../assets/c2.png";
import C3 from "../assets/c2.png"; // Assuming C3 is also a cloud image

// Import motion from framer-motion
import { motion } from 'framer-motion';

const Cloud = ({ brightness = 1 }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define animation variants for continuous cloud movement
  const cloudVariants = {
    // This state defines the continuous floating and drifting
    float: (custom) => ({
      x: [0, custom.xRange, 0], // Drifts horizontally
      y: [0, custom.yRange, 0], // Subtle vertical bob
      transition: {
        duration: custom.duration, // Animation duration
        ease: "easeInOut",        // Smooth easing
        repeat: Infinity,         // Loop forever
        repeatType: "reverse",    // Play forward then reverse
        delay: custom.delay,      // Stagger clouds with different delays
      },
    }),
  };

  const baseStyle = {
    position: "absolute",
    rotate: "180deg", // Assuming clouds are upside down or for visual effect
    width: isMobile ? "80vw" : "43vw",
    userSelect: "none",
    pointerEvents: "none",
    filter: `brightness(${brightness})`,
  };

  return (
    <>
      {/* Cloud 1 */}
      <motion.img
        src={C1}
        alt="cloud1"
        style={{
          ...baseStyle,
          top: isMobile ? "-6vh" : "-9vh",
          left: isMobile ? "-60vw" : -150,
        }}
        variants={cloudVariants}
        // Use custom prop to define unique animation parameters for each cloud
        custom={{ xRange: "5vw", yRange: "2vh", duration: 40, delay: 0 }} // Reduced range, increased duration
        animate="float" // Apply the float animation
      />
      {/* Cloud 2 */}
      <motion.img
        src={C2}
        alt="cloud2"
        style={{
          ...baseStyle,
          top: isMobile ? "-5vh" : "-9vh",
          left: isMobile ? "10vw" : "27%",
        }}
        variants={cloudVariants}
        custom={{ xRange: "-4vw", yRange: "1.5vh", duration: 45, delay: 5 }} // Reduced range, increased duration, different parameters for variety
        animate="float"
      />
      {/* Cloud 3 */}
      <motion.img
        src={C3}
        alt="cloud3"
        style={{
          ...baseStyle,
          top: isMobile ? "-7vh" : "-10vh",
          right: isMobile ? "-20vw" : -100,
        }}
        variants={cloudVariants}
        custom={{ xRange: "6vw", yRange: "-2.5vh", duration: 42, delay: 10 }} // Reduced range, increased duration, even more variety
        animate="float"
      />
    </>
  );
};

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Parties', path: '/parties' },
  { label: 'Our Services', path: '/services' },
  { label: 'Franchise', path: '/franchise' },
  { label: 'Membership', path: '/membership' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact Us', path: '/contact' },
];

const Footer = () => {
  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    fontFamily: "Poppins, sans-serif",
  };

  const bottomLinkStyle = {
    color: "#000",
    textDecoration: "none",
    marginRight: 10,
  };

  return (
    <div
      style={{
        backgroundColor: "#002B5B",
        color: "#fff",
        position: "relative",
        overflow: "hidden", // Important to clip clouds that move out of bounds
      }}
    >
      {/* Cloud Backgrounds */}
      <Cloud />

      {/* Main Content */}
      <div
        style={{
          padding: "20vw 40px 40px 40px",
        }}
      >
        <Row gutter={[24, 40]} justify="space-between" align="top">
          {/* Logo and Contact */}
          <Col xs={24} md={6} style={{ textAlign: "center", paddingBottom: 20 }}>
            <img
              src={Logo}
              alt="Kiddotopia"
              style={{
                height: 100,
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
            <p
              style={{
                marginTop: 20,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Address and contact
            </p>
            <div style={{ marginTop: 50 }}>
              <p
                style={{
                  fontWeight: "bold",
                  color: "#ffce00",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Follow Us
              </p>
              <div style={{ fontSize: 22 }}>
                <InstagramOutlined style={{ marginRight: 12 }} />
                <FacebookOutlined style={{ marginRight: 12 }} />
                <YoutubeOutlined style={{ marginRight: 12 }} />
                <MailOutlined />
              </div>
            </div>
          </Col>

          {/* Quick Links x2 */}
         {[0, 1].map((colIndex) => (
  <Col
    xs={12}
    md={4}
    key={colIndex}
    style={{
      textAlign: "center",
      marginBottom: 20,
    }}
  >
    <h4
      style={{
        color: "#ffce00",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      Quick Links
    </h4>
    <ul
      style={{
        listStyle: "disc",
        paddingLeft: 20,
        textAlign: "left",
        display: "inline-block",
      }}
    >
      {quickLinks
        .slice(colIndex * Math.ceil(quickLinks.length / 2), (colIndex + 1) * Math.ceil(quickLinks.length / 2))
        .map((link, i) => (
          <li key={i}>
            <Link to={link.path} style={linkStyle}>
              {link.label}
            </Link>
          </li>
        ))}
    </ul>
  </Col>
))}

          {/* Newsletter */}
          <Col xs={24} md={8} style={{ textAlign: "center" }}>
            <Form textColor="white" />
          </Col>
        </Row>
      </div>

      {/* Bottom Strip */}
      <div
        style={{
          backgroundColor: "#D9D9D9",
          textAlign: "center",
          padding: "5px 0",
          fontSize: 10,
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Link to="/terms-and-conditions" style={bottomLinkStyle}>
          Terms and Conditions
        </Link>{" "}
        |{" "}
        <Link to="/privacy-policy" style={{ ...bottomLinkStyle, marginLeft: 10 }}>
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};

export default Footer;
export { Cloud };
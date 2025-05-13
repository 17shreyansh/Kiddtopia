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
import C3 from "../assets/c2.png";

const Cloud = ({ brightness = 1 }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const baseStyle = {
    position: "absolute",
    rotate: "180deg",
    width: isMobile ? "80vw" : "43vw",
    userSelect: "none",
    pointerEvents: "none",
    filter: `brightness(${brightness})`,
    
  };

  return (
    <>
      <img  
        src={C1}
        alt="cloud1"
        style={{
          ...baseStyle,
          top: isMobile ? "-6vh" : "-9vh",
          left: isMobile ? "-60vw" : -150,
        }}
      />
      <img
        src={C2}
        alt="cloud2"
        style={{
          ...baseStyle,
          top: isMobile ? "-5vh" : "-9vh",
          left: isMobile ? "10vw" : "27%",
        }}
      />
      <img
        src={C3}
        alt="cloud3"
        style={{
          ...baseStyle,
          top: isMobile ? "-7vh" : "-10vh",
          right: isMobile ? "-20vw" : -100,
        }}
      />
    </>
  );
};



const Footer = () => {
  return (
    <div
      style={{
        backgroundColor: "#002B5B",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
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
          {[1, 2].map((_, index) => (
            <Col
              xs={12}
              md={4}
              key={index}
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
                <li>
                  <Link to="/" style={linkStyle}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/story" style={linkStyle}>
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link to="/products" style={linkStyle}>
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/standards" style={linkStyle}>
                    Our Standards
                  </Link>
                </li>
                <li>
                  <Link to="/contact" style={linkStyle}>
                    Contact Us
                  </Link>
                </li>
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
        <Link to="/contact" style={bottomLinkStyle}>
          Contact Us
        </Link>{" "}
        |{" "}
        <Link to="/privacy" style={{ ...bottomLinkStyle, marginLeft: 10 }}>
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};

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

export default Footer;
export { Cloud };

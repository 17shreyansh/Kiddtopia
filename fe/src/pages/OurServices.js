import React, { useState, useEffect, useMemo } from "react";
import { TopSection } from "./About";
import Wave from "../components/Wave2";
import axios from "axios";

const Card = ({ title, description, isMobile, image }) => {
  const cardStyles = {
    width: isMobile ? "45vw" : "40vw",
    aspectRatio: "3 / 4",
    border: "2px dashed #f87171",
    borderRadius: "40px",
    padding: isMobile ? "6px" : "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box",
    backgroundColor: "#fff",
  };

  const headerStyles = {
    margin: "12px 0 8px 0",
    fontSize: isMobile ? "12px" : "20px",
  };

  const paragraphStyles = {
    fontSize: isMobile ? "12px" : "22px",
    color: "#555",
    fontFamily: "Outfit",
  };

  const buttonStyles = {
    margin: "20px auto",
    fontSize: isMobile ? "12px" : "16px",
  };

  return (
    <div style={cardStyles}>
      <div
        style={{
          height: "50%",
          border: "1px dashed #00000040",
          borderRadius: "30px",
          background: `url(${image}) no-repeat center center`,
          backgroundSize: "cover",
        }}
      />
      <div>
        <h2 style={headerStyles}>{title}</h2>
        <p style={paragraphStyles}>{description}</p>
      </div>
      <button className="btn" style={buttonStyles}>
        Call Now
      </button>
    </div>
  );
};

const Service = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [services, setServices] = useState([]);
  const [heading, setHeading] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/services`)
      .then((res) => {
        if (res.data) {
          setHeading(res.data.heading || res.data.topHeading || "");
          setServices(res.data.services || []);
        }
      })
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  // Split services into two arrays: first 8 and the rest
  const firstEightServices = useMemo(() => services.slice(0, 8), [services]);
  const remainingServices = useMemo(() => services.slice(8), [services]);

  const renderCards = (serviceArray) =>
    serviceArray.map((card) => (
      <Card
        key={card._id}
        title={card.title}
        description={card.description}
        isMobile={isMobile}
        image={`${card.image.src}`}
      />
    ));

  return (
    <>
      <TopSection heading={"Our Services"} >
        <h2 style={{ fontSize: isMobile ? "20px" : "40px",color: '#DF2126' }}>{heading}</h2>
      </TopSection>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: isMobile ? "8px" : "16px",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {renderCards(firstEightServices)}
          </div>
        )}
      </div>

      <Wave />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: isMobile ? "8px" : "16px",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          {renderCards(remainingServices)}
        </div>
      </div>
    </>
  );
};

export default Service;

import React, { useEffect, useState } from "react";
import { Typography, Row, Col } from "antd";
import axios from "axios";

const { Title } = Typography;

const Partners = () => {
  const [logos, setLogos] = useState([]);

useEffect(() => {
  const fetchPartnerLogos = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/home/Our Partners`);
      const content = response?.data?.content;

      if (response?.data?.success && Array.isArray(content?.images)) {
        setLogos(content.images);
      } else {
        setLogos([]); // fallback if images array is missing
      }
    } catch (error) {
      console.error("Error fetching partner logos:", error);
      setLogos([]); // handle error fallback
    }
  };

  fetchPartnerLogos();
}, []);


  return (
    <div style={{ padding: "50px" }}>
      <Title
        level={2}
        style={{
          color: "#1B71C4",
          fontWeight: "bold",
          textAlign: "center",
          fontFamily: "Rowdies",
          fontSize: "40px"
        }}
      >
        Our Partners
      </Title>

   <Row gutter={[24, 24]} justify="center" style={{ marginTop: 30 }}>
  {Array.isArray(logos) && logos.length > 0 ? (
    logos.map((logo, index) => (
      <Col key={index} xs={12} sm={8} md={6} lg={4}>
        <div
          style={{
            width: "100%",
            aspectRatio: "1",
            borderRadius: 10,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
          }}
        >
          <img
            src={`http://localhost:5000/uploads/${logo}`}
            alt={`Partner ${index + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        </div>
      </Col>
    ))
  ) : (
    <Col span={24} style={{ textAlign: "center" }}>
      <p>No partner logos available.</p>
    </Col>
  )}
</Row>

    </div>
  );
};

export default Partners;

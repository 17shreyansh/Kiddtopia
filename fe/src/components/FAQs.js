import React, { useEffect, useState } from "react";
import { Typography, Row, Col } from "antd";
import axios from "axios";

const FAQs = () => {
  const [faqItems, setFaqItems] = useState([]);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/home/FAQs`);
        if (response.data.success) {
          const faqs = response.data.content.faqs.map((faq) => ({
            title: faq.title,
            content: faq.content.split("\n").filter(Boolean) // Split on newlines, remove empty lines
          }));
          setFaqItems(faqs);
        }
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      }
    };

    fetchFAQs();
  }, []);

  return (
    <div style={{ padding: "40px 20px" }}>
      <h1 className="title">FAQs</h1>
      <Row gutter={[24, 24]} justify="center">
        {faqItems.map((item, index) => (
          <Col xs={24} md={10} key={index}>
            <div
              style={{
                border: "2px dashed #f88",
                borderRadius: 12,
                padding: 20,
                backgroundColor: "#fff",
                minHeight: 160,
              }}
            >
              <strong
                style={{
                  display: "block",
                  marginBottom: 12,
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#333",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {item.title}
              </strong>
              {item.content.map((line, idx) => (
                <p
                  key={idx}
                  style={{
                    marginBottom: 6,
                    fontSize: "16px",
                    fontWeight: "400",
                    color: "#555",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FAQs;

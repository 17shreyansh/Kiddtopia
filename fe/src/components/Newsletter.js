import React, { useState } from "react";
import { Row, Col, Input, Spin, Button, Result } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const Form = ({ textColor }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setEmail('');
        setSubmitted(true);
      } else {
        // Fallback error UI if you want to display something
        alert(data.message || "Subscription failed.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Result
        icon={<SmileOutlined style={{ color: "#ff4d4f" }} />}
        title={<h2 style={{ color: "#ff4d4f", fontSize: "28px" }}>Thank You for Subscribing!</h2>}
        subTitle={<p style={{ fontSize: '18px', fontFamily: 'Outfit, sans-serif' }}>
          You've been successfully subscribed to our newsletter.
        </p>}
        extra={
          <Button
            onClick={() => setSubmitted(false)}
            style={{
              backgroundColor: '#ff814a',
              borderColor: '#ff814a',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: 20,
              fontSize: '16px',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            Subscribe Another Email
          </Button>
        }
      />
    );
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
      }}
    >
      <p
        className="newsletter-sub"
        style={{ color: textColor }}
      >
        Subscribe to our Newsletter
      </p>
      <Spin spinning={loading}>
        <Input
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="newsletter-input"
          style={{ marginBottom: 12, width: 300, borderRadius: 6 }}
        />
        <br />
        <button
          className="btn"
          onClick={handleSubscribe}
          disabled={loading}
        >
          Subscribe Now
        </button>
      </Spin>
    </motion.div>
  );
};

const Newsletter = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.18, when: "beforeChildren" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90 } }
  };

  return (
    <motion.div
      className="newsletter-section"
      style={{
        padding: "50px 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      variants={containerVariants}
    >
      <Row align="middle" justify="center" gutter={[24, 24]} style={{ width: "100%" }}>
        <Col xs={24} md={24} style={{ textAlign: "center" }}>
          <motion.h1 className="title" variants={itemVariants}>
            Join the Party!
          </motion.h1>
        </Col>

        <Col xs={24} md={12} style={{ textAlign: "center" }}>
          <motion.h2 className="promo-text" variants={itemVariants}>
            Get 10% off your <br /> first party booking
          </motion.h2>
        </Col>

        <Col xs={0} md={1}>
          <motion.div className="divider" variants={itemVariants} />
        </Col>

        <Col xs={24} md={10} style={{ textAlign: "center" }}>
          <Form textColor="#0066cc" />
        </Col>
      </Row>
    </motion.div>
  );
};

export default Newsletter;
export { Form };

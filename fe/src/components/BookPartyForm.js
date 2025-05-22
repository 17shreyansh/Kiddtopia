import React, { useRef, useEffect, useState } from 'react';
import { Row, Col, Typography, Form, Input, Button, Divider, Space, Result } from 'antd'; // Added Result
import { SmileOutlined } from '@ant-design/icons'; // Added SmileOutlined
import { motion, useInView } from 'framer-motion';
import celebrateIcon from '../assets/icons/celebrate.svg';
import magicIcon from '../assets/icons/magic.svg';
import trustIcon from '../assets/icons/trust.svg';
import readyIcon from '../assets/icons/ready.svg';
import './BookPartyNow.css';

const { Title, Text } = Typography;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.5,
    },
  },
};

const formVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeInOut', delay: 0.2 } },
};

const infoVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeInOut', delay: 0.4 } },
};

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut', delay: 0.1 } },
};

const BookPartyNow = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false); // State to control thank you message visibility

  useEffect(() => {
    if (!isInView && ref.current) {
      ref.current.style.opacity = '0';
      ref.current.style.transform = 'translateY(-20px)';
    }
  }, [isInView]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.success) {
        setShowThankYou(true); // Show the thank you message
        form.resetFields();
        // Optionally, hide the thank you message after a few seconds
        setTimeout(() => setShowThankYou(false), 5000); // Hides after 5 seconds
      } else {
        // You can still use a simple alert for errors if you don't want to display them inline
        alert(data.message || 'Failed to submit booking. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      ref={ref}
      className="book-party-wrapper"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <motion.h1
        className="title"
        variants={titleVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        Book A Party Now
      </motion.h1>

      <Row justify="center" align="middle" gutter={[0, 32]}>
        {/* Left Column: Form or Thank You Message */}
        <Col xs={24} md={12}>
          <motion.div
            className="form-container" // Keep existing form-container styling
            variants={formVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {showThankYou ? (
              <Result
                icon={<SmileOutlined style={{ color: '#ff814a' }} />} 
                title={<h2 style={{ color: '#ff814a', fontSize: '32px' }}>Thank You for Your Booking!</h2>}
                subTitle={
                  <p style={{ fontSize: '18px', fontFamily: 'Outfit, sans-serif' }}>
                    We've received your request and will contact you very soon to confirm the details.
                  </p>
                }
                extra={
                  <Button
                    type="primary"
                    onClick={() => setShowThankYou(false)} // Allows users to resubmit if they want
                    style={{
                      backgroundColor: '#ff814a',
                      borderColor: '#ff814a',
                      fontWeight: 'bold',
                      borderRadius: 20,
                      fontSize: '16px',
                      fontFamily: 'Outfit, sans-serif',
                    }}
                  >
                    Book Another Party
                  </Button>
                }
              />
            ) : (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
              >
                <Form.Item
                  name="fullName"
                  rules={[
                    { required: true, message: 'Please enter your name' },
                    { min: 2, message: 'Name must be at least 2 characters' }
                  ]}
                >
                  <Input size="large" placeholder="Full Name" className="custom-input" />
                </Form.Item>

                <Form.Item
                  name="mobile"
                  rules={[
                    { required: true, message: 'Please enter your mobile number' },
                    { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number' }
                  ]}
                >
                  <Input size="large" placeholder="Mobile Number" className="custom-input" />
                </Form.Item>

                <Form.Item
                  name="booking"
                  rules={[
                    { required: true, message: 'Please type your booking (e.g., Birthday Party)' },
                    { min: 3, message: 'Booking type must be at least 3 characters' }
                  ]}
                >
                  <Input size="large" placeholder="Booking For (e.g., Birthday Party)" className="custom-input" />
                </Form.Item>

                <Form.Item>
                  <button
                    htmlType="submit"
                    loading={loading}
                    className="btn"
                    style={{ display: 'block', margin: '0 auto' }}
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </Form.Item>
              </Form>
            )}
          </motion.div>
        </Col>

        {/* Divider */}
        <Col xs={0} md={1}>
          <Divider type="vertical" style={{ height: '300px', borderColor: 'lightgray' }} />
        </Col>

        {/* Right Column: Info */}
        <Col xs={24} md={11}>
          <motion.div
            variants={infoVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div className="info-item">
                <motion.img
                  src={celebrateIcon}
                  alt="celebrate"
                  className="info-icon"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    duration: 0.3,
                  }}
                  initial={{ opacity: 0, scale: 1, rotate: 0 }}
                  animate={
                    isInView
                      ? { opacity: 1, scale: 1.2, rotate: 10 }
                      : { opacity: 0, scale: 1, rotate: 0 }
                  }
                />
                <Text strong className="info-text">
                  Celebrate Big at Kiddtopia!
                </Text>
              </div>

              <div className="info-item">
                <motion.img
                  src={magicIcon}
                  alt="magic"
                  className="info-icon"
                  whileHover={{ scale: 1.2, y: -5 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    duration: 0.3,
                  }}
                  initial={{ opacity: 0, scale: 1, y: 0 }}
                  animate={
                    isInView ? { opacity: 1, scale: 1.2, y: -5 } : { opacity: 0, scale: 1, y: 0 }
                  }
                />
                <Text className="info-text">
                  Magical themes, VR games, yummy food & unforgettable fun — all in
                  one place!
                </Text>
              </div>

              <div className="info-item">
                <motion.img
                  src={trustIcon}
                  alt="trust"
                  className="info-icon"
                  whileHover={{ scale: 1.2, rotate: -10 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    duration: 0.3,
                  }}
                  initial={{ opacity: 0, scale: 1, rotate: 0 }}
                  animate={
                    isInView
                      ? { opacity: 1, scale: 1.2, rotate: -10 }
                      : { opacity: 0, scale: 1, rotate: 0 }
                  }
                />
                <Text className="info-text">
                  Trusted by 500+ families across Noida & Delhi.
                </Text>
              </div>

              <div className="info-item">
                <motion.img
                  src={readyIcon}
                  alt="ready"
                  className="info-icon"
                  whileHover={{ scale: 1.2, y: 5 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    duration: 0.3,
                  }}
                  initial={{ opacity: 0, scale: 1, y: 0 }}
                  animate={
                    isInView ? { opacity: 1, scale: 1.2, y: 5 } : { opacity: 0, scale: 1, y: 0 }
                  }
                />
                <Text italic className="info-text">
                  Ready to party? BOOK NOW
                </Text>
              </div>
            </Space>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
};

export default BookPartyNow;
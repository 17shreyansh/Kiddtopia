import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Row, Col } from 'antd';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/home/Why%20Choose%20Us`);
        if (response.data.success) {
          setImages(response.data.content.images);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, []);

  // Use numbers for rotation in degrees
  const rotations = [-10, 15, 20, 0];
  const tops = ['20px', '40px', '0px', '0px'];

  // Animation variants for smooth and narrative effect
  const itemVariants = (finalRotation) => ({
    hidden: { opacity: 0, y: 40, rotate: 0 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: finalRotation,
      transition: { type: "spring", stiffness: 80, damping: 10 }
    }
  });

  return (
    <div className="why-wrapper">
      <motion.h1
        className="title"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        Why Choose Us?
      </motion.h1>
      <div className="butterfly-path-container">
        <Row justify="center" gutter={[16, 16]}>
          {images.map((img, index) => (
            <Col xs={12} sm={6} key={index}>
              <motion.div
                className="why-image-box"
                style={{
                  top: tops[index] || '0px',
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={itemVariants(rotations[index] || 0)}
              >
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${img}`}
                  alt={`why-${index + 1}`}
                  className={`why-image${index + 1}`}
                  style={{ width: '100%' }}
                />
              </motion.div>
            </Col>
          ))}
        </Row>
        <div className="butterfly-path-overlay" />
      </div>
    </div>
  );
};

export default WhyChooseUs;

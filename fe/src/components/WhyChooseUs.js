import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col } from 'antd';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('/api/home/Why%20Choose%20Us');
        if (response.data.success) {
          setImages(response.data.content.images);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const rotations = ['-10deg', '15deg', '20deg', '0deg'];
  const tops = ['20px', '40px', '0px', '0px'];

  return (
    <div className="why-wrapper">
      <h1 className="title">Why Choose Us?</h1>
      <div className="butterfly-path-container">
        <Row justify="center" gutter={[16, 16]}>
          {images.map((img, index) => (
            <Col xs={12} sm={6} key={index}>
              <div
                className="why-image-box"
                style={{
                  transform: `rotate(${rotations[index] || '0deg'})`,
                  top: tops[index] || '0px',
                }}
              >
                <img
                  src={`http://localhost:5000/uploads/${img}`}
                  alt={`why-${index + 1}`}
                  className={`why-image${index + 1}`}
                />
              </div>
            </Col>
          ))}
        </Row>
        <div className="butterfly-path-overlay" />
      </div>
    </div>
  );
};

export default WhyChooseUs;

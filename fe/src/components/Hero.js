import React from 'react';
import { Button, Row, Col } from 'antd';
import './HeroSection.css';
import Hero from '../assets/Hero.png';
import GoogleReviewCard from './GoogleReviewCard';

const sampleReview = "We visited this place to attend a birthday party. This place is beautifully done & has all the required stuff to make your kids have a great time. Their playzone is spacious & well maintained. Their games are new & a lot of interactive games are also available. They host birthday parties as well as other occasions. The food options are also very good. Overall we had a great time with our kids here. ";


const HeroSection = () => {
  return (
    <div className="hero-section" style={{ backgroundImage: `url(${Hero})` }}>
      <div className="hero-overlay">
        <div className="hero-content">
          <Row justify="center">
            <Col xs={24} md={20} lg={16}>
              <div className="box1">
                <p className="hero-services">Our Popular Services</p>
                <div className="hero-tags">
                  <span>Birthday Bash | School Tour | Poolside Seating</span>
                </div>
              </div>
            </Col>
          </Row>

          <Row justify="end">
            <Col xs={24} sm={24} md={20} lg={10}>
              <div className="box2">
                <h1 className="hero-title">
                  Welcome to <br />
                  <span>Kiddtopia</span>
                </h1>
                <p className="hero-subtitle">
                  "Service to sab dete hain par hum yaadein banatein hain"
                </p>
                <button className="hero-button btn">Book Now</button>

                <GoogleReviewCard
                  name="John Doe"
                  rating={4.5}
                  review={sampleReview}
                  className="hero-review-card"
                  hideOnSmallScreen="yes"
                />

                
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

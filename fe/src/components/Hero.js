import React from 'react';
import { Button, Row, Col } from 'antd';
import { motion, useScroll, useTransform } from 'framer-motion';
import './HeroSection.css';
import Hero from '../assets/Hero.png';
import GoogleReviewCard from './GoogleReviewCard';

const sampleReview = "We visited this place to attend a birthday party. This place is beautifully done & has all the required stuff to make your kids have a great time. Their playzone is spacious & well maintained. Their games are new & a lot of interactive games are also available. They host birthday parties as well as other occasions. The food options are also very good. Overall we had a great time with our kids here. ";

const HeroSection = () => {
  const { scrollYProgress } = useScroll();

  // More pronounced parallax effect for the background image
const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '300%']);

  

  // Animation for the title
  const titleVariants = {
    hidden: { opacity: 0, y: 70 }, // Increased starting y
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeInOut" } }, // Slightly longer duration
  };

  // Animation for the subtitle
  const subtitleVariants = {
    hidden: { opacity: 0, x: -70 }, // Increased starting x
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeInOut", delay: 0.3 } },
  };

  // Animation for box1
  const box1Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeInOut" } },
  };

  return (
    <div className="hero-section" style={{ backgroundImage: `url(${Hero})` }}>
      <motion.div
        className="hero-overlay"
        style={{
          y: backgroundY, // Apply the parallax effect here
        }}
      >
        <div className="hero-content">
          <Row justify="center">
            <Col xs={24} md={20} lg={16}>
              <motion.div
                className="box1"
                variants={box1Variants}
                initial="hidden"
                animate="visible"
              >
                <p className="hero-services">Our Popular Services</p>
                <div className="hero-tags">
                  <span>Birthday Bash | School Tour | Poolside Seating</span>
                </div>
              </motion.div>
            </Col>
          </Row>

          <Row justify="end">
            <Col xs={24} sm={24} md={20} lg={10}>
              <div className="box2">
                <motion.h1
                  className="hero-title"
                  variants={titleVariants}
                  initial="hidden"
                  animate="visible"
                >
                  Welcome to <br />
                  <span>Kiddtopia</span>
                </motion.h1>
                <motion.p
                  className="hero-subtitle"
                  variants={subtitleVariants}
                  initial="hidden"
                  animate="visible"
                >
                  "Service to sab dete hain par hum yaadein banatein hain"
                </motion.p>
                <Button className="hero-button btn">
                  Book Now
                </Button>
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
      </motion.div>
    </div>
  );
};

export default HeroSection;

import React, { useEffect, useState } from 'react';
import { Typography, Row, Col } from 'antd';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

const leftVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 70, damping: 16, staggerChildren: 0.18 }
  }
};

const rightVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 70, damping: 16, staggerChildren: 0.18 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 90 }
  }
};

const KiddtopiaComponent = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div
      style={{
        padding: isMobile ? '20px 10px' : '40px 100px',
        fontFamily: 'Rowdies',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
    >
      <Row gutter={[0, 32]} justify='space-between' align="middle" style={{ width: '100%' }}>
        {/* Left Section */}
        <Col xs={24} md={10}>
          <motion.div variants={leftVariants}>
            <motion.div variants={itemVariants}>
              <Title level={2} style={{
                color: '#ff6f61',
                marginBottom: 0,
                fontFamily: 'Rowdies',
                fontSize: '36px'
              }}>
                Kiddtopia isn’t just a<br />
                play zone
              </Title>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Paragraph style={{
                fontSize: '22px',
                color: '#4a6cd4',
                fontWeight: 600,
                marginTop: 16,
                fontFamily: 'Rowdies'
              }}>
                It’s a world of excitement, joy,<br />
                and unforgettable memories!
              </Paragraph>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Paragraph style={{
                fontWeight: 700,
                fontSize: '18px',
                fontFamily: 'Rowdies'
              }}>
                VR Adventures,{" "}
                Themed Birthday Parties,{" "}
                Swimming + Go-Karting,{" "}
                Soft Role-Play Zones
              </Paragraph>
            </motion.div>
          </motion.div>
        </Col>

        {/* Right Section */}
        <Col xs={24} md={10}>
          <motion.div variants={rightVariants}>
            <motion.div variants={itemVariants}>
              <Title level={5} style={{
                marginBottom: 12,
                fontFamily: 'Poppins',
                fontSize: '20px'
              }}>
                Now a little bit description about all
              </Title>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Paragraph style={{
                marginBottom: 12,
                fontFamily: 'Poppins',
                fontSize: '18px',
                fontWeight: 500
              }}>
                VR Adventures – First in town with high-tech, immersive Virtual Reality games.<br />
                Themed Birthday Parties – From Superheroes to Princesses - we create magical moments.<br />
                Swimming + Go-Karting – A perfect mix of thrill and chill.<br />
                Soft Role-Play Zones – Safe, engaging environments for children.<br />
                (I will give image, so make only frame right now)
              </Paragraph>
            </motion.div>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
};

export default KiddtopiaComponent;

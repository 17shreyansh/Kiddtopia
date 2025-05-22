import React, { useEffect, useRef } from 'react';
import { Typography } from 'antd';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import './OurServices.css';

import birthdayIcon from '../assets/icons/v1.svg';
import kittyPartyIcon from '../assets/icons/v2.svg';
import vrGameIcon from '../assets/icons/v3.svg';
import restaurantIcon from '../assets/icons/v4.svg';
import poolsideIcon from '../assets/icons/v5.svg';
import babyShowerIcon from '../assets/icons/v6.svg';
import namingIcon from '../assets/icons/v7.svg';
import coupleIcon from '../assets/icons/v8.svg';
import schoolTourIcon from '../assets/icons/v9.svg';

import e1 from '../assets/Ellipse/e1.svg';
import e2 from '../assets/Ellipse/e2.svg';
import e3 from '../assets/Ellipse/e3.svg';
import e4 from '../assets/Ellipse/e4.svg';
import e5 from '../assets/Ellipse/e5.svg';
import e6 from '../assets/Ellipse/e6.svg';
import e7 from '../assets/Ellipse/e7.svg';
import e8 from '../assets/Ellipse/e8.svg';
import e9 from '../assets/Ellipse/e9.svg';

const { Title, Text } = Typography;

const ServiceCard = ({ icon, title, back, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false }); // Ensure animation plays every time

  // Variants for individual card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 + (index * 10) }, // Staggered initial y position
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17,
        delay: 0.2 + (index * 0.1), // Staggered delay
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className="service-card"
      whileHover={{ scale: 1.08,  }} // Increased scale on hover
      whileTap={{ scale: 0.92 }}    // Increased scale down on tap
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"} // Use isInView to trigger animation
    >
      <div
        className="service-icon-wrapper"
        style={{ backgroundImage: back }}
      >
        <img src={icon} alt={title} className="service-icon" />
      </div>
      <Text strong className="service-title">
        {title}
      </Text>
    </motion.div>
  );
};

const OurServices = () => {
  const services = [
    { icon: birthdayIcon, title: 'Birthday Bash', back: `url(${e1})` },
    { icon: kittyPartyIcon, title: 'Kitty Party & Corporate Events', back: `url(${e2})` },
    { icon: vrGameIcon, title: 'VR and Arcade Game', back: `url(${e3})` },
    { icon: restaurantIcon, title: 'Restaurant Services', back: `url(${e4})` },
    { icon: poolsideIcon, title: 'Poolside Gazebo Seating', back: `url(${e5})` },
    { icon: babyShowerIcon, title: 'Baby Shower', back: `url(${e6})` },
    { icon: namingIcon, title: 'Naming Ceremony', back: `url(${e7})` },
    { icon: coupleIcon, title: 'Couple Anniversary', back: `url(${e8})` },
    { icon: schoolTourIcon, title: 'School Tour', back: `url(${e9})` },
  ];

  const ref = useRef(null);
    const isInView = useInView(ref, { once: false });

  const renderWithDividers = (list) =>
    list.flatMap((service, index) => [
      <ServiceCard key={index} {...service} index={index}/>,
      index < list.length - 1 ? <div key={`divider-${index}`} className="divider" /> : null,
    ]);

  return (
    <div className="our-services-wrapper">
      <motion.h1
        ref={ref}
        className="title"
        initial={{ opacity: 0, y: -40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {opacity: 0, y: -40}}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Our Services
      </motion.h1>
      <motion.div
        className="our-services-grid"
        initial="hidden"
        animate={isInView ? "visible": "hidden"}
        transition={{ delayChildren: 0.4, staggerChildren: 0.2 }} // Staggered appearance of cards
      >
        <AnimatePresence>
        {renderWithDividers(services)}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default OurServices;

import React from 'react';
import { Typography } from 'antd';
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

const ServiceCard = ({ icon, title, back }) => (
  <div className="service-card">
    <div
      className="service-icon-wrapper"
      style={{ backgroundImage: back }}
    >
      <img src={icon} alt={title} className="service-icon" />
    </div>
    <Text strong className="service-title">
      {title}
    </Text>
  </div>
);

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

  const renderWithDividers = (list) =>
    list.flatMap((service, index) => [
      <ServiceCard key={index} {...service} />,
      index < list.length - 1 ? <div key={`divider-${index}`} className="divider" /> : null,
    ]);

  return (
    <div className="our-services-wrapper">
      <h1 className="title">
        Our Services
      </h1>
      <div className="our-services-grid">{renderWithDividers(services)}</div>
    </div>
  );
};

export default OurServices;

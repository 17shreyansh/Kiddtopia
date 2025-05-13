import React, { useState, useEffect } from 'react';
import { Menu, Dropdown } from 'antd';
import { DownOutlined, MenuOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import Logo from '../assets/logo.png';

const menuItems = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Parties', path: '/parties' },
  { label: 'Our Services', path: '/services' },
  { label: 'Franchise', path: '/franchise' },
  { label: 'Membership', path: '/membership' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact Us', path: '/contact' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="navbar">
      <div className="logo">
        <img src={Logo} alt="Kiddotopia" />
      </div>

      <div className="center-links">
        {menuItems.slice(0, 6).map((item) => (
          <Link className="nav-link" to={item.path} key={item.label}>
            {item.label}
          </Link>
        ))}
        <Dropdown
          menu={{
            items: menuItems.slice(6).map((item) => ({
              key: item.label,
              label: <Link to={item.path}>{item.label}</Link>,
            })),
          }}
        >
          <span className="nav-link more">
            More <DownOutlined />
          </span>
        </Dropdown>
      </div>

      <div className="mobile-menu-icon">
        <Dropdown
          menu={{
            items: menuItems.map((item) => ({
              key: item.label,
              label: <Link to={item.path}>{item.label}</Link>,
            })),
          }}
          trigger={['click']}
          open={mobileOpen}
          onOpenChange={setMobileOpen}
        >
          <MenuOutlined />
        </Dropdown>
      </div>

      {/* Hide Call Now on mobile */}
      {!isMobile && <button className="btn">Call Now</button>}
    </div>
  );
};

export default Navbar;

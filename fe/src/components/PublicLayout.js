// components/PublicLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ImageOverlay from './Stars';

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <ImageOverlay top="20%" left="10%" rotate="0deg" mirror={false} width="20vw" zIndex={0} overflow="visible" />
      <ImageOverlay top="27%" left="71%" rotate="80deg" mirror={false} width="25vw" zIndex={0} overflow="visible" />
      <ImageOverlay top="60%" left="70%" rotate="0deg" mirror={false} width="20vw" zIndex={0} overflow="visible" />
      <ImageOverlay top="50%" left="0%" rotate="90deg" mirror={false} width="25vw" zIndex={0} overflow="visible" />
      <ImageOverlay top="80%" left="65%" rotate="135deg" mirror={false} width="25vw" zIndex={0} overflow="visible" />
      <ImageOverlay top="92%" left="5%" rotate="180deg" mirror={false} width="30vw" zIndex={0} overflow="visible" /> 
      <Outlet />
      <Footer />
    </>
  );
};

export default PublicLayout;

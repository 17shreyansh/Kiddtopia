import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import axios from 'axios';
import { Cloud } from '../components/Footer';
import AboutUs from '../components/About';
import WaveFeatureBar from '../components/WaveFeatureBar';
import ImageOverlay from '../components/Stars';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || '';

const TopSection = ({ heading, children }) => {
  const [fontSize, setFontSize] = useState('3rem');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) setFontSize('1.5rem');
      else if (width < 768) setFontSize('2rem');
      else setFontSize('3rem');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ position: 'relative', height: '50vh', marginTop: '64px', overflow: 'hidden' }}>
      <ImageOverlay
        alt="Decorative overlay left"
        top="25%"
        left="15%"
        rotate="0deg"
        mirror={false}
        width="50vh"
        zIndex={0}
        overflow="visible"
      />
      <ImageOverlay
        alt="Decorative overlay right"
        top="25%"
        right="15%"
        rotate="0deg"
        mirror={true}
        width="50vh"
        zIndex={0}
        showOnMobile={false}
        overflow="visible"
      />
      <div style={{ position: 'relative', overflow: 'hidden', height: '100%' }}>
        <Cloud brightness={2} />
      </div>
      {heading && (
        <h1
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            fontSize: fontSize,
            zIndex: 5,
          }}
        >
          {heading}
        </h1>
      )}
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          width: '80%',
          zIndex: 5,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
};

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getAboutData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/about`);
      setAboutData(res.data);
    } catch (error) {
      console.error('Failed to fetch about data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAboutData();
  }, []);

  const getImageUrl = (src) => {
    if (!src) return '';
    if (src.startsWith('http')) return src;
    return `${BASE_URL}${src}`;
  };

  if (loading || !aboutData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ overflow: 'hidden' }}>
      <TopSection heading={aboutData.heading} />

      <ImageOverlay
        alt="Decorative overlay bottom left"
        top="70%"
        left="-10%"
        rotate="-20deg"
        mirror={false}
        width="30vw"
        zIndex={0}
      />

      <h2 style={{ textAlign: 'center', fontSize: isMobile ? '25px' : '40px', marginBottom: '20px' }}>
        {aboutData.mainTitle}
      </h2>

      <AboutUs
        title=""
        paragraphs={aboutData?.firstSection?.paragraphs || []}
        images={(aboutData?.firstSection?.images || []).map((image) => ({
          ...image,
          src: getImageUrl(image.src),
        }))}
        reverse={false}
        align="left"
      />

      <ImageOverlay
        alt="Decorative overlay mid right"
        top="55%"
        left="80%"
        rotate="-20deg"
        mirror={false}
        width="30vw"
        zIndex={0}
      />

      <WaveFeatureBar />

      <AboutUs
        title=""
        paragraphs={aboutData?.secondSection?.paragraphs || []}
        images={(aboutData?.secondSection?.images || []).map((image) => ({
          ...image,
          src: getImageUrl(image.src),
        }))}
        reverse={true}
        align="left"
      />
    </div>
  );
};

export default About;
export { TopSection };

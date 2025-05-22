import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeroSection from '../components/Hero';
import AboutUs from '../components/About';
import ServicesComponent from '../components/OurServices';
import BookPartyForm from '../components/BookPartyForm';
import WhyChooseUs from '../components/WhyChooseUs';
import KiddtopiaComponent from '../components/comp1';
import FranchiseOpportunity from '../components/FranchiseOpportunity';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import Partners from '../components/Partners';
import FAQs from '../components/FAQs';
import Newsletter from '../components/Newsletter';
import ImageOverlay from '../components/Stars';


const Home = () => {
  const [aboutData, setAboutData] = useState({
    paragraphs: [],
    images: [],
  });

 useEffect(() => {
  axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/home/About Us`)
    .then(res => {
      if (res.data.success && res.data.content) {
        const paragraphs = res.data.content.paragraphs || [];
        const images = (res.data.content.images || []).map((imgName, idx) => ({
          src: `${process.env.REACT_APP_BACKEND_URL}/uploads/${imgName}`,
        }));
        setAboutData({ paragraphs, images });
      }
    })
    .catch(err => console.error("Error fetching About Us data:", err));
}, []);


  return (
    <div style={{ overflow: "hidden" }}>
      

      <HeroSection />

      <AboutUs
        title="About Us"
        paragraphs={aboutData.paragraphs}
        images={aboutData.images}
        reverse={false}
        align="left"
      />

      <ServicesComponent />
      <BookPartyForm />
      <WhyChooseUs />
      <KiddtopiaComponent />
      <FranchiseOpportunity />
      <Gallery />
      <Testimonials />
      <Partners />
      <FAQs />
      <Newsletter />
    </div>
  );
};

export default Home;

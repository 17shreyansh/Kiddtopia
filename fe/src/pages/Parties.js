import React, { useState, useEffect } from 'react';
import { TopSection } from './About';
import Comp2 from '../components/comp2';
import Wave from '../components/Wave2';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

const Parties = () => {
  const [partyData, setPartyData] = useState({
    mainHeading: 'Celebrate Every Special Moment at Kiddtopia',
    sections: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchPartyData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${BACKEND_URL}/api/parties`);
        const data = response.data || {
          mainHeading: 'Celebrate Every Special Moment at Kiddtopia',
          sections: [],
        };
        setPartyData(data);
      } catch (err) {
        console.error('Error fetching party data:', err);
        setError('Failed to load party data. Showing default content.');
        setPartyData({
          mainHeading: 'Celebrate Every Special Moment at Kiddtopia',
          sections: [
            // ... your default fallback sections ...
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPartyData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Replace with spinner if desired
  }

  return (
    <>
      <TopSection heading="Parties">
        <h1 style={{ color: '#DF2126', fontSize: isMobile ? '25px' : '40px' }}>
          {partyData.mainHeading}
        </h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </TopSection>

      {partyData.sections.map((section, index) => (
        <React.Fragment key={section.title || index}>
          <Comp2
            title={section.title}
            paragraphs={section.paragraphs}
            images={section.images.map((img) => ({
              src: `${BACKEND_URL}${img}`,
            }))}
            reverse={section.reverse}
          />
          {index === Math.floor(partyData.sections.length / 2) && <Wave />}
        </React.Fragment>
      ))}
    </>
  );
};

export default Parties;

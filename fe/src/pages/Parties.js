import React, { useState, useEffect } from 'react';
import { TopSection } from './About';
import Comp2 from '../components/comp2';
import Wave from '../components/Wave2';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const Parties = () => {
  const [partyData, setPartyData] = useState({
    mainHeading: 'Celebrate Every Special Moment at Kiddtopia',
    sections: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch party data from backend
  useEffect(() => {
    const fetchPartyData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/parties`);
        const data = response.data || { mainHeading: 'Celebrate Every Special Moment at Kiddtopia', sections: [] };
        setPartyData(data);
      } catch (error) {
        console.error('Error fetching party data:', error);
        // Fallback to default data if API fails
        setPartyData({
          mainHeading: 'Celebrate Every Special Moment at Kiddtopia',
          sections: [
            {
              title: 'Where Every Birthday Adventure Begins!',
              paragraphs: [
                "Celebrate your child’s special day at Kiddtopia, where fun meets adventure! Our vibrant indoor play center offers a perfect blend of entertainment for all ages. With thrilling soft play areas, exciting VR games, and a variety of arcade games, Kiddtopia promises an unforgettable birthday experience for your little one and their friends. Our party packages include themed decorations, dedicated party hosts, and customized multi-cuisine menus to delight both kids and adults. Whether it's racing in the Go-Karts, bouncing around the play zones, or diving into immersive VR worlds, Kiddtopia is the ultimate birthday destination that guarantees fun-filled memories.",
              ],
              images: Array(5).fill('/Uploads/parties/placeholder.jpg'),
              reverse: false,
            },
            {
              title: 'Host the Ultimate Kitty Party at Kiddtopia!',
              paragraphs: [
                'Looking for a unique, fun-filled venue to host your next Kitty Party? Kiddtopia offers the perfect mix of entertainment, food, and relaxation for an unforgettable experience. Whether it’s a casual gathering with friends or a themed event, our vibrant and lively atmosphere makes every Kitty Party one to remember.',
              ],
              images: Array(5).fill('/Uploads/parties/placeholder.jpg'),
              reverse: true,
            },
            {
              title: 'Host Memorable Corporate Events at Kiddtopia',
              paragraphs: [
                "Looking for a fun and dynamic venue to host your next corporate event? Kiddtopia is the perfect spot to combine business with entertainment, offering a refreshing break from the usual boardroom setting. Whether it's team-building activities, company celebrations, or client appreciation events, our venue provides a unique environment that fosters creativity, collaboration, and fun.",
              ],
              images: Array(5).fill('/Uploads/parties/placeholder.jpg'),
              reverse: false,
            },
            {
              title: 'Dive into Fun with a Kiddtopia Pool Party!',
              paragraphs: [
                "Make a splash at Kiddtopia’s Poolside with an exciting and refreshing Pool Party experience! Whether you're celebrating a birthday, hosting a summer get-together, or just looking for a reason to have fun with friends, our poolside parties offer the perfect combination of sun, fun, and relaxation.",
              ],
              images: Array(5).fill('/Uploads/parties/placeholder.jpg'),
              reverse: true,
            },
            {
              title: 'Host an Enchanting Lawn Party at Kiddtopia!',
              paragraphs: [
                'Bring your celebration outdoors and enjoy the beauty of nature with a delightful Lawn Party at Kiddtopia! Our expansive and lush lawn area is the perfect setting for any occasion, offering a blend of fun, relaxation, and the beauty of the great outdoors.',
              ],
              images: Array(5).fill('/Uploads/parties/placeholder.jpg'),
              reverse: false,
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPartyData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Calculate middle index for Wave placement
  const middleIndex = Math.floor(partyData.sections.length / 2);

  return (
    <>
      <TopSection heading="Parties">
        <h1 style={{ fontSize: 40, color: '#DF2126' }}>{partyData.mainHeading}</h1>
      </TopSection>

      {partyData.sections.map((section, index) => (
        <React.Fragment key={index}>
          <Comp2
            title={section.title}
            paragraphs={section.paragraphs}
            images={section.images.map((img) => ({ src: `${BACKEND_URL}${img}` }))}
            reverse={section.reverse}
          />
          {index === middleIndex && <Wave />}
        </React.Fragment>
      ))}
    </>
  );
};

export default Parties;
import React from 'react';
import { Card, Row, Col, Tag } from 'antd';
import { TopSection } from './About';
import Wave4 from '../components/WaveProfile';

const Membership = () => {
  return (
    <>
      <TopSection heading={'Membership'}>
        <h2 style={{ fontSize: '40px' }}>
          Kiddtopia Membership Plans – Unlock Unlimited Fun!
        </h2>
      </TopSection>

      <div style={{ padding: '40px', minHeight: '100vh', maxWidth: 800, margin: 'auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 40px' }}>
          <p style={{ fontSize: '18px', fontFamily: 'Outfit' }}>
            Step into a world of endless play and exclusive perks! With our special membership plans,
            your child gets unlimited access to our exciting softplay and VR games — all at unbeatable
            prices. Whether you’re in for a short adventure or long days of laughter and learning,
            we’ve got you covered!
          </p>
        </div>

        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} md={12}>
            <Card
              title="3 Months Membership"
              headStyle={{ fontSize: '20px' }}
              style={{ border: '2px dashed red', borderRadius: 60, padding: 10 }}
            >
              <p style={{ fontSize: '18px' }}>
                Perfect for short-term visitors and seasonal playtime!
              </p>
              <h3 style={{ fontSize: '22px' }}>₹30,000</h3>
              <button className="btn" style={{ display: 'block', margin: 'auto', width: 150 }}>
                Purchase Now
              </button>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>6 Months Membership</span>
                  
                </div>
              }
              headStyle={{ fontSize: '20px' }}
              style={{
                border: '3px solid red',
                borderRadius: 60,
                padding: 10,
                backgroundColor: '#fff5f5',
                boxShadow: '0 8px 24px rgba(255, 0, 0, 0.2)',
                transform: 'scale(1.05)',
                transition: 'transform 0.3s ease',
              }}
            >
              <p style={{ fontSize: '18px' }}>
                Double the fun and savings! Ideal for active kids year-round.
              </p>
              <h3 style={{ fontSize: '22px' }}>₹50,000</h3>
              <button className="btn" style={{ display: 'block', margin: 'auto', width: 150 }}>
                Purchase Now
              </button>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title="1 Year Membership"
              headStyle={{ fontSize: '20px' }}
              style={{ border: '2px dashed red', borderRadius: 60, padding: 10 }}
            >
              <p style={{ fontSize: '18px' }}>
                Best value! Full-year access to games, VR & exclusive Kidozplay perks.
              </p>
              <h3 style={{ fontSize: '22px' }}>₹80,000</h3>
              <button className="btn" style={{ display: 'block', margin: 'auto', width: 150 }}>
                Purchase Now
              </button>
            </Card>
          </Col>
        </Row>
      </div>

      <Wave4 />
    </>
  );
};

export default Membership;

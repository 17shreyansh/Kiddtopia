import React from 'react';
import { Row, Col, Typography, Form, Input, Button, Divider, Space } from 'antd';
import celebrateIcon from '../assets/icons/celebrate.svg';
import magicIcon from '../assets/icons/magic.svg';
import trustIcon from '../assets/icons/trust.svg';
import readyIcon from '../assets/icons/ready.svg';
import './BookPartyNow.css';

const { Title, Text } = Typography;

const BookPartyNow = () => {
  return (
    <div className="book-party-wrapper">
      <h1 className="title">
        Book A Party Now
      </h1>

      <Row justify='center' align="middle"  gutter={[0, 32]}>
        {/* Left Column: Form */}
        <Col xs={24} md={12}>
          <div className="form-container">
            <Form layout="vertical">
              <Form.Item
                name="fullName"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input size="large" placeholder="Full Name" className="custom-input" />
              </Form.Item>

              <Form.Item
                name="mobile"
                rules={[{ required: true, message: 'Please enter your mobile number' }]}
              >
                <Input size="large" placeholder="Mobile Number" className="custom-input" />
              </Form.Item>

              <Form.Item
                name="booking"
                rules={[{ required: true, message: 'Please type your booking (e.g., Birthday Party)' }]}
              >
                <Input size="large" placeholder="Booking For (e.g., Birthday Party)" className="custom-input" />
              </Form.Item>

              <Form.Item>
                <button  htmlType="submit" className="btn" style={{display: 'block', margin: '0 auto'}}>
                  Submit
                </button>
              </Form.Item>
            </Form>
          </div>
        </Col>

        {/* Divider */}
        <Col xs={0} md={1}>
                          <Divider type="vertical" style={{ height: '300px', borderColor:"lightgray"  }} />
          
        </Col>

        {/* Right Column: Info */}
        <Col xs={24} md={11}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="info-item">
              <img src={celebrateIcon} alt="celebrate" className="info-icon" />
              <Text strong className="info-text">Celebrate Big at Kiddtopia!</Text>
            </div>

            <div className="info-item">
              <img src={magicIcon} alt="magic" className="info-icon" />
              <Text className="info-text">
                Magical themes, VR games, yummy food & unforgettable fun — all in one place!
              </Text>
            </div>

            <div className="info-item">
              <img src={trustIcon} alt="trust" className="info-icon" />
              <Text className="info-text">Trusted by 500+ families across Noida & Delhi.</Text>
            </div>

            <div className="info-item">
              <img src={readyIcon} alt="ready" className="info-icon" />
              <Text italic className="info-text">Ready to party? BOOK NOW</Text>
            </div>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default BookPartyNow;

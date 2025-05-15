import React, { useState } from 'react';
import { Row, Col, Form, Input, Button, message, Result } from 'antd';
import { TopSection } from './About';
import axios from 'axios';
import { SmileOutlined } from '@ant-design/icons';

const ContactSection = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/contacts`, values);
      form.resetFields();
      setSubmitted(true);
      setLoading(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Failed to submit your message. Please try again later.');
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <TopSection heading={'Contact Us'} />
        <div 
          style={{ 
            padding: '60px 20px', 
            minHeight: '60vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <Result
            icon={<SmileOutlined style={{ color: '#ff4d4f' }} />}
            title={<h2 style={{ color: '#ff4d4f', fontSize: '32px' }}>Thank You for Contacting Us!</h2>}
            subTitle={
              <p style={{ fontSize: '18px', fontFamily: 'Outfit, sans-serif' }}>
                We've received your message and will get back to you soon.
              </p>
            }
            extra={
              <Button 
                type="primary" 
                onClick={() => setSubmitted(false)}
                style={{
                  backgroundColor: '#ff814a',
                  borderColor: '#ff814a',
                  fontWeight: 'bold',
                  borderRadius: 20,
                  fontSize: '16px',
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                Send Another Message
              </Button>
            }
          />
        </div>
      </>
    );
  }

  return (
    <>
      <TopSection heading={'Contact Us'} />

      <div style={{ padding: '60px 20px' }}>
        <Row justify="center" gutter={[32, 32]} style={{ maxWidth: 1100, margin: 'auto' }}>
          {/* Left Info Block */}
          <Col xs={24} md={12}>
            <div style={{ paddingLeft: 20, fontSize: '18px' }}>
              <h3 style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '22px' }}>Address</h3>
              <p style={{ lineHeight: 1.8, fontFamily: 'Outfit, sans-serif' }}>
                Plot.No - 32, St.No-1,<br />
                Rohillapur, Block B, Sector 132,<br />
                Noida, Uttar Pradesh, 201304
              </p>

              <h3 style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '22px' }}>Mobile Number</h3>
              <p style={{ fontFamily: 'Outfit, sans-serif'}}>91+ 8860229232</p>

              <h3 style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '22px' }}>Email</h3>
              <p style={{fontFamily: 'Outfit, sans-serif'}}>kiddtopia132@gmail.com</p>
            </div>
          </Col>

          {/* Right Form Block */}
          <Col xs={24} md={12}>
            <div
              style={{
                border: '2px dashed red',
                borderRadius: 50,
                padding: 30,
                background: '#fff'
              }}
            >
              <h2 style={{ textAlign: 'center', marginBottom: 20, fontSize: '26px' }}>Contact Us</h2>
              <Form 
                form={form}
                layout="vertical" 
                style={{ fontSize: '16px' }}
                onFinish={onFinish}
              >
                <Form.Item 
                  name="fullName"
                  rules={[{ required: true, message: 'Please enter your full name' }]}
                >
                  <Input
                    placeholder="Enter Full name"
                    className="newsletter-input"
                    style={{ fontFamily: 'Outfit, sans-serif', fontSize: '16px' }}
                  />
                </Form.Item>
                <Form.Item 
                  name="mobile"
                  rules={[{ required: true, message: 'Please enter your mobile number' }]}
                >
                  <Input
                    placeholder="Enter Mobile No."
                    className="newsletter-input"
                    style={{ fontFamily: 'Outfit, sans-serif', fontSize: '16px' }}
                  />
                </Form.Item>
                <Form.Item 
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input
                    placeholder="Email"
                    className="newsletter-input"
                    style={{ fontFamily: 'Outfit, sans-serif', fontSize: '16px' }}
                  />
                </Form.Item>
                <Form.Item 
                  name="message"
                  rules={[{ required: true, message: 'Please enter your message' }]}
                >
                  <Input.TextArea
                    placeholder="Message"
                    className="newsletter-input"
                    rows={3}
                    style={{
                      backgroundColor: '#ffe6e6',
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '16px',
                    }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    style={{
                      backgroundColor: '#ff814a',
                      borderColor: '#ff814a',
                      fontWeight: 'bold',
                      width: 150,
                      justifyContent: 'center',
                      display: 'flex',
                      margin: 'auto',
                      borderRadius: 20,
                      fontSize: '16px',
                      fontFamily: 'Outfit, sans-serif',
                    }}
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ContactSection;
import React, { useState } from "react";
import { Row, Col, Form, Input, Button, Typography, Card, message } from "antd";
import axios from "axios";
import { TopSection } from "./About";
import Wave3 from "../components/Wave3";
import KiddtopiaFranchise from "../components/FranchiseModels";
import Testimonials from "../components/Testimonials";

const { Paragraph } = Typography;

const Franchise = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/franchiseforms`, values);
      message.success("Thank you for your interest! We'll contact you soon.");
      form.resetFields();
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Failed to submit form. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopSection heading={"Franchise Opportunities"} />

      <div style={{ padding: "40px" }}>
        <Row gutter={32} justify="center" align="top">
          {/* LEFT SECTION */}
          <Col xs={24} md={14}>
            <Typography>
              <Paragraph style={{ fontSize: "16px", lineHeight: 1.7, fontFamily: "Poppins" }}>
                Kidztopia proudly presents itself as one of the largest soft play and VR games
                destinations in Delhi NCR, designed to provide children a much-needed dose of
                energy, creativity, and engagement through structured recreational experiences.
                <br /><br />
                From exciting go-karting races to zooming zip lines, trampoline zones, and
                high-tech digital slides, Kidztopia is a world where curiosity, coordination, and
                confidence grow naturally through movement and play.
                <br /><br />
                We are more than just a play zone — we are a place of positive experiences outside
                the classroom that strengthens a child's overall development.
                <br /><br />
                With dedicated areas for climbing, bouncing, sliding, exploring, and interactive VR
                adventures, every child finds something to spark their joy. While children play and
                bond with peers, teachers and staff can relax in our scenic poolside gazebo,
                surrounded by serene decor and safety-driven supervision.
                <br /><br />
                Over the past few months, Kidztopia has:
                <br />
                • Served 750+ families. <br />
                • Welcomed 12,000+ happy children <br />
                • Received outstanding reviews from parents, educators, and guests
              </Paragraph>
            </Typography>
          </Col>

          {/* RIGHT SECTION */}
          <Col xs={24} md={10}>
            <Card
              bordered={false}
              style={{
                border: "2px dashed #ff814a",
                borderRadius: 75,
                background: "#fff",
                padding: '0 24px',
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
              }}
            >
              <h1 style={{ textAlign: "center", marginBottom: 20 }}>
                Registration Form
              </h1>
              <Form 
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ message: '' }}
              >
                <Form.Item 
                  name="fullName"
                  rules={[{ required: true, message: 'Please enter your full name' }]}
                >
                  <Input placeholder="Enter Full Name" className="newsletter-input" />
                </Form.Item>
                <Form.Item 
                  name="mobile"
                  rules={[{ required: true, message: 'Please enter your mobile number' }]}
                >
                  <Input placeholder="Enter Mobile No." className="newsletter-input" />
                </Form.Item>
                <Form.Item 
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email address' },
                    { type: 'email', message: 'Please enter a valid email address' }
                  ]}
                >
                  <Input placeholder="Enter Email Address" className="newsletter-input" />
                </Form.Item>
                <Form.Item 
                  name="city"
                  rules={[{ required: true, message: 'Please enter your city' }]}
                >
                  <Input placeholder="Enter City" className="newsletter-input" />
                </Form.Item>
                <Form.Item name="message">
                  <Input.TextArea
                    placeholder="Enter Your Message or Area of Interest"
                    className="newsletter-input"
                    rows={3}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    style={{
                      backgroundColor: "#ff814a",
                      borderColor: "#ff814a",
                      fontWeight: "bold",
                      width: 150,
                      justifyContent: "center",
                      display: 'flex',
                      margin: "auto",
                      borderRadius: 20
                    }}
                  >
                    Register
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
      <Wave3 />
      <KiddtopiaFranchise />
      <Testimonials />
    </>
  );
};

export default Franchise;
import React from "react";
import { Card, Form, Input, Button, Row, Col, Divider } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { TopSection } from "./About";

const AuthPage = () => {
  const inputStyle = {
    background: "#ffeaea",
    borderRadius: 10,
    height: 40,
  };

  const buttonStyle = {
    backgroundColor: "#ff814a",
    borderColor: "#ff814a",
    color: "#fff",
    fontWeight: "bold",
    borderRadius: 20,
    width: 120,
    height: 35,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
  };

  const cardStyle = {
    border: "2px dashed #ff814a",
    borderRadius: 50,
    background: "#fff",
    padding: 24,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    height: "500px", // Ensures equal height in Flex layout
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  return (
    <>
      <TopSection heading={"Create Account"} />
      <div style={{ padding: "40px 16px" }}>
        <Row
          gutter={[24, 24]}
          justify="center"
          align="top"
          style={{ maxWidth: 1200, margin: "auto" }}
        >
          {/* Create Profile */}
          <Col xs={24} md={12} lg={10}>
            <Card style={cardStyle}>
              <h2 style={{ textAlign: "center", marginBottom: 20 }}>
                Create Profile
              </h2>
              <Form layout="vertical">
                <Form.Item name="name">
                  <Input placeholder="Name" style={inputStyle} />
                </Form.Item>
                <Form.Item name="email">
                  <Input placeholder="Email" style={inputStyle} />
                </Form.Item>
                <Form.Item name="password">
                  <Input.Password placeholder="Password" style={inputStyle} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" style={buttonStyle}>
                    Sign up
                  </Button>
                </Form.Item>
                
                <Divider>Or</Divider>
                <Button icon={<GoogleOutlined />} block>
                  Sign Up with Google
                </Button>
              </Form>
            </Card>
          </Col>

          {/* Sign In */}
          <Col xs={24} md={12} lg={10}>
            <Card style={cardStyle}>
              <h2 style={{ textAlign: "center", marginBottom: 20 }}>Sign In</h2>
              <Form layout="vertical">
                <Form.Item name="email">
                  <Input placeholder="Email" style={inputStyle} />
                </Form.Item>
                <Form.Item name="password">
                  <Input.Password placeholder="Password" style={inputStyle} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" style={buttonStyle}>
                    Sign In
                  </Button>
                </Form.Item>
                <Divider>Or</Divider>
                <Button icon={<GoogleOutlined />} block>
                  Sign In with Google
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AuthPage;

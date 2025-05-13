import React from "react";
import { Row, Col, Input } from "antd";

const Form = ({ textColor }) => {
  return (
    <>
      <p
        className="newsletter-sub"
        style={{ color: textColor }}
      >
        Subscribe to our Newsletter
      </p>
      <Input
        placeholder="Enter your Email"
        className="newsletter-input"
        style={{ marginBottom: 12, width:300 }}
      /> <br/>
      <button className="btn">
        Subscribe Now
      </button>
    </>
  );
};

const Newsletter = () => {
  return (
    <div
      className="newsletter-section"
      style={{
        padding: "50px 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Row align="middle" justify="center" gutter={[24, 24]} style={{ width: "100%" }}>
        <Col xs={24} md={24} style={{ textAlign: "center" }}>
          <h1 className="title">Join the Party!</h1>
        </Col>

        {/* For mobile: stack promo text and form vertically */}
        <Col xs={24} md={12} style={{ textAlign: "center" }}>
          <h2 className="promo-text">
            Get 10% off your <br /> first party booking
          </h2>
        </Col>

        {/* Divider only for medium+ screens */}
        <Col xs={0} md={1}>
          <div className="divider" />
        </Col>

        <Col xs={24} md={10} style={{ textAlign: "center" }}>
          <Form textColor="#0066cc" />
        </Col>
      </Row>
    </div>
  );
};

export default Newsletter;
export { Form };

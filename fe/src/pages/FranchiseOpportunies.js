import React from "react";
import { Row, Col, Form, Input, Button, Typography, Card } from "antd";
import { TopSection } from "./About";
import Wave3 from "../components/Wave3";
import AboutUs from '../components/About';
import image from "../assets/sample.jpg";
import KiddtopiaFranchise from "../components/FranchiseModels";
import Reviews from "../components/Reviews";

const { Title, Paragraph } = Typography;

const images = [
  { src: image, width: "180px", height: "300px", mobileWidth: "120px", mobileHeight: "200px", borderRadius: "90px" },
  { src: image, width: "300px", height: "300px", mobileWidth: "200px", mobileHeight: "200px", borderRadius: "40px" },
  { src: image, width: "300px", height: "300px", mobileWidth: "200px", mobileHeight: "200px", borderRadius: "40px" },
  { src: image, width: "180px", height: "300px", mobileWidth: "120px", mobileHeight: "200px", borderRadius: "50px" },
];



const paragraphs = [
  "At Kiddtopia, we’ve got your little ones covered with super safe play areas and friendly staff keeping a close watch, so you can relax while they have fun.",
  "Keep your little ones off the screen at home by bringing them to enjoy wall climbing and trampolines with us. Let the kids unleash their energy and make new friends while they play.",
  "Endless fun at Kiddtopia with our awesome VR and arcade games—perfect for kids who love action-packed adventures and thrilling challenges. Your kids can have a blast in our play zones while you relax and enjoy tasty treats at our café with poolside gazebo seating!",
  "Enjoy an exciting day at Kiddtopia with fun activities like UFO VR, Auto Run Car Racing, Go Karting, Agent VR Shooting, Zip Line, Digital Slides, Trampolines, and many more.",
  "We host awesome birthday parties with games, decorations, and non-stop fun, as well as kitty parties, corporate events, pool parties, and more to make your child’s big day unforgettable."
];

const Franchise = () => {
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
              <Form layout="vertical">
                <Form.Item name="fullName">
                  <Input placeholder="Enter Full Name" className="newsletter-input" />
                </Form.Item>
                <Form.Item name="mobile">
                  <Input placeholder="Enter Mobile No." className="newsletter-input" />
                </Form.Item>
                <Form.Item name="email">
                  <Input placeholder="Enter Email Address" className="newsletter-input" />
                </Form.Item>
                <Form.Item name="city">
                  <Input placeholder="Enter City" className="newsletter-input"  />
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
                    block
                    style={{
                      backgroundColor: "#ff814a",
                      borderColor: "#ff814a",
                      fontWeight: "bold",
                      width:150,
                      justifyContent:"center",
                      display:'flex',
                      margin:"auto",
                      borderRadius:20
                      
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
      <Wave3/>
      <KiddtopiaFranchise/>
      <Reviews/>
    </>
  );
};

export default Franchise;

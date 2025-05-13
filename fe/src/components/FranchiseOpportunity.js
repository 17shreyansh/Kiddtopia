import React from "react";
import { Button, Row, Col, Typography } from "antd";
import { DownloadOutlined, PhoneOutlined } from "@ant-design/icons";
import Back from "../assets/Ellipse/e10.svg";
import F1 from "../assets/icons/f1.svg";
import F2 from "../assets/icons/f2.png";
import F3 from "../assets/icons/f3.png";
import F4 from "../assets/icons/f4.png";
import F5 from "../assets/icons/f5.svg";
import F6 from "../assets/icons/f6.png";

const { Title, Text } = Typography;

const features = [
    { title: "Safe Investment", icon: F1 },
    { title: "Full Interior Setup", icon: F2 },
    { title: "Marketing Support", icon: F3 },
    { title: "Staff Training + Operational Manuals", icon: F4 },
    { title: "Monthly ROI Projection", icon: F5 },
    { title: "Full Support", icon: F6 }
];

const FranchiseOpportunity = () => {
    return (
        <div
            style={{
                padding: "40px 20px",
                margin: "0 auto",
                textAlign: "center"
            }}
        >

            
            <Title level={3} style={{
                color: "#1B71C4",
                fontWeight: "bold",
                textAlign: "center",
                fontFamily: "Rowdies",
                fontSize: "40px",
            }}>
                Franchise Opportunity
            </Title>
            <Row gutter={[0, 32]} justify="center" align="middle">
                {features.map((feature, index) => (
                    <Col xs={12} sm={12} md={8} key={index} style={{ position: 'relative' }}>
                        <div style={{ padding: 20 }}>
                            <div
                                style={{
                                    width: 200,
                                    height: 200,
                                    borderRadius: "50%",
                                    backgroundImage: `url(${Back})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    margin: "0 auto 16px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                                className="circle-container"
                            >
                                <img
                                    src={feature.icon}
                                    alt={feature.title}
                                    style={{ height: 150, objectFit: "contain" }}
                                />
                            </div>
                            <p style={{ display: "block", fontFamily: "Outfit", fontSize: "18px" }}>{feature.title}</p>
                        </div>

                    </Col>
                ))}
            </Row>

            <div style={{ marginTop: 40 }}>
                <p style={{ display: "block", marginBottom: 16, fontFamily: "Outfit", fontSize: "20px", fontWeight: 500 }}>
                    Want to Get More Information
                </p>
                <div style={{display:"flex", justifyContent:"center"}}>
                    <button
                        className="btn"
                        style={{ marginRight: 16, width: 200 }}
                    >
                        Download Brochure    <DownloadOutlined />
                    </button>
                    <button
                        icon={<PhoneOutlined />}
                        className="btn"
                        style={{ width: 200 }}
                    >
                        Call Now
                    </button>
                </div>
            </div>
            <style>
                {`
                    @media (max-width: 768px) {
                        .circle-container {
                            width: 150px !important;
                            height: 150px !important;
                        }
                        .circle-container img {
                            height: 100px !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default FranchiseOpportunity;
import React from "react";
import { Button, Row, Col, Typography } from "antd";
import { DownloadOutlined, PhoneOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import Back from "../assets/Ellipse/e10.svg"; // Make sure this path is correct
import F1 from "../assets/icons/f1.svg";   // Make sure this path is correct
import F2 from "../assets/icons/f2.png";   // Make sure this path is correct
import F3 from "../assets/icons/f3.png";   // Make sure this path is correct
import F4 from "../assets/icons/f4.png";   // Make sure this path is correct
import F5 from "../assets/icons/f5.svg";   // Make sure this path is correct
import F6 from "../assets/icons/f6.png";   // Make sure this path is correct

const { Title } = Typography;

const features = [
    { title: "Safe Investment", icon: F1 },
    { title: "Full Interior Setup", icon: F2 },
    { title: "Marketing Support", icon: F3 },
    { title: "Staff Training + Operational Manuals", icon: F4 },
    { title: "Monthly ROI Projection", icon: F5 },
    { title: "Full Support", icon: F6 }
];

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, when: "beforeChildren" }
    }
};
const featureVariants = {
    hidden: { opacity: 0, scale: 0.7, y: 40 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 12 } }
};
const headingVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
};
const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, delay: 0.2 } }
};

const FranchiseOpportunity = () => {
    return (
        <motion.div
            style={{
                width: '100%', // Take full width
                minHeight: '100vh', // Ensure it takes at least the full viewport height
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Vertically center content
                alignItems: 'center', // Horizontally center content
                padding: "60px 20px", // More vertical padding
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={containerVariants}
        >
            {/* Inner container to constrain content width on large screens */}
            <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', textAlign: 'center' }}>
                <motion.div variants={headingVariants}>
                    <Title level={3} style={{
                        color: "#1B71C4",
                        fontWeight: "bold",
                        fontFamily: "Rowdies",
                        fontSize: "clamp(28px, 4vw, 48px)", // Responsive font size
                        marginBottom: '40px' // Added more space below heading
                    }}>
                        Franchise Opportunity
                    </Title>
                </motion.div>
                {/* Adjusted gutter for both horizontal and vertical spacing */}
                <Row gutter={[24, 48]} justify="center" align="middle">
                    {features.map((feature, index) => (
                        <Col
                            xs={24} // 1 column on extra small screens
                            sm={12} // 2 columns on small screens
                            md={8}  // 3 columns on medium screens
                            lg={6}  // 4 columns on large screens
                            xl={4}  // Even more columns on extra large screens if desired (adjust based on design)
                            key={index}
                            style={{ position: 'relative', display: 'flex', justifyContent: 'center' }} // Center item within its column
                        >
                            <motion.div variants={featureVariants} style={{ width: '100%' }}>
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
                                    <p style={{ display: "block", fontFamily: "Outfit", fontSize: "18px", fontWeight: 500 }}>{feature.title}</p>
                                </div>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
                <motion.div variants={buttonVariants}>
                    <div style={{ marginTop: 60 }}> {/* More space above buttons */}
                        <p style={{ display: "block", marginBottom: 24, fontFamily: "Outfit", fontSize: "22px", fontWeight: 500 }}>
                            Want to Get More Information?
                        </p>
                        <div style={{ display: "flex", justifyContent: "center", flexWrap: 'wrap', gap: '16px' }}> {/* Added gap for responsiveness */}
                            <button
                                type="primary"
                                className="btn"
                                size="large" // Made buttons larger
                                style={{ minWidth: 220 }} // Adjusted button size
                            >
                               <DownloadOutlined /> Download Brochure
                            </button>
                            <button
                                className="btn"
                                style={{ minWidth: 220 }} // Adjusted button size
                            >
                              <PhoneOutlined style={{transform:"scale(-1)"}} />  Call Now
                            </button>
                        </div>
                    </div>
                </motion.div>
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
        </motion.div>
    );
};

export default FranchiseOpportunity;
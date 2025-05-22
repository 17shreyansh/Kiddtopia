import React, { useState, useEffect } from "react";
import { Typography, Row, Col, Image, Card } from "antd";
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

const defaultImageStyles = [
    { width: "180px", height: "300px", mobileWidth: "120px", mobileHeight: "200px", borderRadius: "90px" },
    { width: "300px", height: "300px", mobileWidth: "200px", mobileHeight: "200px", borderRadius: "40px" },
    { width: "300px", height: "300px", mobileWidth: "200px", mobileHeight: "200px", borderRadius: "40px" },
    { width: "180px", height: "300px", mobileWidth: "120px", mobileHeight: "200px", borderRadius: "50px" }
];

// Floating animation variants
const floatingVariants = [
    {
        float: {
            y: [0, -10, 0],
            transition: {
                duration: 2,          // Different duration for each image
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                delay: 0             // Different delay for each image
            },
            willChange: 'transform'
        },
        initial: { y: 0 }
    },
    {
        float: {
            y: [0, -15, 0],       // Different y offset
            transition: {
                duration: 2.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                delay: 0.2        // Staggered delay
            },
            willChange: 'transform'
        },
        initial: { y: 0 }
    },
    {
        float: {
            y: [0, -8, 0],
            transition: {
                duration: 1.8,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                delay: 0.4
            },
            willChange: 'transform'
        },
        initial: { y: 0 }
    },
    {
        float: {
            y: [0, -12, 0],
            transition: {
                duration: 2.2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                delay: 0.1
            },
            willChange: 'transform'
        },
        initial: { y: 0 }
    }
];

const AboutSection = ({
    title = "About Us",
    paragraphs = [],
    images = [],
    reverse = false,
    align = "center",
    padding = {
        desktop: "50px 10px 50px 50px",
        mobile: "20px 00px 20px 00px",
    },
}) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const isMobile = windowWidth <= 768;

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const getTextAlign = () => {
        if (!isMobile) return align;
        if (align === "left") return "left";
        if (align === "right") return "right";
        return "center";
    };

    const TextSection = (
        <Col
            xs={24}
            sm={24}
            md={12}
            style={{
                display: "flex",
                justifyContent: isMobile
                    ? "center"
                    : align === "left"
                        ? "flex-start"
                        : align === "right"
                            ? "flex-end"
                            : "center",
                textAlign: getTextAlign(),
            }}
        >
            <Card
                style={{
                    background: "transparent",
                    width: isMobile ? "100%" : "auto",
                    border: "none",
                }}
                bodyStyle={{ padding: 0 }}
            >
                <Title
                    level={3}
                    style={{
                        color: "#1B71C4",
                        fontWeight: "bold",
                        textAlign: getTextAlign(),
                        fontFamily: "Rowdies",
                        fontSize: isMobile ? "28px" : "40px",
                    }}
                >
                    {title}
                </Title>
                {paragraphs.map((para, index) => (
                    <Paragraph
                        key={index}
                        style={{
                            fontSize: isMobile ? "16px" : "20px",
                            fontFamily: "Outfit",
                            textAlign: getTextAlign(),
                        }}
                    >
                        {para}
                    </Paragraph>
                ))}
            </Card>
        </Col>
    );

    const ImageSection = (
        <Col
            xs={24}
            sm={24}
            md={12}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    display: "flex",
                    gridTemplateColumns: isMobile ? "1fr 1fr" : undefined,
                    gap: isMobile ? "5px" : "10px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}
            >
                {images.map((img, idx) => {
                    const styleSet = defaultImageStyles[idx % defaultImageStyles.length];
                    const animationVariants = floatingVariants[idx % floatingVariants.length]; // Use modulo to cycle through variants
                    return (
                        <motion.div
                            key={idx}
                            variants={animationVariants}
                            initial="initial"
                            animate="float"
                        >
                            <Image
                                src={img.src}
                                preview={false}
                                style={{
                                    width: isMobile ? styleSet.mobileWidth : styleSet.width,
                                    height: isMobile ? styleSet.mobileHeight : styleSet.height,
                                    objectFit: "cover",
                                    borderRadius: styleSet.borderRadius,
                                    border: "2px dashed #DF2126",
                                }}
                            />
                        </motion.div>
                    );
                })}
            </div>
        </Col>
    );

    return (
        <div
            style={{
                padding: isMobile ? padding.mobile : padding.desktop,
                minHeight: "100%",
            }}
        >
            <Row
                gutter={[32, 32]}
                align="middle"
                justify="center"
                style={{
                    margin: "0 auto",
                    flexDirection:
                        isMobile && reverse ? "column-reverse" : isMobile ? "column" : "row",
                }}
            >
                {reverse ? (
                    <>
                        {ImageSection}
                        {TextSection}
                    </>
                ) : (
                    <>
                        {TextSection}
                        {ImageSection}
                    </>
                )}
            </Row>
        </div>
    );
};

export default AboutSection;

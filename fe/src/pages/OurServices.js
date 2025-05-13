import React, { useState, useEffect, useMemo } from "react";
import { TopSection } from "./About";
import Wave from "../components/Wave2";
import image from '../assets/sample.jpg'

// Card data
const cardData = [
    { title: "Go Karting", description: "Odio ut sem nulla pharetra diam. Ut ornare lectus sit amet est.", image: image },
    { title: "Party Hall", description: "Odio ut sem nulla pharetra diam. Ut ornare lectus sit amet est.", image: image },
    { title: "AR/VR Arcade", description: "Odio ut sem nulla pharetra diam. Ut ornare lectus sit amet est.", image: image },
    { title: "Host the Ultimate Kitty Party at Kidztopia!", description: "Odio ut sem nulla pharetra diam. Ut ornare lectus sit amet est.", image: image },
    { title: "AR/VR Arcade", description: "Odio ut sem nulla pharetra diam. Ut ornare lectus sit amet est.", image: image },
    { title: "Host the Ultimate Kitty Party at Kidztopia!", description: "Odio ut sem nulla pharetra diam. Ut ornare lectus sit amet est.", image: image },
    { title: "AR/VR Arcade", description: "Odio ut sem nulla pharetra diam. Ut ornare lectus sit amet est.", image: image },
    { title: "Host the Ultimate Kitty Party at Kidztopia!", description: "Odio ut sem nulla pharetra diam. Ut ornare lectus sit amet est.", image: image },
];

const cardData2 = [
    { title: "Go Karting", description: "Odio ut sem nulla pharetra diam. Ut ornare lectus sit amet est.", image: image },
    { title: "Party Hall", description: "Odio ut sem nulla pharetra diam. Ut ornare lectus sit amet est.", image: image },
    { title: "AR/VR Arcade", description: "Odio ut sem nulla pharetra diam. Ut ornare lectus sit amet est.", image: image },
    { title: "Host the Ultimate Kitty Party at Kidztopia!", description: "Odio ut sem nulla pharetra diam. Ut ornare lectus sit amet est.", image: image },
    { title: "AR/VR Arcade", description: "Odio ut sem nulla pharetra diam. Ut ornare lectus sit amet est.", image: image },
    { title: "Host the Ultimate Kitty Party at Kidztopia!", description: "Odio ut sem nulla pharetra diam. Ut ornare lectus sit amet est.", image: image },
    { title: "AR/VR Arcade", description: "Odio ut sem nulla pharetra diam. Ut ornare lectus sit amet est.", image: image },
    { title: "Host the Ultimate Kitty Party at Kidztopia!", description: "Odio ut sem nulla pharetra diam. Ut ornare lectus sit amet est.", image: image },
];

// Card Component
const Card = ({ title, description, isMobile, image }) => {
    const cardStyles = {
        width: isMobile? "45vw": "40vw",
        aspectRatio: '3 / 4',
        border: '2px dashed #f87171',
        borderRadius: '40px',
        padding: isMobile ? '6px' : '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
    };

    const headerStyles = {
        margin: '12px 0 8px 0',
        fontSize: isMobile ? '12px' : '20px',
    };

    const paragraphStyles = {
        fontSize: isMobile ? '12px' : '22px',
        color: '#555',
        fontFamily: "Outfit",
    };

    const buttonStyles = {
        margin: '20px auto',
        fontSize: isMobile ? '12px' : '16px',
    };

    return (
        <div style={cardStyles}>
            <div style={{
                height: '50%',
                border: '1px dashed #00000040',
                borderRadius: '30px',
                background: `url(${image}) no-repeat center center`,
                backgroundSize: 'cover',
            }} />
            <div>
                <h2 style={headerStyles}>{title}</h2>
                <p style={paragraphStyles}>{description}</p>
            </div>
            <button className="btn" style={buttonStyles}>
                Call Now
            </button>
        </div>
    );
};

// Service Component
const Service = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize(); // run on mount
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const cardItems = useMemo(() => {
        return cardData.map((card, index) => (
            <Card key={index} title={card.title} description={card.description} isMobile={isMobile} image={card.image} />
        ));
    }, [isMobile]);
      const cardItems2 = useMemo(() => {
        return cardData2.map((card, index) => (
            <Card key={index} title={card.title} description={card.description} isMobile={isMobile} image={card.image} />
        ));
    }, [isMobile]);


    return (
        <>
            <TopSection heading={'Our Services'}>
                <h2 style={{ fontSize: isMobile ? '20px' : '40px' }}>
                    Kiddtopia: A Premium Adventure for Kids
                </h2>
            </TopSection>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column', // Stack cards vertically on mobile
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                    maxWidth: '1000px',
                    margin: '0 auto',
                }}
            >
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)', // Always 2 cards
                        gap: isMobile ? '8px' : '16px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    {cardItems}
                </div>
            </div>
            <Wave />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column', // Stack cards vertically on mobile
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                    maxWidth: '1000px',
                    margin: '0 auto',
                }}
            >
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)', // Always 2 cards
                        gap: isMobile ? '8px' : '16px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    {cardItems2}
                </div>
            </div>
        </>
    );
};

export default Service;

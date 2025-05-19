import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Typography } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const franchiseModels = [
    {
        title: 'Model 1 – Starter Zone',
        area: '5000 to 7000 sq. ft.',
        investment: '₹1.5 Crore',
        includes: 'Premium Softplay Area',
        support: '3 Months Training, Dedicated Staff Manager',
        setup: 'Full Interior Design Support',
        royalty: 'Zero % Royalty',
        targetAge: '3 to 22 Years',
    },
    {
        title: 'Model 2 – Adventure Plus',
        area: '10,000 to 15,000 sq. ft.',
        investment: '₹2.5 Crore',
        includes: 'Softplay Zone (36 Game Types) + VR Gaming Zone',
        support: '3 Months Training, Dedicated Staff Manager',
        setup: 'Complete Interior & Experience Design',
        royalty: 'Zero % Royalty',
        targetAge: '3 to 22 Years',
    },
    {
        title: 'Model 3 – The Mega Experience',
        area: '10,000 to 15,000 sq. ft.',
        investment: '₹4 Crore',
        includes: 'Softplay + VR + Arcade Games + Themed Restaurant + Garden Area + Pool',
        support: '3 Months Training, Dedicated Staff Manager',
        setup: 'Full Interiors, Theme Setup & Brand Assistance',
        royalty: 'Zero % Royalty',
        targetAge: '3 to 22 Years',
    },
];

const InfoCard = ({ model }) => {
    const cardRef = useRef(null);
    const contentRef = useRef(null);
    const [fontSize, setFontSize] = useState(13);

    useEffect(() => {
        const shrinkToFit = () => {
            let currentFontSize = fontSize;
            const maxTries = 10;

            for (let i = 0; i < maxTries; i++) {
                if (!contentRef.current || !cardRef.current) break;

                const contentHeight = contentRef.current.scrollHeight;
                const cardHeight = cardRef.current.clientHeight;

                if (contentHeight > cardHeight - 100 && currentFontSize > 10) {
                    currentFontSize -= 1;
                    contentRef.current.style.fontSize = `${currentFontSize}px`;
                } else {
                    break;
                }
            }

            setFontSize(currentFontSize);
        };

        // Use a timeout to allow for initial rendering
        setTimeout(shrinkToFit, 100);
    }, [model]);

    return (
        <div
            ref={cardRef}
            style={{
                border: '2px dashed #ffb6c1',
                borderRadius: '60px',
                padding: '24px',
                backgroundColor: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%', // Make cards have equal height.
            }}
        >
            <div
                ref={contentRef}
                style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: 1.2,
                    overflow: 'hidden',
                }}
            >
                <h2 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>{model.title}</h2>

                <Paragraph style={{ marginBottom: 5 }}><Text>Area Required:</Text> {model.area}</Paragraph>
                <Paragraph style={{ marginBottom: 5 }}><Text>Investment:</Text> {model.investment}</Paragraph>
                <Paragraph style={{ marginBottom: 5 }}><Text>Includes:</Text> {model.includes}</Paragraph>
                <Paragraph style={{ marginBottom: 5 }}><Text>Support:</Text> {model.support}</Paragraph>
                <Paragraph style={{ marginBottom: 5 }}><Text>Setup:</Text> {model.setup}</Paragraph>
                <Paragraph style={{ marginBottom: 5 }}><Text>Royalty:</Text> {model.royalty}</Paragraph>
                <Paragraph style={{ marginBottom: 12 }}><Text>Target Age Group:</Text> {model.targetAge}</Paragraph>
            </div>

            <button className="btn" style={{ width: 160, margin: "auto", fontSize: `${fontSize}px` }}>
                <PhoneOutlined />
                &nbsp;Call Now
            </button>
        </div>
    );
};

const KiddtopiaFranchise = () => {
    return (
        <div style={{ padding: '2rem', fontFamily: 'Outfit', fontSize: '13px' }}>
            <h1 className='title' style={{ color: "black", fontSize: "1.8rem" }}>Kiddtopia Franchise Models</h1>

            <Row gutter={[24, 24]} justify="center">
                <Col xs={24} md={12} lg={10}>
                    <div style={{ border: '1px solid #eee', borderRadius: '12px', padding: '20px' }}>
                        <Paragraph>
                            <Text strong>Easy Steps to Open</Text><br />
                            Step 1: Fill Inquiry Form<br />
                            Step 2: Location & Investment Discussion<br />
                            Step 3: Financial Plan & Agreement<br />
                            Step 4: Setup Begins
                        </Paragraph>

                        <Paragraph style={{ marginTop: '1rem' }}>
                            <Text strong>How Will You Benefit from the Franchise?</Text><br />
                            Brand Power & Customer Trust<br />
                            Marketing Support<br />
                            Training & Management Support<br />
                            Exclusive Location Rights
                        </Paragraph>
                        <Paragraph>
                            <Text strong>What Do We Need From You?</Text><br />
                            Passion for kids & creativity<br />
                            Space as per chosen model<br />
                            Investment capacity & business attitude<br />
                            Willingness to follow Kiddtopia brand standards
                        </Paragraph>
                    </div>
                </Col>

                {franchiseModels.map((model, idx) => (
                    <Col key={idx} xs={24} md={12} lg={10}>
                        <InfoCard model={model} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default KiddtopiaFranchise;

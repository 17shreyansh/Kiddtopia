import React from 'react';
import { Card, Row, Col, Tag } from 'antd';
import { TopSection } from './About'; // Assuming this path is correct
import Wave4 from '../components/WaveProfile'; // Assuming this path is correct
import { motion } from 'framer-motion';

const Membership = () => {
    // --- Framer Motion Variants ---

    // For the main introductory paragraph
    const paragraphVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.8 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
                duration: 0.8
            }
        }
    };

    // For the individual membership cards (pop-in effect)
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8, rotate: -5 },
        visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 10,
                duration: 0.7
            }
        }
    };

    // Container for staggered card animations
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    // Continuous pulse for the "Most Popular" tag
    const pulseVariants = {
        pulse: {
            scale: [1, 1.05, 1], // Scales up then back down
            transition: {
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop"
            }
        }
    };

    // Button click effect
    const buttonTapVariants = {
        tap: { scale: 0.95, y: 2 } // Slightly shrink and move down on tap
    };

    return (
        <>
            <TopSection heading={'Membership'}>
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ fontSize: '40px' }}
                >
                    Kiddtopia Membership Plans – Unlock Unlimited Fun!
                </motion.h2>
            </TopSection>

            <div style={{ padding: '40px', minHeight: '100vh', maxWidth: 800, margin: 'auto' }}>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={paragraphVariants}
                    style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 40px' }}
                >
                    <p style={{ fontSize: '18px', fontFamily: 'Outfit' }}>
                        Step into a world of endless play and exclusive perks! With our special membership plans,
                        your child gets unlimited access to our exciting softplay and VR games — all at unbeatable
                        prices. Whether you’re in for a short adventure or long days of laughter and learning,
                        we’ve got you covered!
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                >
                    <Row gutter={[24, 24]} justify="center">
                        <Col xs={24} md={12}>
                            <motion.div variants={cardVariants}>
                                <Card
                                    title="3 Months Membership"
                                    headStyle={{ fontSize: '20px' }}
                                    style={{ border: '2px dashed red', borderRadius: 60, padding: 10 }}
                                >
                                    <p style={{ fontSize: '18px' }}>
                                        Perfect for short-term visitors and seasonal playtime!
                                    </p>
                                    <h3 style={{ fontSize: '22px' }}>₹30,000</h3>
                                    <motion.button
                                        className="btn"
                                        style={{ display: 'block', margin: 'auto', width: 150 }}
                                        whileTap="tap"
                                        variants={buttonTapVariants}
                                    >
                                        Purchase Now
                                    </motion.button>
                                </Card>
                            </motion.div>
                        </Col>

                        <Col xs={24} md={12}>
                            <motion.div variants={cardVariants}>
                                <Card
                                    // The title slot needs to be a simple string if we want to use headStyle's
                                    // position: 'relative' directly. Otherwise, if you put a complex JSX here,
                                    // you lose direct control over the AntD Card's internal header element.
                                    // We will use a separate, absolutely positioned element for the Tag.
                                    title="6 Months Membership"
                                    headStyle={{
                                        fontSize: '20px',
                                        position: 'relative', // IMPORTANT: Make the header the positioning context
                                        padding: '16px 24px', // Standard AntD header padding
                                        // Adding a height here can help ensure consistency, or minHeight
                                        minHeight: '60px', // Example min-height for title
                                        overflow: 'visible' // Ensure anything outside the header doesn't get clipped
                                    }}
                                    style={{
                                        border: '3px solid red',
                                        borderRadius: 60,
                                        padding: 10,
                                        backgroundColor: '#fff5f5',
                                        boxShadow: '0 8px 24px rgba(255, 0, 0, 0.2)',
                                        transition: 'all 0.3s ease',
                                        // This overflow is crucial for anything that extends *outside* the card body/header
                                        overflow: "visible"
                                    }}
                                >
                                    {/* Absolutely position the "Most Popular" tag outside the normal flow
                                        relative to the Card's header. */}
                                    <motion.div
                                        variants={pulseVariants}
                                        animate="pulse"
                                        style={{
                                            position: 'absolute',
                                            top: '-15px', // Adjust this value to control how much it overlaps the top border
                                            right: '20px', // Adjust this to move it left/right from the edge
                                            zIndex: 100, // Ensure it's on top of everything
                                            // Optional: If the tag's background is not solid, add one.
                                            // backgroundColor: 'red',
                                            borderRadius: 20, // Match the tag's border-radius
                                            padding: '0 5px' // Small padding if needed for the motion.div itself
                                        }}
                                    >
                                        <Tag color="red" style={{
                                            borderRadius: 20,
                                            padding: '5px 10px',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            border: 'none', // Remove tag's default border if any
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)' // Add a subtle shadow for pop
                                        }}>
                                            Most Popular
                                        </Tag>
                                    </motion.div>

                                    <p style={{ fontSize: '18px' }}>
                                        Double the fun and savings! Ideal for active kids year-round.
                                    </p>
                                    <h3 style={{ fontSize: '22px' }}>₹50,000</h3>
                                    <motion.button
                                        className="btn"
                                        style={{ display: 'block', margin: 'auto', width: 150 }}
                                        whileTap="tap"
                                        variants={buttonTapVariants}
                                    >
                                        Purchase Now
                                    </motion.button>
                                </Card>
                            </motion.div>
                        </Col>

                        <Col xs={24} md={12}>
                            <motion.div variants={cardVariants}>
                                <Card
                                    title="1 Year Membership"
                                    headStyle={{ fontSize: '20px' }}
                                    style={{ border: '2px dashed red', borderRadius: 60, padding: 10 }}
                                >
                                    <p style={{ fontSize: '18px' }}>
                                        Best value! Full-year access to games, VR & exclusive Kidozplay perks.
                                    </p>
                                    <h3 style={{ fontSize: '22px' }}>₹80,000</h3>
                                    <motion.button
                                        className="btn"
                                        style={{ display: 'block', margin: 'auto', width: 150 }}
                                        whileTap="tap"
                                        variants={buttonTapVariants}
                                    >
                                        Purchase Now
                                    </motion.button>
                                </Card>
                            </motion.div>
                        </Col>
                    </Row>
                </motion.div>
            </div>

            <Wave4 />
        </>
    );
};

export default Membership;
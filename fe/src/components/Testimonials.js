import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Spin, message } from "antd";
import axios from "axios";
import GoogleReviewCard from "./GoogleReviewCard";

const { Title } = Typography;

const Testimonials = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/home/Testimonials`)
            .then(response => {
                if (response.data.success && response.data.content.testimonials) {
                    setReviews(response.data.content.testimonials);
                } else {
                    message.error("Failed to load testimonials.");
                }
            })
            .catch(() => {
                message.error("Error fetching testimonials.");
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div style={{ padding: 40 }}>
            <Title
                level={2}
                style={{
                    color: "#1B71C4",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontFamily: "Rowdies",
                    fontSize: "40px",
                }}
            >
                Testimonials
            </Title>

            {loading ? (
                <div style={{ textAlign: "center", marginTop: 40 }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Row gutter={[24, 24]} justify="center">
                    {reviews.map((review, idx) => (
                        <Col key={idx} xs={24} sm={12} md={8}>
                            <GoogleReviewCard
                                name={review.name}
                                rating={review.stars}
                                review={review.paragraph}
                            />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default Testimonials;

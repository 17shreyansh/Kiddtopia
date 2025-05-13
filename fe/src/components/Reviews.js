import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Spin, message } from "antd";
import axios from "axios";
import GoogleReviewCard from "./GoogleReviewCard";

const { Title } = Typography;

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Dummy data for now, replace with actual backend call in the future
        const dummyReviews = [
            { name: "John Doe", stars: 5, paragraph: "Excellent service! The team was very professional and handled all of our concerns swiftly. Would highly recommend!" },
            { name: "Jane Smith", stars: 4, paragraph: "Very satisfied with the experience. The staff was friendly and helpful, although there was a slight delay in response time." },
            { name: "Alice Johnson", stars: 3, paragraph: "Good, but there are areas for improvement. I feel that the overall experience could have been smoother, especially with communication." },
            { name: "Michael Brown", stars: 5, paragraph: "Absolutely fantastic! The service exceeded all expectations, and the attention to detail was remarkable. I’m definitely a repeat customer!" },
        ];

        setReviews(dummyReviews);

        // Uncomment below when backend is ready
        // axios.get("/api/home/Testimonials")
        //     .then(response => {
        //         if (response.data.success && response.data.content.testimonials) {
        //             setReviews(response.data.content.testimonials);
        //         } else {
        //             message.error("Failed to load testimonials.");
        //         }
        //     })
        //     .catch(() => {
        //         message.error("Error fetching testimonials.");
        //     })
        //     .finally(() => setLoading(false));

        setLoading(false);
    }, []);

    return (
        <div style={{ padding: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Title
                level={2}
                style={{
                    color: "#1B71C4",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontFamily: "Rowdies",
                    fontSize: "40px",
                    marginBottom: 40,
                }}
            >
                Reviews
            </Title>

            {loading ? (
                <div style={{ textAlign: "center", marginTop: 40 }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Row justify="center" align="middle" style={{ marginLeft: 0, marginRight: 0 }}>
                    {reviews.map((review, idx) => (
                        <Col
                            key={idx}
                            xs={24}
                            sm={12}
                            md={12}
                            style={{ display: "flex", justifyContent: 'center', marginBottom: 0, padding: 0 }}
                        >
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

export default Reviews;

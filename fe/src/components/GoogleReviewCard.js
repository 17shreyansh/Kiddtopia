import React from "react";
import { Rate, Typography } from "antd";
import GoogleLogo from "../assets/google.png"; // Use correct path

const { Text } = Typography;

const GoogleReviewCard = ({ name, rating, review, hideOnSmallScreen }) => {
    const [isHidden, setIsHidden] = React.useState(false);

    React.useEffect(() => {
        const handleResize = () => {
            setIsHidden(hideOnSmallScreen === "yes" && window.innerWidth < 768);
        };

        handleResize(); // Check on mount
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [hideOnSmallScreen]);

    if (isHidden) {
        return null;
    }

    return (
        <div
            style={{
                position: "relative",
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 16,
                backgroundColor: "#fff",
                maxWidth: 400,
                minHeight: 180,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                margin: 8,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                }}
            >
                <img src={GoogleLogo} alt="Google" style={{ height: 20 }} />
            </div>
            <div>
                <Text strong style={{ display: "block", marginBottom: 4 }}>
                    {name}
                </Text>
                <Rate disabled allowHalf defaultValue={rating} style={{ fontSize: 14 }} />
            </div>
            <Text style={{ fontSize: 13, lineHeight: 1.5, textAlign: "justify" }}>
                {review}
            </Text>
        </div>
    );
};

export default GoogleReviewCard;

import React, { useState, useEffect, useMemo } from "react";
import { TopSection } from "./About";
import Wave from "../components/Wave2";
import image from '../assets/sample.jpg'
import { Button } from 'antd';

// Blog content data
const blogContent = [
    {
        title: "The Ultimate Guide to Creating a Positive Classroom Environment",
        content: "Aenean dapibus massa sed urna dictum, in ornare magna vestibulum. In sit amet iaculis ligula. Phasellus eu felis euismod, suscipit sapien eu, consectetur orci. Interdum et Proin non dolor justo. Nulla dictum, quam non pellentesque fringilla, tellus nulla tempor lorem, sed vulputate massa turpis quis justo. Phasellus vel dui leo. Nunc at ipsum imperdiet, congue purus eu, placerat nulla. Nam cursus nibh ipsum, ac porttitor felis feugiat vitae. malesuada...",
        image: image,
        date: "8 March",  // Add the date here
    },
    {
        title: "The Ultimate Guide to Creating a Positive Classroom Environment",
        content: "Aenean dapibus massa sed urna dictum, in ornare magna vestibulum. In sit amet iaculis ligula. Phasellus eu felis euismod, suscipit sapien eu, consectetur orci. Interdum et Proin non dolor justo. Nulla dictum, quam non pellentesque fringilla, tellus nulla tempor lorem, sed vulputate massa turpis quis justo. Phasellus vel dui leo. Nunc at ipsum imperdiet, congue purus eu, placerat nulla. Nam cursus nibh ipsum, ac porttitor felis feugiat vitae. malesuada...",
        image: image,
        date: "8 March",  // Add the date here
    },
    {
        title: "The Ultimate Guide to Creating a Positive Classroom Environment",
        content: "Aenean dapibus massa sed urna dictum, in ornare magna vestibulum. In sit amet iaculis ligula. Phasellus eu felis euismod, suscipit sapien eu, consectetur orci. Interdum et Proin non dolor justo. Nulla dictum, quam non pellentesque fringilla, tellus nulla tempor lorem, sed vulputate massa turpis quis justo. Phasellus vel dui leo. Nunc at ipsum imperdiet, congue purus eu, placerat nulla. Nam cursus nibh ipsum, ac porttitor felis feugiat vitae. malesuada...",
        image: image,
        date: "8 March",  // Add the date here
    },
    {
        title: "The Ultimate Guide to Creating a Positive Classroom Environment",
        content: "Aenean dapibus massa sed urna dictum, in ornare magna vestibulum. In sit amet iaculis ligula. Phasellus eu felis euismod, suscipit sapien eu, consectetur orci. Interdum et Proin non dolor justo. Nulla dictum, quam non pellentesque fringilla, tellus nulla tempor lorem, sed vulputate massa turpis quis justo. Phasellus vel dui leo. Nunc at ipsum imperdiet, congue purus eu, placerat nulla. Nam cursus nibh ipsum, ac porttitor felis feugiat vitae. malesuada...",
        image: image,
        date: "8 March",  // Add the date here
    },
    {
        title: "The Ultimate Guide to Creating a Positive Classroom Environment",
        content: "Aenean dapibus massa sed urna dictum, in ornare magna vestibulum. In sit amet iaculis ligula. Phasellus eu felis euismod, suscipit sapien eu, consectetur orci. Interdum et Proin non dolor justo. Nulla dictum, quam non pellentesque fringilla, tellus nulla tempor lorem, sed vulputate massa turpis quis justo. Phasellus vel dui leo. Nunc at ipsum imperdiet, congue purus eu, placerat nulla. Nam cursus nibh ipsum, ac porttitor felis feugiat vitae. malesuada...",
        image: image,
        date: "8 March",  // Add the date here
    },
    {
        title: "The Ultimate Guide to Creating a Positive Classroom Environment",
        content: "Aenean dapibus massa sed urna dictum, in ornare magna vestibulum. In sit amet iaculis ligula. Phasellus eu felis euismod, suscipit sapien eu, consectetur orci. Interdum et Proin non dolor justo. Nulla dictum, quam non pellentesque fringilla, tellus nulla tempor lorem, sed vulputate massa turpis quis justo. Phasellus vel dui leo. Nunc at ipsum imperdiet, congue purus eu, placerat nulla. Nam cursus nibh ipsum, ac porttitor felis feugiat vitae. malesuada...",
        image: image,
        date: "8 March",  // Add the date here
    },
    {
        title: "The Ultimate Guide to Creating a Positive Classroom Environment",
        content: "Aenean dapibus massa sed urna dictum, in ornare magna vestibulum. In sit amet iaculis ligula. Phasellus eu felis euismod, suscipit sapien eu, consectetur orci. Interdum et Proin non dolor justo. Nulla dictum, quam non pellentesque fringilla, tellus nulla tempor lorem, sed vulputate massa turpis quis justo. Phasellus vel dui leo. Nunc at ipsum imperdiet, congue purus eu, placerat nulla. Nam cursus nibh ipsum, ac porttitor felis feugiat vitae. malesuada...",
        image: image,
        date: "8 March",  // Add the date here
    },
    {
        title: "The Ultimate Guide to Creating a Positive Classroom Environment",
        content: "Aenean dapibus massa sed urna dictum, in ornare magna vestibulum. In sit amet iaculis ligula. Phasellus eu felis euismod, suscipit sapien eu, consectetur orci. Interdum et Proin non dolor justo. Nulla dictum, quam non pellentesque fringilla, tellus nulla tempor lorem, sed vulputate massa turpis quis justo. Phasellus vel dui leo. Nunc at ipsum imperdiet, congue purus eu, placerat nulla. Nam cursus nibh ipsum, ac porttitor felis feugiat vitae. malesuada...",
        image: image,
        date: "8 March",  // Add the date here
    },
    
];

// Card Component
const BlogCard = ({ title, content, isMobile, image, date }) => {
    const cardStyles = {
        width: isMobile ? "90vw" : "40vw",  // Adjust width for mobile
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
        fontSize: isMobile ? '14px' : '20px',  // Adjust font size for mobile
    };

    const paragraphStyles = {
        fontSize: isMobile ? '12px' : '22px',
        color: '#555',
        fontFamily: "Outfit",
    };

    const buttonStyles = {
        margin: '10px 0',
        fontSize: isMobile ? '14px' : '16px',  // Adjust button font size for mobile
        padding: isMobile ? '8px' : '12px',  // Adjust padding for mobile
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
                <p style={paragraphStyles}>{content}</p>
            </div>
            <div style={{ display: "flex", justifyContent: 'space-between', padding: "0 20px" }}>
                <button className="btn" style={buttonStyles}>
                    Read More
                </button>
                <div
                    type="primary"
                    block
                    style={{
                        backgroundColor: "#ff814a",
                        borderColor: "#ff814a",
                        fontWeight: "bold",
                        width: isMobile ? '120px' : '150px',  // Adjust width for mobile
                        justifyContent: "center",
                        margin: "auto 0",
                        borderRadius: 20,
                        textAlign: "center",
                        fontFamily: "Outfit",
                        padding: isMobile ? '6px 12px' : '8px 15px',  // Adjust padding for mobile
                    }}
                >
                    {date}  {/* Display the date here */}
                </div>
            </div>
        </div>
    );
};

// Blog Component
const Blog = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize(); // run on mount
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const blogItems = useMemo(() => {
        return blogContent.map((blog, index) => (
            <BlogCard
                key={index}
                title={blog.title}
                content={blog.content}
                isMobile={isMobile}
                image={blog.image}
                date={blog.date}
            />
        ));
    }, [isMobile]);

    return (
        <>
            <TopSection heading={'Our Blog'} />

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',  // Stack cards vertically on mobile
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
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',  // Adjust grid layout for mobile
                        gap: isMobile ? '8px' : '16px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    {blogItems}
                </div>
            </div>
        </>
    );
};

export default Blog;

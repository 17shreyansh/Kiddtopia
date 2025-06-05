import React, { useState, useEffect, useMemo } from "react";
import { TopSection } from "./About";
import Wave from "../components/Wave2";
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from React Router


// Card Component
const BlogCard = ({ title, content, isMobile, imageUrl, date, slug }) => {
    const cardStyles = {
        width: isMobile ? "90vw" : "40vw",
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
        fontSize: isMobile ? '14px' : '20px',
    };

    const paragraphStyles = {
        fontSize: isMobile ? '12px' : '16px',
        color: '#555',
        fontFamily: "Outfit",
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 10, // Show only 3 lines
        WebkitBoxOrient: 'vertical',
    };

    const buttonStyles = {
        margin: '10px 0',
        fontSize: isMobile ? '14px' : '16px',
        padding: isMobile ? '8px' : '12px',
    };

    return (
        <div style={cardStyles}>
            <div style={{
                height: '35%',
                border: '1px dashed #00000040',
                borderRadius: '30px',
                background: `url(${imageUrl}) no-repeat center center`,
                backgroundSize: 'cover',
            }} />
            <div>
                <h2 style={headerStyles}>{title}</h2>
                <div style={paragraphStyles} dangerouslySetInnerHTML={{ __html: content }} />
            </div>
            <div style={{ display: "flex", justifyContent: 'space-between', padding: "0 20px" }}>
                <Link to={`/blog/${slug}`} className="btn" style={buttonStyles}>
                    Read More
                </Link>
                <div
                    type="primary"
                    block
                    style={{
                        backgroundColor: "#ff814a",
                        borderColor: "#ff814a",
                        fontWeight: "bold",
                        width: isMobile ? '120px' : '150px',
                        justifyContent: "center",
                        margin: "auto 0",
                        borderRadius: 20,
                        textAlign: "center",
                        fontFamily: "Outfit",
                        padding: isMobile ? '6px 12px' : '8px 15px',
                    }}
                >
                    {date}
                </div>
            </div>
        </div>
    );
};

// Blog Component
const Blog = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/blogs/`);
                if (response.data.success) {
                    const formattedBlogs = response.data.data.map(blog => ({
                        ...blog,
                        date: new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
                        imageUrl: blog.mainImage ? `${blog.mainImage}` : null,
                    }));
                    setBlogs(formattedBlogs);
                } else {
                    console.error("Failed to fetch blogs:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };

        fetchBlogs();
    }, [backendUrl]);

    const blogItems = useMemo(() => {
        return blogs.map((blog, index) => (
            <BlogCard
                key={blog._id}
                title={blog.title}
                content={blog.content}
                isMobile={isMobile}
                imageUrl={blog.imageUrl}
                date={blog.date}
                slug={blog.slug}

            />
        ));
    }, [blogs, isMobile]);

    return (
        <>
            <TopSection heading={'Blog'} />

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
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
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                        gap: isMobile ? '8px' : '16px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    {blogItems}
                </div>
            </div>
            <Wave/>
        </>
    );
};

export default Blog;
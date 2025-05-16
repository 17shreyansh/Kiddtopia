import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './BlogPage.css'; // Import CSS file
import { TopSection } from './About';


const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Blog = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const image = ''; // Define image here, or use a better default strategy

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/blogs/${slug}`);
                if (response.data.success) {
                    setBlog(response.data.data);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [slug]);

    if (loading) {
        return <div style={{ textAlign: 'center', fontFamily: 'Outfit' }}>Loading...</div>; // Simple loader
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', fontFamily: 'Outfit' }}>Error: {error}</div>;
    }

    if (!blog) {
        return <div style={{ textAlign: 'center', fontFamily: 'Outfit' }}>Blog not found.</div>;
    }

    const imageUrl = blog.mainImage ? `${backendUrl}/uploads/${blog.mainImage}` : image;

    return (
        <>
        <TopSection heading={"Blog"}/>
        <div className="blog-page-container">
            <Link to="/blog" className="back-button">
                <ArrowLeftOutlined />
                Back to Blog
            </Link>
            <div className="main-image-container">
                <img src={imageUrl} alt={blog.title} className="main-image" />
            </div>
            <div className="content-container">
                <h1>{blog.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>
        </div>
        </>
    );
};

export default Blog;

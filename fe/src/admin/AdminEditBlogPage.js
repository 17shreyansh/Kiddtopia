import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BlogForm from './Blogform';
import { getBlogPostById, updateBlogPost } from '../services/api';
import { Spin, Alert } from 'antd';

const AdminEditBlogPage = () => {
    const { identifier } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await getBlogPostById(identifier);
                if (response.success) {
                    setPost(response.data);
                } else {
                    setError(response.message || 'Failed to fetch post data.');
                }
            } catch (err) {
                setError(err.message || 'An error occurred while fetching the post.');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [identifier]);

    const handleSubmit = async (formData) => {
        return updateBlogPost(identifier, formData);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }

    if (!post) {
        return <Alert message="Not Found" description="Blog post not found." type="warning" showIcon />;
    }

    return (
        <BlogForm initialData={post} onSubmit={handleSubmit} isEditing={true} />
    );
};

export default AdminEditBlogPage;
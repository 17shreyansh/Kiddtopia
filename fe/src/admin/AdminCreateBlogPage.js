import React from 'react';
import BlogForm from './Blogform';
import { createBlogPost } from '../services/api';

const AdminCreateBlogPage = () => {
    const handleSubmit = async (formData) => {
        return createBlogPost(formData);
    };
    return (<BlogForm onSubmit={handleSubmit} isEditing={false} />);
};
export default AdminCreateBlogPage;
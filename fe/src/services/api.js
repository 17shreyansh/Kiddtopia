import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; // e.g., http://localhost:5001
const API_URL = `${API_BASE_URL}/api/blogs`;

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// -------------------- PUBLIC ------------------------

export const getAllBlogPosts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching blog posts:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

export const getBlogPostById = async (identifier) => {
    try {
        const response = await axios.get(`${API_URL}/${identifier}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching blog post ${identifier}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// -------------------- PROTECTED ---------------------

export const createBlogPost = async (formData) => {
    try {
        const response = await axios.post(API_URL, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating blog post:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

export const updateBlogPost = async (identifier, formData) => {
    try {
        const response = await axios.put(`${API_URL}/${identifier}`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating blog post ${identifier}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

export const deleteBlogPost = async (identifier) => {
    try {
        const response = await axios.delete(`${API_URL}/${identifier}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting blog post ${identifier}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

export const uploadEditorImage = async (imageData) => {
    try {
        const response = await axios.post(`${API_URL}/upload-editor-image`, imageData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading editor image:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

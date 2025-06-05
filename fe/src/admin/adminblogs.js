import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Popconfirm, Tag, Typography, Card, Image as AntImage } from 'antd'; // Renamed Ant Design Image
import { Link, useNavigate } from 'react-router-dom';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllBlogPosts, deleteBlogPost } from '../services/api';
import dayjs from 'dayjs';

const { Title } = Typography;
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; 

const AdminBlogListPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await getAllBlogPosts();
            if (response.success) {
                setPosts(response.data);
            } else {
                message.error(response.message || 'Failed to fetch posts.');
            }
        } catch (error) {
            message.error(error.message || 'An error occurred while fetching posts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (idOrSlug) => {
        try {
            await deleteBlogPost(idOrSlug);
            message.success('Blog post deleted successfully!');
            fetchPosts();
        } catch (error) {
            message.error(error.message || 'Failed to delete post.');
        }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'mainImage', // This should be 'blogs/filename.jpg'
            key: 'mainImage',
            width: 100,
            render: (imagePath) => 
                imagePath ? (
                    <AntImage
                        width={80}
                        height={50}
                        src={`${imagePath}`} // Constructs http://localhost:5001/uploads/blogs/filename.jpg
                        alt="Post image"
                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                        preview={{ src: `${imagePath}` }}
                        onError={(e) => { 
                            const parent = e.target.parentNode;
                            if (parent) parent.innerHTML = `<div style="width: 80px; height: 50px; background: rgb(240, 240, 240); display: flex; align-items: center; justify-content: center; border-radius: 4px; color: rgb(170, 170, 170); font-size: 12px;">Error</div>`;
                         }}
                    />
                ) : (
                    <div style={{width: 80, height: 50, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', color: '#aaa', fontSize: '12px' }}>No Image</div>
                )
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => <Link to={`/admin/blogs/edit/${record.slug || record._id}`}>{text}</Link>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => (
                <Tag color={status === 'published' ? 'green' : 'orange'}>
                    {status ? status.toUpperCase() : 'N/A'}
                </Tag>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
            sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
            defaultSortOrder: 'descend',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/blogs/edit/${record.slug || record._id}`)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this post?"
                        onConfirm={() => handleDelete(record.slug || record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0 }}>Manage Blog Posts</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/blogs/create')}>
                    Create New Post
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={posts}
                loading={loading}
                rowKey={record => record._id}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
            />
        </Card>
    );
};

export default AdminBlogListPage;
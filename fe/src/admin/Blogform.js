import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, Card, Row, Col, Upload, Typography, Image as AntImage, Space } from 'antd'; // Renamed Ant Design Image
import { SaveOutlined, RollbackOutlined, UploadOutlined } from '@ant-design/icons';
import RichTextEditor from './RichTextEditor';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { Text } = Typography;
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; // e.g., http://localhost:5001

const BlogForm = ({ initialData, onSubmit, isEditing = false }) => {
    const [form] = Form.useForm();
    const [content, setContent] = useState(''); // State for RichTextEditor content
    const [fileList, setFileList] = useState([]);
    const [currentMainImageRelativePath, setCurrentMainImageRelativePath] = useState(null); // e.g., 'blogs/image.jpg'

    const navigate = useNavigate();

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                title: initialData.title,
                status: initialData.status || 'draft',
                metaTitle: initialData.metaTitle,
                metaDescription: initialData.metaDescription,
                slug: initialData.slug,
            });
            // Crucially, set the content for the RichTextEditor here
            setContent(initialData.content || ''); // <--- FIX for blank content on edit

            if (initialData.mainImage) { // mainImage is 'blogs/image.jpg'
                setCurrentMainImageRelativePath(initialData.mainImage);
                setFileList([{
                    uid: '-1', // Static UID for existing image
                    name: initialData.mainImage.split('/').pop(), // Get filename
                    status: 'done',
                    url: `${initialData.mainImage}`, // Full URL for display
                }]);
            } else {
                setCurrentMainImageRelativePath(null);
                setFileList([]);
            }
        } else { // New post
            form.setFieldsValue({ status: 'draft' });
            setContent(''); // Ensure content is empty for new post
            setFileList([]);
            setCurrentMainImageRelativePath(null);
        }
    }, [initialData, form]); // form added as dependency, though content setting is main part

    const handleFormSubmit = async (values) => {
        if (!content.trim() || content === '<p></p>') {
            message.error('Content cannot be empty.');
            return;
        }

        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('content', content); // Use the state `content`
        formData.append('status', values.status);
        formData.append('slug', values.slug ? values.slug.trim() : '');
        if (values.metaTitle) formData.append('metaTitle', values.metaTitle);
        if (values.metaDescription) formData.append('metaDescription', values.metaDescription);

        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('mainImage', fileList[0].originFileObj, fileList[0].name);
        } else if (isEditing && !currentMainImageRelativePath && initialData?.mainImage) {
            formData.append('mainImage', ''); // Signal removal
        }
        // If no new file and currentMainImageRelativePath exists, backend keeps old image.

        try {
            await onSubmit(formData);
            message.success(`Blog post ${isEditing ? 'updated' : 'created'} successfully!`);
            navigate('/admin/blogs');
        } catch (error) {
            const errorMsg = error?.message || (isEditing ? 'Failed to update blog post.' : 'Failed to create blog post.');
            message.error(errorMsg);
        }
    };

    const onContentChange = (newContent) => {
        setContent(newContent); // Update content state
        // No need to form.setFieldsValue for content as it's handled separately
    };

    const mainImageUploadProps = {
    onRemove: () => {
        setFileList([]);
        setCurrentMainImageRelativePath(null);
        return true;
    },
    beforeUpload: (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error(`${file.name} is not an image file.`);
            return Upload.LIST_IGNORE;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must be smaller than 5MB!');
            return Upload.LIST_IGNORE;
        }
        const newFile = {
            uid: file.uid || Date.now().toString(),
            name: file.name,
            status: 'done',
            originFileObj: file,
        };
        setFileList([newFile]);
        setCurrentMainImageRelativePath(null);
        return false;
    },
    fileList: fileList,
    listType: "picture",
    maxCount: 1,
    onChange: ({ fileList: newFileList }) => {
        setFileList(newFileList);
        if (newFileList.length === 0) setCurrentMainImageRelativePath(null);
    }
};


    return (
        <Card title={isEditing ? "Edit Blog Post" : "Create New Blog Post"} bordered={false}>
            <Form form={form} layout="vertical" onFinish={handleFormSubmit} initialValues={{ status: 'draft' }}>
                <Row gutter={24}>
                    <Col xs={24} md={16}>
                        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the title!' }]}>
                            <Input placeholder="Enter blog post title" />
                        </Form.Item>
                        <Form.Item label="Content"
                            // No 'name' needed for Form.Item if value is handled by state and RichTextEditor
                            rules={[{ validator: async () => content.trim() && content !== '<p></p>' ? Promise.resolve() : Promise.reject(new Error('Content cannot be empty!')) }]}
                        >
                            <RichTextEditor value={content} onChange={onContentChange} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card title="Post Settings" size="small">
                            <Form.Item name="slug" label="Slug (URL)" extra="Auto-generates if blank. Use lowercase, numbers, hyphens.">
                                <Input placeholder="e.g., my-awesome-post" />
                            </Form.Item>
                            <Form.Item label="Main Image" extra="Max 5MB. PNG, JPG, GIF, WebP.">
                                <Upload {...mainImageUploadProps}>
                                    <Button icon={<UploadOutlined />}>Select Image</Button>
                                </Upload>
                                {isEditing && currentMainImageRelativePath && (!fileList.length || fileList[0]?.uid === '-1') && (
                                    <div style={{ marginTop: 8 }}>
                                        <Text type="secondary">Current: {currentMainImageRelativePath.split('/').pop()}</Text>
                                        <AntImage
                                            width={100}
                                            src={`${currentMainImageRelativePath}`}
                                            alt="Current main"
                                            style={{ borderRadius: '4px', display: 'block', marginTop: '4px' }}
                                        />
                                    </div>
                                )}
                            </Form.Item>
                            <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select a status!' }]}>
                                <Select placeholder="Select status">
                                    <Option value="draft">Draft</Option>
                                    <Option value="published">Published</Option>
                                </Select>
                            </Form.Item>
                        </Card>
                        <Card title="SEO Settings" size="small" style={{ marginTop: 16 }}>
                            <Form.Item name="metaTitle" label="Meta Title" extra="Recommended: 60-70 characters.">
                                <Input placeholder="SEO friendly title" />
                            </Form.Item>
                            <Form.Item name="metaDescription" label="Meta Description" extra="Recommended: 150-160 characters.">
                                <Input.TextArea rows={3} placeholder="Concise description for search engines" />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>
                <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
                    <Space>
                        <Button icon={<RollbackOutlined />} onClick={() => navigate('/admin/blogs')}>Cancel</Button>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                            {isEditing ? 'Update Post' : 'Create Post'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default BlogForm;
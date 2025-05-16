// frontend/src/components/AdminPage.js
import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Upload,
  Modal,
  Form,
  Input,
  message,
  Spin
} from 'antd';
import { UploadOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Content } = Layout;

const AdminPage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const API_URL = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem('token');

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch gallery items
  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/gallery`, authHeader);
      setGalleryItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      message.error('Failed to load gallery items');
      setLoading(false);
    }
  };

  // Initialize gallery
  const initializeGallery = async () => {
    try {
      await axios.post(`${API_URL}/api/gallery/initialize`, {}, authHeader);
      message.success('Gallery initialized successfully');
      fetchGalleryItems();
    } catch (error) {
      console.error('Error initializing gallery:', error);
      message.error('Failed to initialize gallery');
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const showEditModal = (item) => {
    setCurrentItem(item);
    form.setFieldsValue({
      title: item.title,
    });
    setFileList([]);
    setEditModalVisible(true);
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setUploading(true);

      const formData = new FormData();
      formData.append('itemId', currentItem.itemId);
      formData.append('title', values.title);

      if (fileList.length > 0) {
        formData.append('image', fileList[0].originFileObj);
      }

      await axios.put(`${API_URL}/api/gallery/${currentItem.itemId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setUploading(false);
      setEditModalVisible(false);
      message.success('Gallery item updated successfully');
      fetchGalleryItems();
    } catch (error) {
      console.error('Error updating gallery item:', error);
      message.error('Failed to update gallery item');
      setUploading(false);
    }
  };

  return (
    <Layout>
      <Content style={{ padding: '24px' }}>
        <div style={{ background: '#fff', padding: '24px', minHeight: 280 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Title level={2}>Gallery Admin</Title>
            <Button type="primary" onClick={initializeGallery}>
              Initialize Gallery
            </Button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              {galleryItems.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.itemId}>
                  <Card
                    hoverable
                    cover={
                      <div style={{ height: 200, overflow: 'hidden' }}>
                        <img
                          alt={item.title}
                          src={`${API_URL}${item.image}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    }
                    actions={[
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(item)}
                      >
                        Edit
                      </Button>,
                    ]}
                  >
                    <Card.Meta
                      title={item.title}
                      description={`ID: ${item.itemId}`}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <Modal
            title="Edit Gallery Item"
            open={editModalVisible}
            onCancel={() => setEditModalVisible(false)}
            footer={[
              <Button key="cancel" onClick={() => setEditModalVisible(false)}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={uploading}
                onClick={handleSubmit}
              >
                Save
              </Button>,
            ]}
          >
            {currentItem && (
              <Form
                form={form}
                layout="vertical"
                initialValues={{ title: currentItem.title }}
              >
                <Form.Item
                  name="title"
                  label="Title"
                  rules={[{ required: true, message: 'Please enter a title' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Image"
                  extra="Only JPG/PNG/WebP files. Max 5MB."
                >
                  <Upload
                    listType="picture"
                    maxCount={1}
                    beforeUpload={() => false}
                    onChange={handleFileChange}
                    fileList={fileList}
                  >
                    <Button icon={<UploadOutlined />}>Replace Image</Button>
                  </Upload>
                </Form.Item>

                <div style={{ marginTop: 16 }}>
                  <Text strong>Current Image:</Text>
                  <div style={{ marginTop: 8 }}>
                    <img
                      src={`${API_URL}${currentItem.image}`}
                      alt={currentItem.title}
                      style={{ maxWidth: '100%', maxHeight: 200 }}
                    />
                  </div>
                </div>
              </Form>
            )}
          </Modal>
        </div>
      </Content>
    </Layout>
  );
};

export default AdminPage;

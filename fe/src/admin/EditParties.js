import React, { useState, useEffect } from 'react';
import {
  Layout,
  Typography,
  Form,
  Input,
  Button,
  message,
  Card,
  Switch,
  Upload,
  Space,
  Collapse,
  Divider,
  Spin,
  Modal,
  Popconfirm,
  Alert,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PartiesAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [partyData, setPartyData] = useState({
    mainHeading: '',
    sections: [],
  });
  const [form] = Form.useForm();
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [token, setToken] = useState('');

  // Get JWT token from localStorage or any other secure storage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      message.error('Authentication token not found. Please login.');
    }
  }, []);

  // Fetch party data on component mount (after token is set)
  useEffect(() => {
    if (token) {
      fetchPartyData();
    }
  }, [token]);

  // Setup axios headers with JWT token
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchPartyData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/parties`, axiosConfig);
      const data = response.data || { mainHeading: '', sections: [] };

      setPartyData(data);
      form.setFieldsValue({
        mainHeading: data.mainHeading,
        sections: data.sections.map((section) => ({
          ...section,
          paragraphs: section.paragraphs.join('\n\n'),
        })),
      });
    } catch (error) {
      console.error('Error fetching party data:', error);
      message.error('Failed to load party data');
      setPartyData({ mainHeading: '', sections: [] });
    } finally {
      setLoading(false);
    }
  };

  const updateMainHeading = async (value) => {
    try {
      setSaving(true);
      await axios.put(
        `${BACKEND_URL}/api/parties/heading`,
        { mainHeading: value },
        axiosConfig
      );
      message.success('Main heading updated successfully');
      setPartyData((prev) => ({ ...prev, mainHeading: value }));
    } catch (error) {
      console.error('Error updating main heading:', error);
      message.error('Failed to update main heading');
    } finally {
      setSaving(false);
    }
  };

  const updateSection = async (index, sectionData) => {
    try {
      setSaving(true);
      const paragraphs = sectionData.paragraphs
        .split('\n\n')
        .filter((p) => p.trim());
      const updatedSection = {
        ...sectionData,
        paragraphs,
        images: sectionData.images || partyData.sections[index].images,
      };

      await axios.put(
        `${BACKEND_URL}/api/parties/section/${index}`,
        updatedSection,
        axiosConfig
      );

      setPartyData((prev) => ({
        ...prev,
        sections: prev.sections.map((sec, i) =>
          i === index ? updatedSection : sec
        ),
      }));
      message.success(`Section ${index + 1} updated successfully`);
    } catch (error) {
      console.error('Error updating section:', error);
      message.error('Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  const addSection = async () => {
    try {
      setSaving(true);
      const newSection = {
        title: 'New Section Title',
        paragraphs: ['Add your content here'],
        images: Array(5).fill('/Uploads/parties/placeholder.jpg'),
        reverse: false,
      };

      const response = await axios.post(
        `${BACKEND_URL}/api/parties/section`,
        newSection,
        axiosConfig
      );
      const updatedData = response.data;

      setPartyData(updatedData);
      form.setFieldsValue({
        sections: updatedData.sections.map((section) => ({
          ...section,
          paragraphs: section.paragraphs.join('\n\n'),
        })),
      });
      message.success('New section added');
    } catch (error) {
      console.error('Error adding section:', error);
      message.error('Failed to add new section');
    } finally {
      setSaving(false);
    }
  };

  const deleteSection = async (index) => {
    try {
      setSaving(true);
      await axios.delete(
        `${BACKEND_URL}/api/parties/section/${index}`,
        axiosConfig
      );

      setPartyData((prev) => ({
        ...prev,
        sections: prev.sections.filter((_, i) => i !== index),
      }));

      form.setFieldsValue({
        sections: partyData.sections
          .filter((_, i) => i !== index)
          .map((section) => ({
            ...section,
            paragraphs: section.paragraphs.join('\n\n'),
          })),
      });
      message.success(`Section ${index + 1} deleted successfully`);
    } catch (error) {
      console.error('Error deleting section:', error);
      message.error('Failed to delete section');
    } finally {
      setSaving(false);
    }
  };

  const handleImagePreview = (file) => {
    setPreviewImage(file.url || file.thumbUrl || '');
    setImagePreviewOpen(true);
  };

  const handleImageUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('images', file);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/parties/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onSuccess(response.data);
      message.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Failed to upload image');
      onError(error);
    }
  };

  const CustomImageUpload = ({ value, onChange, index, imageIndex }) => {
    const handleChange = async (info) => {
      if (info.file.status === 'done') {
        const imagePath = info.file.response.imagePaths[0]; // Expecting a string

        setPartyData((prev) => ({
          ...prev,
          sections: prev.sections.map((section, i) =>
            i === index
              ? {
                  ...section,
                  images: section.images.map((img, j) =>
                    j === imageIndex ? imagePath : img
                  ),
                }
              : section
          ),
        }));

        if (onChange) {
          onChange(imagePath);
        }
      }
    };

    const imageSrc =
      value ||
      (partyData.sections[index]?.images?.[imageIndex]) ||
      '/Uploads/parties/placeholder.jpg';

    return (
      <Upload
        name="images"
        listType="picture-card"
        showUploadList={false}
        customRequest={handleImageUpload}
        onChange={handleChange}
        onPreview={handleImagePreview}
      >
        {imageSrc ? (
          <img
            src={`${BACKEND_URL}${imageSrc}`}
            alt={`Section ${index + 1} Image ${imageIndex + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
    );
  };

  const getCollapseItems = () => {
    return partyData.sections.map((section, sectionIndex) => ({
      key: sectionIndex.toString(),
      label: `Section ${sectionIndex + 1}: ${section.title}`,
      extra: (
        <Space>
          <Popconfirm
            title="Are you sure you want to delete this section?"
            onConfirm={() => deleteSection(sectionIndex)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={(e) => e.stopPropagation()}
            >
              Delete
            </Button>
          </Popconfirm>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              const sectionData = form.getFieldValue('sections')[sectionIndex];
              updateSection(sectionIndex, sectionData);
            }}
          >
            Save
          </Button>
        </Space>
      ),
      children: (
        <>
          <Form.Item
            label="Section Title"
            name={['sections', sectionIndex, 'title']}
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Enter section title" />
          </Form.Item>

          <Form.Item
            label="Paragraphs (separate paragraphs with blank lines)"
            name={['sections', sectionIndex, 'paragraphs']}
            rules={[{ required: true, message: 'Please enter content paragraphs' }]}
          >
            <TextArea
              rows={6}
              placeholder="Enter section content paragraphs. Separate paragraphs with blank lines."
            />
          </Form.Item>

          <Form.Item
            label="Reverse Layout"
            name={['sections', sectionIndex, 'reverse']}
            valuePropName="checked"
          >
            <Switch checkedChildren="Yes" unCheckedChildren="No" />
          </Form.Item>

          <Form.Item label="Images (up to 5)">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {Array(5)
                .fill(null)
                .map((_, imageIndex) => (
                  <Form.Item
                    key={imageIndex}
                    name={['sections', sectionIndex, 'images', imageIndex]}
                    noStyle
                  >
                    <CustomImageUpload
                      index={sectionIndex}
                      imageIndex={imageIndex}
                    />
                  </Form.Item>
                ))}
            </div>
            <Text type="secondary">
              Upload up to 5 images. Click on an image to preview or replace it.
            </Text>
          </Form.Item>

          {sectionIndex === 2 && (
            <Alert
              message="Wave Component Placement"
              description="The Wave component will automatically appear centered after this section on the front-end."
              type="info"
              showIcon
            />
          )}
        </>
      ),
    }));
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 20px' }}>
        <Title level={2}>Parties Admin Panel</Title>
      </Header>

      <Content style={{ padding: '20px 50px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', margin: '50px 0' }}>
            <Spin size="large" />
            <p>Loading party data...</p>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              mainHeading: partyData.mainHeading,
              sections: partyData.sections,
            }}
          >
            <Card
              title="Main Heading"
              extra={
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={() => updateMainHeading(form.getFieldValue('mainHeading'))}
                  loading={saving}
                >
                  Save
                </Button>
              }
            >
              <Form.Item
                name="mainHeading"
                rules={[{ required: true, message: 'Please enter the main heading' }]}
              >
                <Input placeholder="Enter main heading" />
              </Form.Item>
            </Card>

            <Divider orientation="left">Party Sections</Divider>

            <Button
              type="dashed"
              onClick={addSection}
              style={{ width: '100%', marginBottom: 20 }}
              icon={<PlusCircleOutlined />}
              disabled={saving}
            >
              Add New Section
            </Button>

            <Collapse items={getCollapseItems()} accordion />
          </Form>
        )}

        <Modal
          open={imagePreviewOpen}
          footer={null}
          onCancel={() => setImagePreviewOpen(false)}
        >
          <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Content>
    </Layout>
  );
};

export default PartiesAdmin;

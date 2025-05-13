import React, { useState, useEffect, useCallback } from 'react';
import {
  Layout,
  Menu,
  Button,
  Upload,
  Input,
  List,
  Card,
  Space,
  Image,
  Typography,
  Divider,
  Spin,
  Row,
  Col,
  Empty,
  Modal,
  Checkbox
} from 'antd';
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Sider, Content } = Layout;
const { TextArea } = Input;
const { Title } = Typography;

const sectionOptions = [
  { key: 'Header', icon: <FileTextOutlined /> },
  { key: 'Section 1', icon: <FileTextOutlined /> },
  { key: 'Section 2', icon: <FileTextOutlined /> },
  { key: 'Section 3', icon: <FileTextOutlined /> },
  { key: 'Section 4', icon: <FileTextOutlined /> },
  { key: 'Section 5', icon: <FileTextOutlined /> },
];

const dummyUploadProps = {
  beforeUpload: () => false,
  multiple: false,
};

const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? '#52c41a' : type === 'error' ? '#ff4d4f' : '#1890ff';

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        padding: '12px 20px',
        borderRadius: '4px',
        backgroundColor: bgColor,
        color: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        animation: 'fadeIn 0.3s, fadeOut 0.3s 2.7s',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'} {message}
    </div>
  );
};

const getDefaultSection = (sectionName) => {
  if (sectionName === 'Header') {
    return { mainTitle: '' };
  }
  return {
    title: '',
    paragraphs: [''],
    images: Array(5).fill().map((_, i) => ({
      src: '/default-party-image.jpg',
      alt: `Party image ${i + 1}`,
    })),
    reverse: false
  };
};

const PartiesEdit = () => {
  const [selectedSection, setSelectedSection] = useState('Header');
  const [contentData, setContentData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageIndex, setImageIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
      showToast('Please log in to edit content', 'error');
      navigate('/login');
    }
  }, [token, navigate]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ visible: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/parties');
      setContentData({
        Header: {
          mainTitle: res.data.header.mainTitle || '',
        },
        ...res.data.sections.reduce((acc, section, index) => ({
          ...acc,
          [`Section ${index + 1}`]: {
            title: section.title,
            paragraphs: section.paragraphs,
            images: section.images,
            reverse: section.reverse
          }
        }), {})
      });
    } catch (err) {
      if (err.response?.status === 404) {
        setContentData({
          Header: { mainTitle: '' },
          'Section 1': getDefaultSection('Section 1'),
          'Section 2': getDefaultSection('Section 2'),
          'Section 3': getDefaultSection('Section 3'),
          'Section 4': getDefaultSection('Section 4'),
          'Section 5': getDefaultSection('Section 5'),
        });
        showToast('No Parties data found. You can create new content.', 'info');
      } else {
        showToast(err.response?.data?.message || 'Failed to fetch Parties data', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const data = contentData[selectedSection] || getDefaultSection(selectedSection);

    try {
      if (selectedSection === 'Header') {
        const res = await axios.put('/api/parties/header', {
          mainTitle: data.mainTitle,
        });
        setContentData((prev) => ({
          ...prev,
          Header: { mainTitle: res.data.header.mainTitle },
        }));
        showToast('Header updated successfully');
      } else {
        const sectionIndex = parseInt(selectedSection.split(' ')[1]) - 1;
        const filteredParagraphs = data.paragraphs.filter(p => p.trim() !== '');
        if (filteredParagraphs.length === 0) {
          showToast('At least one non-empty paragraph is required', 'error');
          setLoading(false);
          return;
        }
        await axios.put(`/api/parties/section/${sectionIndex}`, {
          title: data.title,
          paragraphs: filteredParagraphs,
          reverse: data.reverse,
        });
        if (imageFile && imageIndex !== null) {
          const formData = new FormData();
          formData.append('image', imageFile);
          await axios.post(`/api/parties/section/${sectionIndex}/image/${imageIndex}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
        await fetchData();
        showToast(`${selectedSection} updated successfully`);
        setImageFile(null);
        setImageIndex(null);
      }
    } catch (err) {
      showToast(err.response?.data?.message || `Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateSectionData = (section, data) => {
    setContentData((prev) => ({ ...prev, [section]: data }));
  };

  const handleDeleteItem = async (itemType, index) => {
    Modal.confirm({
      title: `Are you sure you want to delete this ${itemType}?`,
      onOk: async () => {
        const data = contentData[selectedSection] || getDefaultSection(selectedSection);
        try {
          if (itemType === 'paragraph') {
            updateSectionData(selectedSection, {
              ...data,
              paragraphs: data.paragraphs.filter((_, i) => i !== index),
            });
            showToast('Paragraph deleted successfully');
          } else if (itemType === 'image') {
            const sectionIndex = parseInt(selectedSection.split(' ')[1]) - 1;
            await axios.delete(`/api/parties/section/${sectionIndex}/image/${index}`);
            const updatedImages = [...data.images];
            updatedImages[index] = {
              src: '/default-party-image.jpg',
              alt: `Default party image ${index + 1}`,
            };
            updateSectionData(selectedSection, {
              ...data,
              images: updatedImages,
            });
            showToast('Image reset successfully');
          }
        } catch (err) {
          showToast(err.response?.data?.message || 'Failed to delete item', 'error');
        }
      },
    });
  };

  const renderImageList = (images) => (
    <Row gutter={[16, 16]}>
      {images.map((img, idx) => (
        <Col xs={24} sm={12} md={8} lg={6} key={idx}>
          <Card
            hoverable
            cover={
              <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                  }}
                >
                  {idx + 1}
                </div>
                <Image
                  src={img.src}
                  style={{ objectFit: 'cover', width: '100%', height: '200px' }}
                  preview={{ mask: 'View' }}
                />
              </div>
            }
            actions={[
              <Upload
                {...dummyUploadProps}
                onChange={({ fileList }) => {
                  setImageFile(fileList[0]?.originFileObj);
                  setImageIndex(idx);
                }}
                fileList={imageFile && imageIndex === idx ? [{ uid: '-1', name: imageFile.name }] : []}
                onRemove={() => {
                  setImageFile(null);
                  setImageIndex(null);
                }}
                listType="picture"
              >
                <UploadOutlined />
              </Upload>,
              <Button
                icon={<DeleteOutlined />}
                style={{ color: 'red' }}
                onClick={() => handleDeleteItem('image', idx)}
                disabled={img.src === '/default-party-image.jpg'}
              />,
            ]}
          >
            <Card.Meta title={`Image ${idx + 1}`} description={img.alt} />
          </Card>
        </Col>
      ))}
    </Row>
  );

  const renderEditor = () => {
    const data = contentData[selectedSection] || getDefaultSection(selectedSection);

    switch (selectedSection) {
      case 'Header':
        return (
          <Card title={<Title level={4}>Header</Title>} bordered={false} className="content-card">
            <TextArea
              value={data.mainTitle}
              placeholder="Main Title"
              rows={2}
              onChange={(e) => {
                updateSectionData('Header', { ...data, mainTitle: e.target.value });
              }}
            />
          </Card>
        );

      default:
        return (
          <Card
            title={<Title level={4}>{selectedSection}</Title>}
            bordered={false}
            className="content-card"
          >
            <div style={{ marginBottom: 24 }}>
              <Title level={5}>Section Title</Title>
              <Input
                value={data.title}
                placeholder={`${selectedSection} Title`}
                onChange={(e) => {
                  updateSectionData(selectedSection, { ...data, title: e.target.value });
                }}
                style={{ marginBottom: 16 }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <Title level={5}>Layout</Title>
              <Checkbox
                checked={data.reverse}
                onChange={(e) => {
                  updateSectionData(selectedSection, { ...data, reverse: e.target.checked });
                }}
              >
                Reverse Layout
              </Checkbox>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Title level={5}>Images</Title>
              {data.images && data.images.length > 0 ? (
                renderImageList(data.images)
              ) : (
                <Empty description="No images available" />
              )}
            </div>

            <Divider />

            <Title level={5}>Paragraphs</Title>
            <List
              dataSource={data.paragraphs}
              renderItem={(item, idx) => (
                <List.Item
                  actions={[
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteItem('paragraph', idx)}
                    />,
                  ]}
                >
                  <TextArea
                    value={item}
                    rows={3}
                    onChange={(e) => {
                      const updated = [...data.paragraphs];
                      updated[idx] = e.target.value;
                      updateSectionData(selectedSection, { ...data, paragraphs: updated });
                    }}
                  />
                </List.Item>
              )}
              footer={
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() =>
                    updateSectionData(selectedSection, {
                      ...data,
                      paragraphs: [...data.paragraphs, ''],
                    })
                  }
                  block
                >
                  Add Paragraph
                </Button>
              }
            />
          </Card>
        );
    }
  };

  if (!token) {
    showToast('Please log in to edit content', 'error');
    navigate('/login');
    return null;
  }

  return (
    <Layout>
      <Sider
        width={260}
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
        theme="light"
      >
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <Title level={3} style={{ marginBottom: 0, color: '#1890ff' }}>
            Parties Page
          </Title>
          <Divider />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedSection]}
          onClick={({ key }) => setSelectedSection(key)}
          style={{ borderRight: 0 }}
        >
          {sectionOptions.map(({ key, icon }) => (
            <Menu.Item key={key} icon={icon}>
              {key}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ padding: '32px', background: '#f7f9fc' }}>
          <Spin spinning={loading} tip="Processing...">
            {renderEditor()}
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={loading}
              onClick={handleSave}
              style={{
                marginTop: 24,
                height: '48px',
                fontSize: '16px',
                transition: 'all 0.3s',
              }}
              block
            >
              Save Changes
            </Button>
          </Spin>
        </Content>
      </Layout>

      {toast.visible && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
        .content-card {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </Layout>
  );
};

export default PartiesEdit;
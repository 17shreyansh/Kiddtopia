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

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const { Sider, Content } = Layout;
const { TextArea } = Input;
const { Title } = Typography;

const sectionOptions = [
  { key: 'Header', icon: <FileTextOutlined /> },
  { key: 'First Section', icon: <FileTextOutlined /> },
  { key: 'Second Section', icon: <FileTextOutlined /> },
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
  switch (sectionName) {
    case 'Header':
      return { mainTitle: '' };
    case 'First Section':
    case 'Second Section':
      return {
        heading: '',
        paragraphs: [],
        images: Array(4).fill().map(() => ({
          src: `${process.env.REACT_APP_BACKEND_URL}/default-about-image.jpg`,
          alt: `Kiddtopia ${sectionName === 'First Section' ? 'play area' : 'activities'}`,
        })),
      };
    default:
      return {};
  }
};

const AboutEdit = () => {
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
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/about`);
      setContentData({
        Header: {
          mainTitle: res.data.mainTitle,
        },
        'First Section': {
          heading: res.data.firstSection.heading,
          paragraphs: res.data.firstSection.paragraphs,
          images: res.data.firstSection.images,
        },
        'Second Section': {
          heading: res.data.secondSection.heading,
          paragraphs: res.data.secondSection.paragraphs,
          images: res.data.secondSection.images,
        },
      });
    } catch (err) {
      if (err.response?.status === 404) {
        setContentData({
          Header: { mainTitle: '' },
          'First Section': getDefaultSection('First Section'),
          'Second Section': getDefaultSection('Second Section'),
        });
        showToast('No About Us data found. You can create new content.', 'info');
      } else {
        showToast(err.response?.data?.message || 'Failed to fetch About Us data', 'error');
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
        const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/about/header`, {
          mainTitle: data.mainTitle,
        });
        setContentData((prev) => ({
          ...prev,
          Header: { mainTitle: res.data.mainTitle },
          'First Section': res.data.firstSection,
          'Second Section': res.data.secondSection,
        }));
        showToast('Header updated successfully');
      } else {
        const filteredParagraphs = data.paragraphs.filter(p => p.trim() !== '');
        if (filteredParagraphs.length === 0) {
          showToast('At least one non-empty paragraph is required', 'error');
          setLoading(false);
          return;
        }
        const sectionKey = selectedSection === 'First Section' ? 'firstSection' : 'secondSection';
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/about/paragraphs/${sectionKey}`, {
          heading: data.heading,
          paragraphs: filteredParagraphs,
        });
        if (imageFile && imageIndex !== null) {
          const formData = new FormData();
          formData.append('image', imageFile);
          await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/about/image/${sectionKey}/${imageIndex}`, formData, {
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
            const sectionKey = selectedSection === 'First Section' ? 'firstSection' : 'secondSection';
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/about/image/${sectionKey}/${index}`);
            const updatedImages = [...data.images];
            updatedImages[index] = {
              src: `${process.env.REACT_APP_BACKEND_URL}/default-about-image.jpg`,
              alt: `Kiddtopia ${sectionKey === 'firstSection' ? 'play area' : 'activities'}`,
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
                  src={img.src.startsWith('/') ? `${process.env.REACT_APP_BACKEND_URL}${img.src}` : img.src}
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
                disabled={img.src === `${process.env.REACT_APP_BACKEND_URL}/default-about-image.jpg`}
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

      case 'First Section':
      case 'Second Section':
        return (
          <Card
            title={<Title level={4}>{selectedSection}</Title>}
            bordered={false}
            className="content-card"
          >
            <div style={{ marginBottom: 24 }}>
              <Title level={5}>Section Heading</Title>
              <Input
                value={data.heading}
                placeholder={`${selectedSection} Heading`}
                onChange={(e) => {
                  updateSectionData(selectedSection, { ...data, heading: e.target.value });
                }}
                style={{ marginBottom: 16 }}
              />
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

      default:
        return <Empty description="No editor available for this section" />;
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
            About Page
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

export default AboutEdit;
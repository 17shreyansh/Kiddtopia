import React, { useState, useEffect, useCallback } from 'react';
import {
  Layout,
  Menu,
  Button,
  Upload,
  Input,
  List,
  Collapse,
  Card,
  Rate,
  Space,
  Image,
  Typography,
  Divider,
  Spin,
  Row,
  Col,
  Empty,
} from 'antd';
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  PictureOutlined,
  SmileOutlined,
  TeamOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import axios from 'axios';

// Custom toast notification component
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? '#52c41a' : '#ff4d4f';
  
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
        gap: '10px'
      }}
    >
      {type === 'success' ? '✓' : '✗'} {message}
    </div>
  );
};

const { Sider, Content } = Layout;
const { TextArea } = Input;
const { Panel } = Collapse;
const { Title } = Typography;

const sectionOptions = [
  { key: 'About Us', icon: <FileTextOutlined /> },
  { key: 'Why Choose Us', icon: <PictureOutlined /> },
  { key: 'Gallery', icon: <PictureOutlined /> },
  { key: 'Testimonials', icon: <SmileOutlined /> },
  { key: 'Our Partners', icon: <TeamOutlined /> },
  { key: 'FAQs', icon: <QuestionCircleOutlined /> },
];

const dummyUploadProps = {
  beforeUpload: () => false,
  multiple: false,
};

const getDefaultSection = (sectionName) => {
  switch (sectionName) {
    case 'About Us': return { paragraphs: [], images: [] };
    case 'Why Choose Us':
    case 'Gallery':
    case 'Our Partners': return { images: [] };
    case 'Testimonials': return { testimonials: [] };
    case 'FAQs': return { faqs: [] };
    default: return {};
  }
};

const EditHomePage = () => {
  const [selectedSection, setSelectedSection] = useState('About Us');
  const [contentData, setContentData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // Custom notification function
  const showToast = useCallback((message, type = 'success') => {
    setToast({ visible: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  useEffect(() => { fetchData(); }, [selectedSection]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/home/${selectedSection}`);
      setContentData((prev) => ({ ...prev, [selectedSection]: res.data.content || getDefaultSection(selectedSection) }));
    } catch (err) {
      showToast(`Failed to fetch ${selectedSection} data`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const data = contentData[selectedSection] || getDefaultSection(selectedSection);
    const formData = new FormData();
    formData.append('content', JSON.stringify(data));
    if (imageFile) formData.append('image', imageFile);

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/home/${selectedSection}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        showToast(`${selectedSection} updated successfully`);
        setImageFile(null);
        fetchData();
      } else {
        showToast('Save failed', 'error');
      }
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateSectionData = (section, data) => {
    setContentData((prev) => ({ ...prev, [section]: data }));
  };

  const removeItem = (arr, index) => {
    const result = arr.filter((_, i) => i !== index);
    return result;
  };

  const handleDeleteItem = (itemType, index) => {
    const data = contentData[selectedSection] || getDefaultSection(selectedSection);
    
    switch (itemType) {
      case 'paragraph':
        updateSectionData('About Us', { 
          ...data, 
          paragraphs: removeItem(data.paragraphs, index) 
        });
        break;
      case 'image':
        updateSectionData(selectedSection, { 
          ...data,
          images: removeItem(data.images, index) 
        });
        break;
      case 'testimonial':
        updateSectionData('Testimonials', { 
          ...data,
          testimonials: removeItem(data.testimonials, index) 
        });
        break;
      case 'faq':
        updateSectionData('FAQs', { 
          ...data,
          faqs: removeItem(data.faqs, index) 
        });
        break;
    }
    
    showToast(`Item deleted successfully`);
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
                    borderRadius: '50%' 
                  }}
                >
                  {idx + 1}
                </div>
                <Image 
                  src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${img}`} 
                  style={{ objectFit: 'cover', width: '100%', height: '200px' }} 
                  preview={{ mask: 'View' }}
                />
              </div>
            }
            actions={[
              <DeleteOutlined 
                key="delete" 
                style={{ color: 'red' }} 
                onClick={() => handleDeleteItem('image', idx)} 
              />
            ]}
          />
        </Col>
      ))}
    </Row>
  );

  const renderEditor = () => {
    const data = contentData[selectedSection] || getDefaultSection(selectedSection);

    switch (selectedSection) {
      case 'About Us':
        return (
          <Card 
            title={<Title level={4}>About Us</Title>} 
            bordered={false}
            className="content-card"
          >
            <div style={{ marginBottom: 24 }}>
              <Title level={5}>Images</Title>
              <Upload 
                {...dummyUploadProps} 
                onChange={({ fileList }) => setImageFile(fileList[0]?.originFileObj)} 
                fileList={imageFile ? [{ uid: '-1', name: imageFile.name }] : []} 
                onRemove={() => setImageFile(null)}
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
              <Divider />
              {data.images && data.images.length > 0 ? (
                renderImageList(data.images)
              ) : (
                <Empty description="No images uploaded" />
              )}
            </div>
            
            <Divider />
            
            <Title level={5}>Content</Title>
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
                    />
                  ]}
                >
                  <TextArea
                    value={item}
                    rows={3}
                    onChange={(e) => {
                      const updated = [...data.paragraphs];
                      updated[idx] = e.target.value;
                      updateSectionData('About Us', { ...data, paragraphs: updated });
                    }}
                  />
                </List.Item>
              )}
              footer={
                <Button 
                  type="dashed" 
                  icon={<PlusOutlined />} 
                  onClick={() => updateSectionData('About Us', {
                    ...data,
                    paragraphs: [...data.paragraphs, ''],
                  })} 
                  block
                >
                  Add Paragraph
                </Button>
              }
            />
          </Card>
        );

      case 'Why Choose Us':
      case 'Gallery':
      case 'Our Partners':
        return (
          <Card 
            title={<Title level={4}>{selectedSection}</Title>} 
            bordered={false}
            className="content-card"
          >
            <Upload 
              {...dummyUploadProps} 
              onChange={({ fileList }) => setImageFile(fileList[0]?.originFileObj)} 
              fileList={imageFile ? [{ uid: '-1', name: imageFile.name }] : []} 
              onRemove={() => setImageFile(null)}
              listType="picture"
            >
              <Button icon={<UploadOutlined />} type="primary" ghost>Upload New Image</Button>
            </Upload>
            <Divider />
            {data.images && data.images.length > 0 ? (
              renderImageList(data.images)
            ) : (
              <Empty description="No images uploaded" />
            )}
          </Card>
        );

      case 'Testimonials':
        return (
          <Card 
            title={<Title level={4}>Testimonials</Title>} 
            bordered={false}
            className="content-card"
          >
            <List
              dataSource={data.testimonials}
              renderItem={(item, idx) => (
                <List.Item
                  actions={[
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => handleDeleteItem('testimonial', idx)} 
                    />
                  ]}
                >
                  <Card bordered style={{ width: '100%' }}>
                     <Input
                      value={item.name}
                      placeholder='Name'
                      onChange={(e) => {
                        const updated = [...data.testimonials];
                        updated[idx].name = e.target.value;
                        updateSectionData('Testimonials', { ...data, testimonials: updated });
                      }}
                      style={{ marginBottom: 16 }}
                    />
                    <TextArea
                      value={item.paragraph}
                      rows={2}
                      onChange={(e) => {
                        const updated = [...data.testimonials];
                        updated[idx].paragraph = e.target.value;
                        updateSectionData('Testimonials', { ...data, testimonials: updated });
                      }}
                      style={{ marginBottom: 16 }}
                    />
                    <Rate 
                      value={item.stars} 
                      onChange={(val) => {
                        const updated = [...data.testimonials];
                        updated[idx].stars = val;
                        updateSectionData('Testimonials', { ...data, testimonials: updated });
                      }} 
                    />
                  </Card>
                </List.Item>
              )}
              footer={
                <Button 
                  type="dashed" 
                  icon={<PlusOutlined />} 
                  onClick={() => updateSectionData('Testimonials', {
                    ...data,
                    testimonials: [...data.testimonials, { paragraph: '', stars: 5 }],
                  })} 
                  block
                >
                  Add Testimonial
                </Button>
              }
            />
          </Card>
        );

      case 'FAQs':
        return (
          <Card 
            title={<Title level={4}>FAQs</Title>} 
            bordered={false}
            className="content-card"
          >
            <Collapse accordion className="custom-collapse">
              {data.faqs.map((faq, idx) => (
                <Panel 
                  header={faq.title || `Question ${idx + 1}`} 
                  key={idx}
                  extra={
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem('faq', idx);
                      }}
                    />
                  }
                >
                  <Input
                    placeholder="Question"
                    value={faq.title}
                    onChange={(e) => {
                      const faqs = [...data.faqs];
                      faqs[idx].title = e.target.value;
                      updateSectionData('FAQs', { ...data, faqs });
                    }}
                    style={{ marginBottom: 8 }}
                  />
                  <TextArea
                    placeholder="Answer"
                    value={faq.content}
                    rows={3}
                    onChange={(e) => {
                      const faqs = [...data.faqs];
                      faqs[idx].content = e.target.value;
                      updateSectionData('FAQs', { ...data, faqs });
                    }}
                  />
                </Panel>
              ))}
            </Collapse>
            <Button 
              type="dashed" 
              icon={<PlusOutlined />} 
              block 
              style={{ marginTop: 16 }} 
              onClick={() => updateSectionData('FAQs', {
                ...data,
                faqs: [...data.faqs, { title: '', content: '' }],
              })}
            >
              Add FAQ
            </Button>
          </Card>
        );

      default:
        return <Empty description="No editor available for this section" />;
    }
  };

  return (
    <Layout >
      <Sider 
        width={260} 
        style={{ 
          background: '#fff', 
          borderRight: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)' 
        }}
        theme="light"
      >
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <Title level={3} style={{ marginBottom: 0, color: '#1890ff' }}>Home Page</Title>
          <Divider />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedSection]}
          onClick={({ key }) => setSelectedSection(key)}
          style={{ borderRight: 0 }}
        >
          {sectionOptions.map(({ key, icon }) => (
            <Menu.Item key={key} icon={icon}>{key}</Menu.Item>
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
      
      {/* Custom toast notification */}
      {toast.visible && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}
      
      <style jsx global>{`
        /* Custom animations for toast */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-20px); }
        }
        
        /* Custom styling for content cards */
        .content-card {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        
        /* Custom styling for collapse panels */
        .custom-collapse .ant-collapse-header {
          align-items: center !important;
        }
      `}</style>
    </Layout>
  );
};

export default EditHomePage;
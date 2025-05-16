import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Table, 
  Typography, 
  Space, 
  Card,
  Button, 
  Input, 
  Row, 
  Col,
  Modal,
  Tag,
  Breadcrumb,
  Statistic,
  Divider,
  message,
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  EyeOutlined, 
  DeleteOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const AdminFranchiseForms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedForm, setSelectedForm] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  useEffect(() => {
    fetchFranchiseForms();
  }, []);

 const fetchFranchiseForms = async () => {
  setLoading(true);
  const token = localStorage.getItem('token'); // or sessionStorage.getItem('token')
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/franchiseforms`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Stats calculation
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeekForms = response.data.filter(
      (form) => new Date(form.createdAt) >= oneWeekAgo
    ).length;

    const thisMonthForms = response.data.filter(
      (form) => new Date(form.createdAt) >= oneMonthAgo
    ).length;

    setForms(response.data);
    setStats({
      total: response.data.length,
      thisWeek: thisWeekForms,
      thisMonth: thisMonthForms,
    });
  } catch (error) {
    console.error('Error fetching franchise forms:', error);
    message.error('Failed to load franchise form submissions');
  } finally {
    setLoading(false);
  }
};

const handleDeleteForm = async (id) => {
  const token = localStorage.getItem('token');
  try {
    await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/api/franchiseforms/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    message.success('Franchise form deleted successfully');
    fetchFranchiseForms();
    setIsModalVisible(false);
  } catch (error) {
    console.error('Error deleting franchise form:', error);
    message.error('Failed to delete franchise form');
  }
};


  const handleViewForm = (record) => {
    setSelectedForm(record);
    setIsModalVisible(true);
  };



  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredForms = forms.filter(form => 
    form.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
    form.email.toLowerCase().includes(searchText.toLowerCase()) ||
    form.city.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      sorter: (a, b) => a.city.localeCompare(b.city),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewForm(record)}
          >
            View
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteForm(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0 }}>Kidztopia Admin</Title>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={fetchFranchiseForms}
          >
            Refresh
          </Button>
        </div>
      </Header>
      
      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item>Admin</Breadcrumb.Item>
          <Breadcrumb.Item>Franchise Forms</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic 
                title="Total Forms" 
                value={stats.total} 
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic 
                title="This Week" 
                value={stats.thisWeek} 
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic 
                title="This Month" 
                value={stats.thisMonth} 
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        <Card style={{ marginTop: 16 }}>
          <Title level={4}>Franchise Form Submissions</Title>
          <Input
            placeholder="Search by name, email or city"
            value={searchText}
            onChange={handleSearch}
            prefix={<SearchOutlined />}
            style={{ width: 300, marginBottom: 16 }}
            allowClear
          />
          
          <Table
            columns={columns}
            dataSource={filteredForms}
            rowKey="_id"
            loading={loading}
            pagination={{ 
              pageSize: 10,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items` 
            }}
          />
        </Card>
      </Content>

      <Modal
        title="Franchise Form Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>Close</Button>,
          <Button 
            key="delete" 
            danger 
            onClick={() => handleDeleteForm(selectedForm._id)}
          >
            Delete
          </Button>
        ]}
        width={600}
      >
        {selectedForm && (
          <div>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">Submission Date</Text>
                <div>
                  <Tag color="blue">{new Date(selectedForm.createdAt).toLocaleString()}</Tag>
                </div>
              </div>
              
              <Divider orientation="left">Personal Information</Divider>
              
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text type="secondary">Full Name</Text>
                  <div><Text strong>{selectedForm.fullName}</Text></div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Email</Text>
                  <div><Text strong>{selectedForm.email}</Text></div>
                </Col>
              </Row>
              
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text type="secondary">Mobile</Text>
                  <div><Text strong>{selectedForm.mobile}</Text></div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">City</Text>
                  <div><Text strong>{selectedForm.city}</Text></div>
                </Col>
              </Row>
              
              <Divider orientation="left">Message</Divider>
              
              <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 4 }}>
                <Text>{selectedForm.message || "No message provided"}</Text>
              </div>
            </Space>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default AdminFranchiseForms;

// src/components/NewsletterAdmin.js
import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  message,
  Space,
  Popconfirm,
  Tag,
  Switch,
  Statistic,
  Row,
  Col,
  Modal,
  Divider,
  Tooltip,
  Select,
  Typography,
  Input,
  DatePicker
} from 'antd';
import {
  MailOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  DownloadOutlined,
  FilterOutlined,
  SearchOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Define the backend URL using environment variable
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const NewsletterAdmin = () => {
  // Data state
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  // Table state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    status: undefined,
    search: '',
  });

  // Modal state
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);

  // Get token from localStorage (assuming your admin panel stores it there)
  const getAuthToken = () => {
    return localStorage.getItem('adminToken') || localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  // Load data on component mount
  useEffect(() => {
    fetchSubscribers();
    fetchStats();
  }, []);

  // Fetch subscribers with pagination and filters
  const fetchSubscribers = async (page = 1, pageSize = 10, filterParams = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        ...filterParams,
      });

      const token = getAuthToken();
      const response = await fetch(`${BACKEND_URL}/api/newsletter/subscribers?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubscribers(data.data);
        setPagination({
          current: data.pagination.currentPage,
          pageSize: data.pagination.itemsPerPage,
          total: data.pagination.totalItems,
        });
      } else {
        throw new Error(data.message || 'Failed to fetch subscribers');
      }
    } catch (error) {
      console.error('Fetch subscribers error:', error);
      message.error('Failed to load subscribers. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${BACKEND_URL}/api/newsletter/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStats(data.stats);
      } else {
        throw new Error(data.message || 'Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
      message.error('Failed to load statistics.');
    } finally {
      setStatsLoading(false);
    }
  };

  // Handle table changes (pagination, filters, sorting)
  const handleTableChange = (paginationParams, tableFilters, sorter) => {
    const newFilters = { ...filters };
    
    // Update filters based on table filters
    if (tableFilters.isActive) {
      newFilters.status = tableFilters.isActive[0] ? 'active' : 'inactive';
    } else {
      newFilters.status = undefined;
    }

    setFilters(newFilters);
    fetchSubscribers(paginationParams.current, paginationParams.pageSize, newFilters);
  };

  // Handle subscriber status toggle
  const handleStatusChange = async (subscriberId, newStatus) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${BACKEND_URL}/api/newsletter/subscribers/${subscriberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: newStatus }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        message.success('Subscriber status updated successfully');
        fetchSubscribers(pagination.current, pagination.pageSize, filters);
        fetchStats();
      } else {
        throw new Error(data.message || 'Failed to update subscriber');
      }
    } catch (error) {
      console.error('Update subscriber error:', error);
      message.error('Failed to update subscriber status.');
    }
  };

  // Handle subscriber deletion
  const handleDelete = async (subscriberId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${BACKEND_URL}/api/newsletter/subscribers/${subscriberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        message.success('Subscriber deleted successfully');
        fetchSubscribers(pagination.current, pagination.pageSize, filters);
        fetchStats();
      } else {
        throw new Error(data.message || 'Failed to delete subscriber');
      }
    } catch (error) {
      console.error('Delete subscriber error:', error);
      message.error('Failed to delete subscriber.');
    }
  };

  // Show subscriber details
  const showDetails = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setDetailsModalVisible(true);
  };

  // Refresh data
  const handleRefresh = () => {
    fetchSubscribers(pagination.current, pagination.pageSize, filters);
    fetchStats();
    message.success('Data refreshed successfully');
  };

  // Export subscribers (basic CSV export)
  const handleExport = () => {
    try {
      const csvContent = [
        ['Email', 'Status', 'Subscribed Date', 'Source'],
        ...subscribers.map(sub => [
          sub.email,
          sub.isActive ? 'Active' : 'Inactive',
          new Date(sub.createdAt).toLocaleDateString(),
          sub.source || 'Website'
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      message.success('Subscribers exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      message.error('Failed to export subscribers');
    }
  };

  // Table columns definition
  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <Space>
          <MailOutlined style={{ color: '#1890ff' }} />
          <Text copyable>{email}</Text>
        </Space>
      ),
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleStatusChange(record._id, checked)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          size="small"
        />
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      width: 120,
    },
    {
      title: 'Subscribed Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: true,
      width: 150,
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      render: (source) => (
        <Tag color={source === 'website' ? 'blue' : 'green'}>
          {source?.toUpperCase() || 'WEBSITE'}
        </Tag>
      ),
      width: 100,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => showDetails(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this subscriber?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
      width: 100,
    },
  ];

  // Statistics cards component
  const renderStatsCards = () => (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={statsLoading} size="small">
          <Statistic
            title="Total Subscribers"
            value={stats.total || 0}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#1890ff', fontSize: '20px' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={statsLoading} size="small">
          <Statistic
            title="Active Subscribers"
            value={stats.active || 0}
            prefix={<MailOutlined />}
            valueStyle={{ color: '#52c41a', fontSize: '20px' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={statsLoading} size="small">
          <Statistic
            title="Inactive Subscribers"
            value={stats.inactive || 0}
            valueStyle={{ color: '#ff4d4f', fontSize: '20px' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={statsLoading} size="small">
          <Statistic
            title="Last 7 Days"
            value={stats.last7Days || 0}
            valueStyle={{ color: '#722ed1', fontSize: '20px' }}
          />
        </Card>
      </Col>
    </Row>
  );

  // Subscriber details modal
  const renderDetailsModal = () => (
    <Modal
      title="Subscriber Details"
      open={detailsModalVisible}
      onCancel={() => setDetailsModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setDetailsModalVisible(false)}>
          Close
        </Button>
      ]}
      width={600}
    >
      {selectedSubscriber && (
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <Text strong>Email:</Text>
              <div style={{ marginBottom: 12 }}>{selectedSubscriber.email}</div>
            </Col>
            <Col span={12}>
              <Text strong>Status:</Text>
              <div style={{ marginBottom: 12 }}>
                <Tag color={selectedSubscriber.isActive ? 'green' : 'red'}>
                  {selectedSubscriber.isActive ? 'Active' : 'Inactive'}
                </Tag>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Text strong>Subscribed Date:</Text>
              <div style={{ marginBottom: 12 }}>
                {new Date(selectedSubscriber.createdAt).toLocaleString()}
              </div>
            </Col>
            <Col span={12}>
              <Text strong>Source:</Text>
              <div style={{ marginBottom: 12 }}>{selectedSubscriber.source || 'Website'}</div>
            </Col>
          </Row>
          {selectedSubscriber.metadata && (
            <>
              <Divider />
              <Text strong>Additional Information:</Text>
              <div style={{ marginTop: 8 }}>
                {selectedSubscriber.metadata.ipAddress && (
                  <div style={{ marginBottom: 4 }}>
                    <Text type="secondary">IP Address:</Text> {selectedSubscriber.metadata.ipAddress}
                  </div>
                )}
                {selectedSubscriber.metadata.userAgent && (
                  <div style={{ marginBottom: 4 }}>
                    <Text type="secondary">User Agent:</Text> {selectedSubscriber.metadata.userAgent}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ 
        marginBottom: 24, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <Title level={3} style={{ margin: 0 }}>Newsletter Management</Title>
        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            Refresh
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport} type="primary">
            Export CSV
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      {renderStatsCards()}

      {/* Subscribers Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={subscribers}
          rowKey="_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} subscribers`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
          size="small"
        />
      </Card>

      {/* Details Modal */}
      {renderDetailsModal()}
    </div>
  );
};

export default NewsletterAdmin;
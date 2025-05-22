import React, { useState, useEffect } from 'react';
import {
  Layout, // Added for consistent layout
  Table,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Form,
  message,
  Card,
  Tag,
  Popconfirm,
  Row,
  Col,
  Typography,
  // DatePicker // Not used in this component currently
  Breadcrumb // Added for consistent layout
} from 'antd';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import moment from 'moment'; // For consistent date formatting

const { Header, Content, Footer } = Layout; // Destructure Footer
const { Option } = Select;
const { Title } = Typography; // Keep Title if needed for modal or specific sections
const { TextArea } = Input;

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [form] = Form.useForm();

  const statusColors = {
    pending: 'orange',
    confirmed: 'blue',
    completed: 'green',
    cancelled: 'red'
  };

  // Fetch bookings
  const fetchBookings = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        status: filters.status,
        search: filters.search
      });

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/bookings?${params}`);
      const data = await response.json();

      if (data.success) {
        setBookings(data.data);
        setPagination({
          current: data.pagination.current,
          pageSize: data.pagination.pageSize,
          total: data.pagination.total
        });
      } else {
        message.error(data.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      message.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  // Load bookings on component mount and when filters change
  useEffect(() => {
    fetchBookings();
  }, [filters]);

  // Handle table pagination
  const handleTableChange = (pagination) => {
    fetchBookings(pagination.current, pagination.pageSize);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle edit booking
  const handleEdit = (record) => {
    setCurrentBooking(record);
    form.setFieldsValue(record);
    setEditModalVisible(true);
  };

  // Handle view booking
  const handleView = (record) => {
    setCurrentBooking(record);
    setViewModalVisible(true);
  };

  // Handle delete booking
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/bookings/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        message.success('Booking deleted successfully');
        fetchBookings(pagination.current, pagination.pageSize);
      } else {
        message.error(data.message || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      message.error('Failed to delete booking');
    }
  };

  // Handle save booking
  const handleSave = async (values) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/bookings/${currentBooking._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
      const data = await response.json();

      if (data.success) {
        message.success('Booking updated successfully');
        setEditModalVisible(false);
        fetchBookings(pagination.current, pagination.pageSize);
      } else {
        message.error(data.message || 'Failed to update booking');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      message.error('Failed to update booking');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 150,
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
      width: 120,
    },
    {
      title: 'Booking Type',
      dataIndex: 'booking',
      key: 'booking',
      width: 180,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={statusColors[status]} style={{ textTransform: 'capitalize' }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => moment(date).format('MMM DD, YYYY'), // Consistent date format
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            size="small"
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Are you sure you want to delete this booking?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              icon={<DeleteOutlined />}
              danger
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: 0, background: '#fff' }}>
        <Title level={3} style={{ margin: 0, paddingLeft: 24 }}>Party Bookings Admin</Title>
      </Header>
      <Content style={{ margin: '16px' }}>
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item>Admin</Breadcrumb.Item>
          <Breadcrumb.Item>Party Bookings</Breadcrumb.Item>
        </Breadcrumb>

        <Card style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={10} md={8}> {/* Adjust column spans for responsiveness */}
              <Input
                placeholder="Search by name, mobile, or booking type"
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Select
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                style={{ width: '100%' }}
              >
                <Option value="all">All Status</Option>
                <Option value="pending">Pending</Option>
                <Option value="confirmed">Confirmed</Option>
                <Option value="completed">Completed</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
            </Col>
            <Col xs={24} sm={6} md={4}>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchBookings(pagination.current, pagination.pageSize)}
                style={{ width: '100%' }}
              >
                Refresh
              </Button>
            </Col>
          </Row>
        </Card>

        <div style={{ background: '#fff', padding: 24, borderRadius: 4 }}> {/* Encapsulate table in a div with styling */}
          <Table
            columns={columns}
            dataSource={bookings}
            loading={loading}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
            onChange={handleTableChange}
            rowKey="_id"
            scroll={{ x: 800 }}
          />
        </div>
      </Content>

      {/* Edit Modal */}
      <Modal
        title="Edit Booking"
        open={editModalVisible} // Use 'open' instead of 'visible' for Ant Design v5
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="mobile"
            label="Mobile Number"
            rules={[{ required: true, message: 'Please enter mobile number' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="booking"
            label="Booking Type"
            rules={[{ required: true, message: 'Please enter booking type' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="confirmed">Confirmed</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title="Booking Details"
        open={viewModalVisible} // Use 'open' instead of 'visible'
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>
        ]}
        width={500}
      >
        {currentBooking && (
          <div>
            <p><strong>Name:</strong> {currentBooking.fullName}</p>
            <p><strong>Mobile:</strong> {currentBooking.mobile}</p>
            <p><strong>Booking Type:</strong> {currentBooking.booking}</p>
            <p><strong>Status:</strong>
              <Tag color={statusColors[currentBooking.status]} style={{ marginLeft: 8, textTransform: 'capitalize' }}>
                {currentBooking.status}
              </Tag>
            </p>
            <p><strong>Created:</strong> {moment(currentBooking.createdAt).toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {moment(currentBooking.updatedAt).toLocaleString()}</p>
            {currentBooking.notes && (
              <p><strong>Notes:</strong> {currentBooking.notes}</p>
            )}
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default AdminBookings;
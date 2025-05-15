import React, { useState, useEffect } from 'react';
import {
  Layout, Breadcrumb, Table, Tag, Space, Badge, Input, Button, Modal,
  Select, message, Statistic, Card, Row, Col, DatePicker
} from 'antd';
import {
  PhoneOutlined, MailOutlined, MessageOutlined, SearchOutlined,
  CalendarOutlined, TeamOutlined, CheckOutlined, ExclamationOutlined,
  UserOutlined
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ContactLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);
  const [statistics, setStatistics] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    closed: 0,
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    let filtered = [...leads];

    if (searchText) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.fullName.toLowerCase().includes(lower) ||
        lead.email.toLowerCase().includes(lower) ||
        lead.mobile.includes(searchText) ||
        lead.message.toLowerCase().includes(lower)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    if (dateRange) {
      const [start, end] = dateRange;
      filtered = filtered.filter(lead => {
        const leadDate = moment(lead.createdAt);
        return leadDate.isSameOrAfter(start, 'day') && leadDate.isSameOrBefore(end, 'day');
      });
    }

    setFilteredLeads(filtered);
  }, [leads, searchText, statusFilter, dateRange]);

  useEffect(() => {
    setStatistics({
      total: leads.length,
      new: leads.filter(lead => lead.status === 'new').length,
      contacted: leads.filter(lead => lead.status === 'contacted').length,
      closed: leads.filter(lead => lead.status === 'closed').length,
    });
  }, [leads]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/contacts`);
      setLeads(res.data.data);
      setFilteredLeads(res.data.data);
    } catch (err) {
      console.error('Error fetching leads:', err);
      message.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      await axios.put(`${backendUrl}/api/contacts/${currentLead._id}`, { status });
      message.success(`Lead status updated to ${status}`);
      setIsModalVisible(false);
      const updatedLeads = leads.map(lead =>
        lead._id === currentLead._id ? { ...lead, status } : lead
      );
      setLeads(updatedLeads);
    } catch (err) {
      console.error('Update failed:', err);
      message.error('Failed to update status');
    }
  };

const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this lead? This action cannot be undone.");
  if (!confirmDelete) return;

  try {
    await axios.delete(`${backendUrl}/api/contacts/${id}`);
    message.success('Lead deleted');
    // Use effect to update leads
    setLeads(prev => prev.filter(lead => lead._id !== id));
  } catch (err) {
    console.error('Delete failed:', err);
    message.error('Failed to delete lead');
  }
};


  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'blue';
      case 'contacted': return 'orange';
      case 'closed': return 'green';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: text => <strong>{text}</strong>,
    },
    {
      title: 'Contact Info',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <span><PhoneOutlined /> {record.mobile}</span>
          <span><MailOutlined /> {record.email}</span>
        </Space>
      ),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      ellipsis: true,
      render: text => <div style={{ maxWidth: 200 }}>{text}</div>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: status => (
        <Tag color={getStatusColor(status)} style={{ textTransform: 'capitalize' }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: date => moment(date).format('MMM DD, YYYY - h:mm A'),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" onClick={() => showModal(record)}>View</Button>
          <Button danger size="small" onClick={() => handleDelete(record._id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const showModal = (lead) => {
    setCurrentLead(lead);
    setIsModalVisible(true);
  };

  return (
    <Layout >
      <Header style={{ padding: 0, background: '#fff' }} />
      <Content style={{ margin: '16px' }}>
       

        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={6}><Card><Statistic title="Total Leads" value={statistics.total} prefix={<TeamOutlined />} /></Card></Col>
          <Col span={6}><Card><Statistic title="New" value={statistics.new} prefix={<Badge status="processing" />} /></Card></Col>
          <Col span={6}><Card><Statistic title="Contacted" value={statistics.contacted} prefix={<PhoneOutlined />} /></Card></Col>
          <Col span={6}><Card><Statistic title="Closed" value={statistics.closed} prefix={<CheckOutlined />} /></Card></Col>
        </Row>

        <div style={{ background: '#fff', padding: 24, marginBottom: 20, borderRadius: 4 }}>
          <Row gutter={16} align="middle">
            <Col span={8}>
              <Search
                placeholder="Search by name, email, phone or message"
                allowClear
                enterButton
                onSearch={value => setSearchText(value)}
                onChange={e => setSearchText(e.target.value)}
              />
            </Col>
            <Col span={6}>
              <Select style={{ width: '100%' }} defaultValue="all" onChange={value => setStatusFilter(value)}>
                <Option value="all">All</Option>
                <Option value="new">New</Option>
                <Option value="contacted">Contacted</Option>
                <Option value="closed">Closed</Option>
              </Select>
            </Col>
            <Col span={8}>
              <RangePicker style={{ width: '100%' }} onChange={setDateRange} />
            </Col>
            <Col span={2}>
              <Button icon={<SearchOutlined />} onClick={fetchLeads} type="primary" style={{ width: '100%' }}>
                Reset
              </Button>
            </Col>
          </Row>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 4 }}>
          <Table
            columns={columns}
            dataSource={filteredLeads}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Content>

      {/* Modal */}
      {currentLead && (
        <Modal
          title="Lead Details"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width={600}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>Close</Button>,
            <Button key="new" disabled={currentLead.status === 'new'} onClick={() => handleUpdateStatus('new')}>Mark as New</Button>,
            <Button key="contacted" disabled={currentLead.status === 'contacted'} onClick={() => handleUpdateStatus('contacted')}>Mark as Contacted</Button>,
            <Button key="closed" disabled={currentLead.status === 'closed'} onClick={() => handleUpdateStatus('closed')}>Mark as Closed</Button>,
          ]}
        >
          <p><UserOutlined /> <strong>Name:</strong> {currentLead.fullName}</p>
          <p><PhoneOutlined /> <strong>Mobile:</strong> {currentLead.mobile}</p>
          <p><MailOutlined /> <strong>Email:</strong> {currentLead.email}</p>
          <p><CalendarOutlined /> <strong>Submitted On:</strong> {moment(currentLead.createdAt).format('MMMM DD, YYYY - h:mm A')}</p>
          <p><MessageOutlined /> <strong>Message:</strong></p>
          <div style={{ background: '#f5f5f5', padding: 15, borderRadius: 4, whiteSpace: 'pre-wrap' }}>{currentLead.message}</div>
          <div style={{ marginTop: 20 }}>
            <strong>Current Status:</strong>{' '}
            <Tag color={getStatusColor(currentLead.status)}>{currentLead.status}</Tag>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default ContactLeads;

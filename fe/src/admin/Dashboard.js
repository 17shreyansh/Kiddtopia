import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import {
  PictureOutlined,
  FileTextOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Dashboard = () => {
  return (
    <div>
      <Title level={2}>Welcome to the Admin Dashboard</Title>
      <Paragraph>
        Use the menu on the left to manage photos, text content, and sections for the kindergarten website.
      </Paragraph>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            title="Manage Photos"
            bordered={false}
            hoverable
            style={{ textAlign: 'center' }}
            onClick={() => window.location.href = '/admin/edit'}
          >
            <PictureOutlined style={{ fontSize: '36px', color: '#1890ff' }} />
            <p style={{ marginTop: 10 }}>View, Add, or Delete Images</p>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            title="Manage Text Content"
            bordered={false}
            hoverable
            style={{ textAlign: 'center' }}
            onClick={() => window.location.href = '/admin/edit'}
          >
            <FileTextOutlined style={{ fontSize: '36px', color: '#52c41a' }} />
            <p style={{ marginTop: 10 }}>Update school details & info</p>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            title="Admin Info"
            bordered={false}
            hoverable
            style={{ textAlign: 'center' }}
          >
            <UserOutlined style={{ fontSize: '36px', color: '#faad14' }} />
            <p style={{ marginTop: 10 }}>Only one admin can access this panel</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

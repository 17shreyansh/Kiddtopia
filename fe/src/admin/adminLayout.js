import React from 'react';
import { Layout, Menu } from 'antd';
import {
  AppstoreOutlined,
  PlusOutlined,
  EditOutlined,
  LogoutOutlined,
  HomeOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate('/login');
  };

  return (
    <Layout className="admin-layout" style={{ minHeight: '100vh' }}>
      <Sider
        width={200}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          className="logo"
          style={{ color: 'white', fontSize: '20px', margin: '20px' }}
        >
          Kiddtopia
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']}>
          <Menu.Item key="dashboard" icon={<AppstoreOutlined />}>
            <Link to="/admin">Dashboard</Link>
          </Menu.Item>
          
          <SubMenu key="edit" icon={<EditOutlined />} title="Edit Pages">
            <Menu.Item key="home" icon={<HomeOutlined />}>
              <Link to="/admin/edit/home">Home Page</Link>
            </Menu.Item>
            <Menu.Item key="about" icon={<InfoCircleOutlined />}>
              <Link to="/admin/edit/about">About Us</Link>
            </Menu.Item>
            <Menu.Item key="about" icon={<InfoCircleOutlined />}>
              <Link to="/admin/edit/parties">Parties</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ marginLeft: 200 }}>
        <Header style={{ background: '#fff', padding: 0, textAlign: 'center' }}>
          <h2>Admin Panel</h2>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          ©2025 Small School Admin Panel
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

import React from 'react';
import { Layout, Menu } from 'antd';
import {
  AppstoreOutlined,
  EditOutlined,
  LogoutOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  MailOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
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

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['edit', 'forms']}
        >
          <Menu.Item key="/admin" icon={<AppstoreOutlined />}>
            <Link to="/admin">Dashboard</Link>
          </Menu.Item>
<Menu.Item key="/admin/blogs" icon={<FileTextOutlined />}>
    <Link to="/admin/blogs">Blogs</Link>
  </Menu.Item>
          <SubMenu key="edit" icon={<EditOutlined />} title="Edit Pages">
            <Menu.Item key="/admin/edit/home" icon={<HomeOutlined />}>
              <Link to="/admin/edit/home">Home Page</Link>
            </Menu.Item>
            <Menu.Item key="/admin/edit/about" icon={<InfoCircleOutlined />}>
              <Link to="/admin/edit/about">About Us</Link>
            </Menu.Item>
            <Menu.Item key="/admin/edit/parties" icon={<InfoCircleOutlined />}>
              <Link to="/admin/edit/parties">Parties</Link>
            </Menu.Item>
            <Menu.Item key="/admin/edit/services" icon={<InfoCircleOutlined />}>
              <Link to="/admin/edit/services">Our Services</Link>
            </Menu.Item>
            <Menu.Item key="/admin/edit/gallery" icon={<InfoCircleOutlined />}>
              <Link to="/admin/edit/gallery">Gallery</Link>
            </Menu.Item>
          </SubMenu>

          {/* New Forms Dropdown */}
          <SubMenu key="forms" icon={<FileTextOutlined />} title="Forms">
            <Menu.Item key="/admin/forms/contact" icon={<MailOutlined />}>
              <Link to="/admin/forms/contact">Contact Us</Link>
            </Menu.Item>
            <Menu.Item key="/admin/forms/franchise" icon={<SolutionOutlined />}>
              <Link to="/admin/forms/franchise">Franchise Registration</Link>
            </Menu.Item>
             <Menu.Item key="/admin/forms/book" icon={<SolutionOutlined />}>
              <Link to="/admin/forms/book">Party Booking</Link>
            </Menu.Item>
             <Menu.Item key="/admin/forms/newsletter" icon={<SolutionOutlined />}>
              <Link to="/admin/forms/newsletter">Newsletter</Link>
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
          ©2025 Kiddtopia Admin Panel
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

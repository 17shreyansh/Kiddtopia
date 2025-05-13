import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Custom styles if any

const { Title } = Typography;

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/login`, {
        email: values.email,
        password: values.password,
      });

      localStorage.setItem('token', response.data.token);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      try {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/admin'); // Redirect if token is valid
      } catch (err) {
        console.log('Token invalid or expired');
      }
    };
  
    checkAuth();
  }, [navigate]);

  return (
    <div className="login-container">
      <div className="login-box">
        <Title level={2}>Admin Login</Title>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <Button
          type="link"
          onClick={() => navigate('/forgot-password')}
          style={{ padding: 0 }}
        >
          Forgot Password?
        </Button>
      </div>
    </div>
  );
};

export default Login;

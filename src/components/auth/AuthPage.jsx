import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, message, Tabs, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined } from '@ant-design/icons';
import { authService } from '../../services/authService';
import './AuthPage.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AuthPage = ({ onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await authService.login({
        usernameOrEmail: values.usernameOrEmail,
        password: values.password,
      });
      message.success('Login successful!');
      
      // Call the success callback to trigger app state update
      if (onAuthSuccess) {
        onAuthSuccess(response.user);
      }
    } catch (error) {
      message.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    authService.loginWithGoogle();
  };

  const handleRegister = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({
        username: values.username,
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      });
      message.success('Registration successful! You are now logged in.');
      
      // Call the success callback to trigger app state update
      if (onAuthSuccess) {
        onAuthSuccess(response.user);
      }
    } catch (error) {
      message.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Row justify="center" align="middle" style={{ minHeight: '100vh', padding: '20px' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <Card className="auth-card" bordered={false}>
            <div className="auth-header">
              <Title level={2} className="auth-title">
                🎵 PitchPerfecter
              </Title>
              <Text type="secondary" className="auth-subtitle">
                Master your musical ear training
              </Text>
            </div>

            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              centered
              className="auth-tabs"
            >
              <TabPane tab="Login" key="login">
                <Form
                  name="login"
                  onFinish={handleLogin}
                  layout="vertical"
                  size="large"
                  className="auth-form"
                >
                  <Form.Item
                    name="usernameOrEmail"
                    label="Username or Email"
                    rules={[
                      { required: true, message: 'Please enter your username or email' }
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Enter username or email"
                      autoComplete="username"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true, message: 'Please enter your password' }
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Enter password"
                      autoComplete="current-password"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                      className="auth-button"
                    >
                      Login
                    </Button>
                  </Form.Item>

                  <Divider>or</Divider>

                  <Form.Item>
                    <Button
                      icon={<GoogleOutlined />}
                      onClick={handleGoogleLogin}
                      block
                      className="google-auth-button"
                      style={{
                        backgroundColor: '#4285f4',
                        borderColor: '#4285f4',
                        color: 'white'
                      }}
                    >
                      Continue with Google
                    </Button>
                  </Form.Item>

                  <div className="auth-switch">
                    <Text type="secondary">
                      Don't have an account?{' '}
                      <Button type="link" onClick={() => setActiveTab('register')} className="switch-button">
                        Register now
                      </Button>
                    </Text>
                  </div>
                </Form>
              </TabPane>

              <TabPane tab="Register" key="register">
                <Form
                  name="register"
                  onFinish={handleRegister}
                  layout="vertical"
                  size="large"
                  className="auth-form"
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[
                          { required: true, message: 'Please enter your first name' }
                        ]}
                      >
                        <Input placeholder="First name" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[
                          { required: true, message: 'Please enter your last name' }
                        ]}
                      >
                        <Input placeholder="Last name" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                      { required: true, message: 'Please enter a username' },
                      { min: 3, message: 'Username must be at least 3 characters' }
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Choose a username"
                      autoComplete="username"
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true, message: 'Please enter a password' },
                      { min: 6, message: 'Password must be at least 6 characters' }
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Create a password"
                      autoComplete="new-password"
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Please confirm your password' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Passwords do not match'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                      className="auth-button"
                    >
                      Create Account
                    </Button>
                  </Form.Item>

                  <Divider>or</Divider>

                  <Form.Item>
                    <Button
                      icon={<GoogleOutlined />}
                      onClick={handleGoogleLogin}
                      block
                      className="google-auth-button"
                      style={{
                        backgroundColor: '#4285f4',
                        borderColor: '#4285f4',
                        color: 'white'
                      }}
                    >
                      Sign up with Google
                    </Button>
                  </Form.Item>

                  <div className="auth-switch">
                    <Text type="secondary">
                      Already have an account?{' '}
                      <Button type="link" onClick={() => setActiveTab('login')} className="switch-button">
                        Login here
                      </Button>
                    </Text>
                  </div>
                </Form>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AuthPage;

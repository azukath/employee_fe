'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SmileFilled } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  Select,
  Slider,
  Switch,
  ConfigProvider,
  Flex,
  Card,
  Input,
  Spin,
} from 'antd';
import theme from '../themeConfig';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post(`http://localhost:3000/auth/login`, {
        email: values.email,
        password: values.password,
      });

      const token = res.data.access_token as string;
      Cookies.set('token', token);
      Cookies.set('adminId', res.data.user.adminId);
      router.push('/');
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin fullscreen size="large" />;
  }

  return (
    <div>
      <Flex style={{ height: '100vh' }} justify="center" align="center">
        <Card title="Login" style={{ width: 400 }}>
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={handleLogin}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Flex>
    </div>
  );
};

export default LoginPage;

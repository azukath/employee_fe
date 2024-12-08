// components/AdminForm.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  Layout,
  message,
  Spin,
} from 'antd';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import moment from 'moment';
import Cookies from 'js-cookie';

const { Content } = Layout;

interface Admin {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  password: string;
}

interface AdminFormProps {
  mode: 'add' | 'edit';
}

const AdminForm: React.FC<AdminFormProps> = ({ mode }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const adminId = searchParams.get('id');

  useEffect(() => {
    if (mode === 'edit' && adminId) {
      fetchAdminDetails(adminId);
    }
  }, [mode, adminId]);

  const fetchAdminDetails = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get<Admin>(
        `http://localhost:3000/admin/detail`,
        {
          params: {
            adminId: adminId,
          },
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        },
      );
      const admin = response.data;
      form.setFieldsValue({
        ...admin,
        dateOfBirth: moment(admin.dateOfBirth),
      });
    } catch (error) {
      console.error('Failed to fetch admin details:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (mode === 'add') {
        await axios.post(
          'http://localhost:3000/admin',
          {
            ...values,
            dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('token')}`,
            },
          },
        );
        message.success('Admin added successfully');
      } else if (mode === 'edit' && adminId) {
        await axios.post(
          `http://localhost:3000/admin/update`,
          {
            ...values,
            dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
            adminId: adminId,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('token')}`,
            },
          },
        );
        message.success('Admin details updated successfully');
      }
      router.push('/');
    } catch (error) {
      console.error('Failed to submit admin details:', error);
      message.error('Failed to submit admin details');
    } finally {
      setLoading(false);
    }
  };

  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
    },
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <>
      <Button
        style={{ marginBottom: 10 }}
        type="default"
        onClick={() => router.push('/')}
      >
        Back
      </Button>
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '24px' }}>
          <Form
            form={form}
            name="adminForm"
            onFinish={onFinish}
            validateMessages={validateMessages}
            layout="vertical"
          >
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: 'email', required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="dateOfBirth"
              label="Date of Birth"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio value="Male">Male</Radio>
                <Radio value="Female">Female</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    </>
  );
};

export default AdminForm;

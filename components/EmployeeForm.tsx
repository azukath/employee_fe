// components/EmployeeForm.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Radio, Layout, message, Spin } from 'antd';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

const { Content } = Layout;
const { TextArea } = Input;

interface Employee {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phoneNumber: string;
  address: string;
}

interface EmployeeFormProps {
  mode: 'add' | 'edit';
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ mode }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('id');

  useEffect(() => {
    if (mode === 'edit' && employeeId) {
      fetchEmployeeDetails(employeeId);
    }
  }, [mode, employeeId]);

  const fetchEmployeeDetails = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get<Employee>(
        `http://localhost:3000/employee/detail`,
        {
          params: {
            employeeId: id,
          },
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        },
      );
      const employee = response.data;
      form.setFieldsValue({
        ...employee,
      });
    } catch (error) {
      console.error('Failed to fetch employee details:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (mode === 'add') {
        await axios.post(
          'http://localhost:3000/employee',
          {
            ...values,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('token')}`,
            },
          },
        );
        message.success('Employee added successfully');
      } else if (mode === 'edit' && employeeId) {
        await axios.put(
          `http://localhost:3000/employee/update`,
          {
            ...values,
            employeeId: employeeId,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('token')}`,
            },
          },
        );
        message.success('Employee details updated successfully');
      }
      router.push('/');
    } catch (error) {
      console.error('Failed to submit employee details:', error);
      message.error('Failed to submit employee details');
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
            name="employeeForm"
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
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true }]}
            >
              <TextArea rows={4} />
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

export default EmployeeForm;

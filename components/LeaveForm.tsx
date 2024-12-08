// components/LeaveForm.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Layout,
  Spin,
  message,
} from 'antd';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import moment from 'moment';

const { Content } = Layout;
const { TextArea } = Input;

interface Leave {
  reason: string;
  startDate: string;
  endDate: string;
  employeeId: string;
}

interface Employee {
  employeeId: string;
  firstName: string;
  lastName: string;
}

interface LeaveFormProps {
  mode: 'add' | 'edit';
}

const LeaveForm: React.FC<LeaveFormProps> = ({ mode }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const leaveId = searchParams.get('id');

  useEffect(() => {
    fetchEmployees();
    if (mode === 'edit' && leaveId) {
      fetchLeaveDetails(leaveId);
    }
  }, [mode, leaveId]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get<Employee[]>(
        'http://localhost:3000/employee',
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        },
      );
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const fetchLeaveDetails = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get<Leave>(
        `http://localhost:3000/leave/detail`,
        {
          params: {
            leaveId: id,
          },
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        },
      );
      const leave = response.data;
      form.setFieldsValue({
        ...leave,
        startDate: moment(leave.startDate),
        endDate: moment(leave.endDate),
        employeeId: leave.employeeId,
      });
    } catch (error) {
      console.error('Failed to fetch leave details:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (mode === 'add') {
        await axios.post(
          'http://localhost:3000/leave',
          {
            ...values,
            startDate: values.startDate.format('YYYY-MM-DD'),
            endDate: values.endDate.format('YYYY-MM-DD'),
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('token')}`,
            },
          },
        );
      } else if (mode === 'edit' && leaveId) {
        await axios.post(
          `http://localhost:3000/leave/update`,
          {
            ...values,
            startDate: values.startDate.format('YYYY-MM-DD'),
            endDate: values.endDate.format('YYYY-MM-DD'),
            leaveId: leaveId,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('token')}`,
            },
          },
        );
      }

      return router.push('/');
    } catch (error) {
      console.error('Failed to submit leave details:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateMessages = {
    required: '${label} is required!',
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <>
      {contextHolder}
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
            name="leaveForm"
            onFinish={onFinish}
            validateMessages={validateMessages}
            layout="vertical"
          >
            <Form.Item
              name="employeeId"
              label="Employee"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select an employee"
                // onChange={(e, k) => form.setFieldValue('employeeId', k)}
              >
                {employees.map((employee) => (
                  <Select.Option
                    key={employee.employeeId}
                    value={employee.employeeId}
                  >
                    {employee.firstName} {employee.lastName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="reason"
              label="Reason"
              rules={[{ required: true }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: '100%' }} />
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

export default LeaveForm;

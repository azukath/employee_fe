'use client';

import { Button, Layout, Space, Table } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const { Content } = Layout;

interface Leave {
  reason: string;
  startDate: string;
  endDate: string;
  phoneNumber: string;
  address: string;
  gender: string;
  leaveId: string;
  employeeFirstName: string;
  employeeLastName: string;
}

interface ApiResponse {
  data: Leave[];
  total: number;
  perPage: number;
  page: number;
}

const LeaveMenu: React.FC = () => {
  const [data, setData] = useState<Leave[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const router = useRouter();

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>(
        `http://localhost:3000/leave/list?page=${page}&perPage=10`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        },
      );
      setData(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleUpdateLeave = (leaveId: string) => {
    router.push(`/leave/update-leave?id=${leaveId}`);
  };

  const handleAddLeave = () => {
    router.push('/leave/add-leave');
  };

  const handleDeleteLeave = async (leaveId: string) => {
    try {
      await axios.post(
        `http://localhost:3000/leave/delete/${leaveId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        },
      );
      fetchData(currentPage);
    } catch (error) {
      console.error('Failed to delete leave:', error);
    }
  };

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'employeeFirstName',
      key: 'employeeFirstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'employeeLastName',
      key: 'employeeLastName',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Leave) => (
        <Space>
          <Button
            type="dashed"
            onClick={() => handleUpdateLeave(record.leaveId)}
          >
            Update
          </Button>
          <Button
            type="default"
            onClick={() => handleDeleteLeave(record.leaveId)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '24px' }}>
        <Space.Compact
          block
          style={{
            marginBottom: 16,
            justifyContent: 'space-between',
            display: 'flex',
          }}
        >
          <Button type="primary" onClick={handleAddLeave}>
            Add Leave
          </Button>
        </Space.Compact>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="leaveId"
          pagination={{
            current: currentPage,
            total: total,
            pageSize: 10,
          }}
          loading={loading}
          onChange={handleTableChange}
        />
      </Content>
    </Layout>
  );
};

export default LeaveMenu;

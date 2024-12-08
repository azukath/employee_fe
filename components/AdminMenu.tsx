// components/AdminMenu.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Table, Layout, Input, Button, Space } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const { Content } = Layout;
const { Search } = Input;

interface User {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  adminId: string;
}

interface ApiResponse {
  data: User[];
  total: number;
  perPage: number;
  page: number;
}

const AdminMenu: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();

  const fetchData = async (page: number, search: string = '') => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>(
        `http://localhost:3000/admin/list?page=${page}&perPage=10&search=${search}`,
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
    fetchData(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleUpdateAdmin = (adminId: string) => {
    router.push(`/admin/update-admin?id=${adminId}`);
  };

  const handleDeleteAdmin = async (adminId: string) => {
    try {
      await axios.post(
        `http://localhost:3000/admin/delete/${adminId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        },
      );
      fetchData(currentPage);
    } catch (error) {
      console.error('Failed to delete admin:', error);
    }
  };

  const handleAddAdmin = () => {
    router.push('/admin/add-admin');
  };

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: User) => (
        <Space>
          <Button
            type="dashed"
            onClick={() => handleUpdateAdmin(record.adminId)}
          >
            Update
          </Button>
          <Button
            type="default"
            onClick={() => handleDeleteAdmin(record.adminId)}
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
          <Search
            placeholder="Search by name"
            onSearch={handleSearch}
            enterButton
            allowClear
            style={{ width: '50%' }}
          />
          <Button type="primary" onClick={handleAddAdmin}>
            Add Admin
          </Button>
        </Space.Compact>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="adminId"
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

export default AdminMenu;

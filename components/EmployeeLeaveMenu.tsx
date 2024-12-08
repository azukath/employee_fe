// components/EmployeeLeaveMenu.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Table, Layout, Input, Button, Space } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const { Content } = Layout;
const { Search } = Input;

interface Leave {
  leaveId: string;
  reason: string;
  startDate: string;
  endDate: string;
}

interface Employee {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  gender: string;
  employeeId: string;
  leaveList: Leave[];
}

interface ApiResponse {
  data: Employee[];
  total: number;
  perPage: number;
  page: number;
}

const EmployeeLeaveMenu: React.FC = () => {
  const [data, setData] = useState<Employee[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();

  const fetchData = async (page: number, search: string = '') => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>(
        `http://localhost:3000/employee/list?page=${page}&perPage=10&search=${search}`,
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
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
  ];

  const expandedRowRender = (record: Employee) => {
    const leaveColumns = [
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
    ];

    return (
      <Table
        columns={leaveColumns}
        dataSource={record.leaveList}
        rowKey="leaveId"
        pagination={false}
      />
    );
  };

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '24px' }}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="employeeId"
          pagination={{
            current: currentPage,
            total: total,
            pageSize: 10,
          }}
          loading={loading}
          onChange={handleTableChange}
          expandable={{ expandedRowRender }}
        />
      </Content>
    </Layout>
  );
};

export default EmployeeLeaveMenu;

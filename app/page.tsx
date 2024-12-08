'use client';

import { Button, Layout, Menu, Space, Spin } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AdminMenu from '../components/AdminMenu';
import EmployeeMenu from '../components/EmployeeMenu';
import LeaveMenu from '../components/LeaveMenu';
import EmployeeLeaveMenu from '../components/EmployeeLeaveMenu';

const { Header, Sider, Content } = Layout;

const HomePage = () => {
  const router = useRouter();
  const [selectedMenuItem, setSelectedMenuItem] = useState('1');
  const [loading, setLoading] = useState<boolean>(false);

  const handleMenuClick = (e: any) => {
    setSelectedMenuItem(e.key);
  };

  const RenderContent = () => {
    switch (selectedMenuItem) {
      case '1':
        return <AdminMenu />;
      case '2':
        return <EmployeeMenu />;
      case '3':
        return <LeaveMenu />;
      case '4':
        return <EmployeeLeaveMenu />;
      default:
        return null;
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.post(
        `http://localhost:3000/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        },
      );

      Cookies.remove('token');
      router.push('/');
    } catch (error) {
      console.log('error', error);
      Cookies.remove('token');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin fullscreen size="large" />;
  }

  return (
    <div>
      <Header
        className="site-layout-background"
        style={{
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ color: 'aliceblue' }}>Employee App</div>
        <Space align="center">
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>
          <Button
            type="dashed"
            onClick={() =>
              router.push(`/admin/update-profile?id=${Cookies.get('adminId')}`)
            }
          >
            Profile
          </Button>
        </Space>
      </Header>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
            onClick={handleMenuClick}
          >
            <Menu.Item key="1">Admin</Menu.Item>
            <Menu.Item key="2">Pegawai</Menu.Item>
            <Menu.Item key="3">Cuti</Menu.Item>
            <Menu.Item key="4">Cuti Pegawai</Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <RenderContent />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default HomePage;

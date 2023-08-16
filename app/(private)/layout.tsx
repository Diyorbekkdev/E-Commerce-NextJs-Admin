'use client'
import React, { useState, ReactNode} from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CreditCardOutlined,
  UserOutlined,
  UserSwitchOutlined,
  ProjectOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import { useRouter } from 'next/navigation';

interface MenuItem {
  key: string;
  icon: JSX.Element;
  label: string;
  route: string;
}

const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    icon: <UserOutlined />,
    label: 'Dashboard',
    route: '/admin/dashboard',
  },
  {
    key: 'users',
    icon: <UserSwitchOutlined />,
    label: 'Users',
    route: '/admin/users',
  },
  {
    key: 'categories',
    icon: <ProjectOutlined/>,
    label: 'Categories',
    route: '/admin/categories',
  },
  {
    key: 'products',
    icon: <MedicineBoxOutlined />,
    label: 'Products',
    route: '/admin/products',
  },
  {
    key: 'payment',
    icon: <CreditCardOutlined />,
    label: 'Payment',
    route: '/admin/payment',
  },
];

const { Header, Sider, Content } = Layout;

interface DashboardProps {
  children: ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const router = useRouter();
  const {
    token: { colorBgContainer },
  } = theme.useToken();


  const handleMenuClick = (menuItem: MenuItem) => {
    router.push(menuItem.route);
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <div style={{marginBottom: '25px', marginTop: '25px', display: 'flex', alignItems:'center',justifyContent: 'center'}}>
          <span style={{color: '#fff', fontWeight: 'bold', fontFamily:'cursive'}}>Abdulaziz Dashboard</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          onClick={({ key }) => {
            const menuItem = menuItems.find(item => item.key === key);
            if (menuItem) {
              handleMenuClick(menuItem);
            }
          }}
          items={menuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
          }))}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#2a485f', borderRadius:'0px 0px 10px 10px' }}>
          <Button
            color='#fff'
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <span style={{fontWeight: 'bold', fontSize: '25px', color: '#fff'}}>E-commerce</span>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;

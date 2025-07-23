import React, { useContext } from 'react';
import { Breadcrumb, Layout, Menu, theme, Button, Space } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { ConfigContext } from '../globalStates/ConfigContext';
const { Header, Content } = Layout;

const HeaderComponent = () => {
    const { user, onLogout } = useContext(ConfigContext);
    const location = useLocation();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const getNavItems = () => {
        const baseItems = [
            {
                key: '/',
                label: <Link to="/"> Home </Link>
            },
            {
                key: '/train',
                label: <Link to="/train"> Train </Link>
            },
            {
                key: '/play',
                label: <Link to="/play"> Play </Link>
            },
            {
                key: '/about',
                label: <Link to="/about"> About </Link>
            }
        ];

        if (user) {
            // Authenticated user - show dashboard and logout
            baseItems.push({
                key: '/dashboard',
                label: <Link to="/dashboard"> Dashboard </Link>
            });
        }

        return baseItems;
    };

    // Determine which menu item should be selected based on current path
    const getSelectedKeys = () => {
        const path = location.pathname;
        
        // Direct path matches
        if (path === '/') return ['/'];
        if (path === '/train') return ['/train'];
        if (path === '/play') return ['/play'];
        if (path === '/about') return ['/about'];
        if (path === '/dashboard') return ['/dashboard'];
        
        // For nested paths, select the parent
        if (path.startsWith('/train')) return ['/train'];
        if (path.startsWith('/play')) return ['/play'];
        if (path.startsWith('/dashboard')) return ['/dashboard'];
        
        // Default to home for unknown paths
        return ['/'];
    };

    const getUserSection = () => {
        if (user) {
            return (
                <Space>
                    <span style={{ color: 'white' }}>Welcome, {user.username}!</span>
                    <Button type="primary" onClick={onLogout}>
                        Logout
                    </Button>
                </Space>
            );
        } else {
            return (
                <Space>
                    <span style={{ color: 'rgba(255,255,255,0.65)' }}>Guest Mode</span>
                    <Link to="/auth">
                        <Button type="primary">
                            Login / Register
                        </Button>
                    </Link>
                </Space>
            );
        }
    };

    return (
        <Layout>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div className="demo-logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        selectedKeys={getSelectedKeys()}
                        items={getNavItems()}
                        style={{
                            flex: 1,
                            minWidth: 0,
                        }}
                    />
                </div>
                <div style={{ marginLeft: '20px' }}>
                    {getUserSection()}
                </div>
            </Header>
        </Layout>
    );
};
export default HeaderComponent;
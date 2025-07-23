import React, { useContext } from 'react';
import { Breadcrumb, Layout, Menu, theme, Button, Space } from 'antd';
import { Link } from 'react-router-dom';
import { ConfigContext } from '../globalStates/ConfigContext';
const { Header, Content } = Layout;

const HeaderComponent = () => {
    const { user, onLogout } = useContext(ConfigContext);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const getNavItems = () => {
        const baseItems = [
            {
                key: 1,
                label: <Link to="/"> Home </Link>
            },
            {
                key: 2,
                label: <Link to="/train"> Train </Link>
            },
            {
                key: 4,
                label: <Link to="/play"> Play </Link>
            },
            {
                key: 6,
                label: <Link to="/about"> About </Link>
            }
        ];

        if (user) {
            // Authenticated user - show dashboard and logout
            baseItems.push({
                key: 7,
                label: <Link to="/dashboard"> Dashboard </Link>
            });
        }

        return baseItems;
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
                        defaultSelectedKeys={['1']}
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
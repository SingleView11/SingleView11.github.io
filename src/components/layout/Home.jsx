import React, { useContext } from 'react';
import { Breadcrumb, Layout, Menu, theme, Card, Button, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { ConfigContext } from '../globalStates/ConfigContext';
import { RandomCard1, RandomCard2, DemoCard, DemoCard2 } from '../uiItems/TrainCards';
import { RandomCardListNum, TrainCardList } from '../uiItems/TrainCardList';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const HomeComponent = () => {
    const { user } = useContext(ConfigContext);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const getWelcomeMessage = () => {
        if (user) {
            return (
                <div>
                    <Title level={2}>Welcome back, {user.username}! 🎵</Title>
                    <Text>Ready to continue your pitch training journey?</Text>
                </div>
            );
        } else {
            return (
                <div>
                    <Title level={2}>Welcome to Pitch Perfecter! 🎵</Title>
                    <Text>Start training your ear for music immediately - no registration required!</Text>
                </div>
            );
        }
    };

    const getQuickstartSection = () => {
        return (
            <div style={{ marginTop: '30px' }}>
                <Title level={3}>Quick Start</Title>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Card>
                        <Title level={4}>🎯 Interval Training</Title>
                        <Text>Learn to identify musical intervals by ear</Text>
                        <br />
                        <Link to="/train">
                            <Button type="primary" style={{ marginTop: '10px' }}>
                                Start Training
                            </Button>
                        </Link>
                    </Card>
                    
                    <Card>
                        <Title level={4}>🎮 Play Mode</Title>
                        <Text>Practice with chord progressions and melodies</Text>
                        <br />
                        <Link to="/play">
                            <Button type="primary" style={{ marginTop: '10px' }}>
                                Start Playing
                            </Button>
                        </Link>
                    </Card>

                    {user && (
                        <Card>
                            <Title level={4}>📊 Your Analytics</Title>
                            <Text>View your progress and detailed statistics</Text>
                            <br />
                            <Link to="/dashboard">
                                <Button type="primary" style={{ marginTop: '10px' }}>
                                    View Dashboard
                                </Button>
                            </Link>
                        </Card>
                    )}

                    {!user && (
                        <Card style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
                            <Title level={4}>💾 Save Your Progress</Title>
                            <Text>Register for free to track your improvement over time!</Text>
                            <br />
                            <Link to="/auth">
                                <Button type="primary" style={{ marginTop: '10px' }}>
                                    Register Now
                                </Button>
                            </Link>
                        </Card>
                    )}
                </Space>
            </div>
        );
    };

    return (
        <Layout>
            <Content
                style={{
                    padding: '0 48px',
                }}
            >
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {getWelcomeMessage()}
                    
                    <div style={{ marginTop: '20px' }}>
                        <Text>
                            This is a place where you can effectively train your listening skills. 
                            With constant practice, you will be able to achieve at least relative pitch perfect.
                        </Text>
                    </div>

                    {getQuickstartSection()}
                </div>
            </Content>
        </Layout>
    );
};
export default HomeComponent;
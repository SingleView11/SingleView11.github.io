import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Typography, 
  Spin, 
  message, 
  Progress, 
  List, 
  Tag,
  Empty,
  Button
} from 'antd';
import { 
  TrophyOutlined, 
  FireOutlined, 
  CalendarOutlined,
  BarChartOutlined,
  SoundOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import trainingService from '../services/trainingService';
import authService from '../services/authService';
import { ConfigContext } from './globalStates/ConfigContext';
import './Dashboard.css';

const { Title, Text } = Typography;

const Dashboard = () => {
  const { user } = useContext(ConfigContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentTraining, setRecentTraining] = useState([]);
  const [sessionSummaries, setSessions] = useState([]);
  const hasFetched = useRef(false); // Track if we've already fetched data

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Prevent duplicate fetches
      if (hasFetched.current) {
        console.log('Dashboard data already fetched, skipping...');
        return;
      }
      
      try {
        setLoading(true);
        hasFetched.current = true; // Mark as fetched immediately
        console.log('Fetching dashboard data for user:', user);
        
        // Fetch all dashboard data in parallel
        console.log('Making API calls...');
        
        // Test connection first
        console.log('Testing API connection...');
        const testResult = await trainingService.testConnection();
        console.log('Connection test result:', testResult);
        
        if (!testResult.authenticated) {
          throw new Error('Not authenticated');
        }
        
        if (testResult.error) {
          throw new Error(`API connection failed: ${JSON.stringify(testResult.error)}`);
        }
        
        const [analyticsData, statsData, recentData, sessionsData] = await Promise.all([
          trainingService.getUserAnalytics(),
          trainingService.getTrainingStats(),
          trainingService.getRecentTraining(10),
          trainingService.getSessionSummaries(5)
        ]);

        console.log('Analytics data:', analyticsData);
        console.log('Stats data:', statsData);
        console.log('Recent data:', recentData);
        console.log('Sessions data:', sessionsData);

        setAnalytics(analyticsData);
        setStats(statsData);
        setRecentTraining(recentData || []);
        setSessions(sessionsData || []);
        
        message.success('Dashboard data loaded successfully');
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        message.error(`Failed to load dashboard data: ${error.message || 'Unknown error'}`);
        hasFetched.current = false; // Reset on error to allow retry
      } finally {
        setLoading(false);
      }
    };

    if (user && !hasFetched.current) {
      console.log('User is logged in, fetching dashboard data...');
      fetchDashboardData();
    } else {
      if (!user) {
        console.log('No user logged in, skipping dashboard data fetch');
      } else {
        console.log('Dashboard data already fetched for this user');
      }
      setLoading(false);
    }
  }, [user]);

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTrainingTypeColor = (type) => {
    const colors = {
      'interval_recognition': 'blue',
      'chord_recognition': 'green',
      'scale_recognition': 'purple',
      'melody_training': 'orange',
      'rhythm_training': 'red'
    };
    return colors[type] || 'default';
  };

  const formatTrainingType = (type) => {
    return type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Training';
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <Title level={4} style={{ marginTop: 16 }}>Loading your progress...</Title>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Title level={3}>Please log in to view your dashboard</Title>
          <Button type="primary" onClick={() => navigate('/auth')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <Title level={2}>
          🎵 Welcome back, {user?.firstName || user?.username}!
        </Title>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Text type="secondary">Here's your musical training progress</Text>
          <Button 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            type="text"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Today's Practice"
              value={stats?.todayCount || 0}
              prefix={<FireOutlined style={{ color: '#ff4d4f' }} />}
              suffix="questions"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="This Week"
              value={stats?.weekCount || 0}
              prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
              suffix="questions"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Practice"
              value={stats?.totalCount || 0}
              prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
              suffix="questions"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Training Types"
              value={analytics?.typeStats?.length || 0}
              prefix={<SoundOutlined style={{ color: '#722ed1' }} />}
              suffix=" practiced"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Training Analytics */}
        <Col xs={24} lg={12}>
          <Card title={<><BarChartOutlined /> Training Performance</>} className="dashboard-card">
            {analytics?.typeStats && analytics.typeStats.length > 0 ? (
              <div>
                {analytics.typeStats.map((stat, index) => (
                  <div key={index} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text strong>{formatTrainingType(stat.trainingType)}</Text>
                      <Text>{Math.round(stat.accuracy * 100)}%</Text>
                    </div>
                    <Progress 
                      percent={Math.round(stat.accuracy * 100)} 
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }}
                    />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {stat.correctAnswers} correct out of {stat.totalQuestions} questions
                    </Text>
                  </div>
                ))}
              </div>
            ) : (
              <Empty 
                description="No training data yet. Start practicing to see your progress!"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>

        {/* Recent Training Activity */}
        <Col xs={24} lg={12}>
          <Card title={<><ClockCircleOutlined /> Recent Activity</>} className="dashboard-card">
            {recentTraining.length > 0 ? (
              <List
                dataSource={recentTraining.slice(0, 8)}
                renderItem={(item) => (
                  <List.Item>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <Tag color={getTrainingTypeColor(item.trainingType)}>
                            {formatTrainingType(item.trainingType)}
                          </Tag>
                          <span style={{ marginLeft: '8px' }}>
                            <Text>{item.musicalElement}</Text>
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div>
                            {item.isCorrect ? (
                              <Tag color="success">✓ Correct</Tag>
                            ) : (
                              <Tag color="error">✗ Wrong</Tag>
                            )}
                          </div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {formatDate(item.completedAt)}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty 
                description="No recent training activity"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Training Sessions */}
      {sessionSummaries.length > 0 && (
        <Row style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card title="Recent Training Sessions" className="dashboard-card">
              <List
                dataSource={sessionSummaries}
                renderItem={(session) => (
                  <List.Item>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <Text strong>Training Session</Text>
                          <br />
                          <Text type="secondary">
                            {session.questionCount} questions • {Math.round(session.accuracy * 100)}% accuracy
                          </Text>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <Progress 
                            type="circle" 
                            size={60} 
                            percent={Math.round(session.accuracy * 100)}
                            strokeColor={{
                              '0%': '#108ee9',
                              '100%': '#87d068',
                            }}
                          />
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {formatDate(session.sessionStart)}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Action Buttons */}
      <Row style={{ marginTop: 24 }} gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Button 
            type="primary" 
            size="large" 
            icon={<PlayCircleOutlined />}
            block
            onClick={() => navigate('/train')}
          >
            Start Training
          </Button>
        </Col>
        <Col xs={24} sm={12}>
          <Button 
            size="large" 
            block
            onClick={() => navigate('/play')}
          >
            Play Mode
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

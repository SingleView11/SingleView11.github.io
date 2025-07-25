import React, { useState, useContext } from 'react';
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
  Button,
  Select,
  DatePicker,
  Space
} from 'antd';
import { 
  TrophyOutlined, 
  FireOutlined, 
  CalendarOutlined,
  BarChartOutlined,
  SoundOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  LineChartOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { GET_DASHBOARD_DATA, GET_RECENT_TRAINING } from '../graphql/queries';
import { ConfigContext } from './globalStates/ConfigContext';
import './Dashboard.css';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Dashboard = () => {
  const { user } = useContext(ConfigContext);
  const navigate = useNavigate();
  
  // Performance chart state
  const [chartTimeRange, setChartTimeRange] = useState('7d');
  const [chartMode, setChartMode] = useState('accuracy');
  const [customDateRange, setCustomDateRange] = useState(null);

  // GraphQL query for dashboard data
  const { loading, error, data, refetch } = useQuery(GET_DASHBOARD_DATA, {
    skip: !user, // Skip query if user is not logged in
    fetchPolicy: 'cache-and-network', // Always check for fresh data
    onCompleted: (data) => {
      message.success('Dashboard data loaded successfully');
    },
    onError: (error) => {
      console.error('Failed to fetch dashboard data:', error);
      message.error(`Failed to load dashboard data: ${error.message}`);
    }
  });

  // Separate query for chart data with more recent training records
  const { data: chartData, loading: chartLoading, refetch: refetchChart } = useQuery(GET_RECENT_TRAINING, {
    variables: { limit: 50 }, // Get more data for chart
    skip: !user,
    fetchPolicy: 'cache-and-network', // Always check for fresh data
  });

  // Refetch data when component becomes visible (e.g., returning from training)
  React.useEffect(() => {
    const handleFocus = () => {
      if (user && !loading && !chartLoading) {
        refetch();
        refetchChart();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, loading, chartLoading, refetch, refetchChart]);

  // Refetch data when user changes (after login)
  React.useEffect(() => {
    if (user) {
      // Small delay to ensure token is properly available
      setTimeout(() => {
        refetch();
        refetchChart();
      }, 200);
    }
  }, [user, refetch, refetchChart]);

  // Extract data from GraphQL response
  const analytics = data?.userAnalytics;
  console.log('Extracted analytics:', analytics);
  const stats = {
    todayCount: data?.todayTrainingCount || 0,
    weekCount: data?.weekTrainingCount || 0,
    totalCount: analytics?.typeStats?.reduce((sum, stat) => sum + stat.totalQuestions, 0) || 0
  };
  console.log('Calculated stats:', stats);
  const recentTraining = chartData?.recentTraining || [];
  const sessionSummaries = data?.sessionSummaries || [];
  // Refetch function for manual refresh
  const handleRefresh = async () => {
    message.loading('Refreshing dashboard...', 0.5);
    try {
      await Promise.all([refetch(), refetchChart()]);
      message.success('Dashboard refreshed successfully!');
    } catch (err) {
      message.error('Failed to refresh dashboard');
    }
  };

  // Utility functions
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

  // Generate chart data based on time range and mode
  const generateChartData = () => {
    if (!recentTraining || recentTraining.length === 0) {
      return null;
    }

    // Filter data based on time range
    const now = dayjs();
    let startDate;
    
    if (customDateRange && customDateRange.length === 2) {
      startDate = customDateRange[0];
    } else {
      switch (chartTimeRange) {
        case '7d':
          startDate = now.subtract(7, 'day');
          break;
        case '30d':
          startDate = now.subtract(30, 'day');
          break;
        case '90d':
          startDate = now.subtract(90, 'day');
          break;
        default:
          startDate = now.subtract(7, 'day');
      }
    }

    // Group data by date
    const dataByDate = {};
    recentTraining.forEach(item => {
      const itemDate = dayjs(item.completedAt);
      if (itemDate.isAfter(startDate)) {
        const dateKey = itemDate.format('YYYY-MM-DD');
        if (!dataByDate[dateKey]) {
          dataByDate[dateKey] = {
            date: dateKey,
            total: 0,
            correct: 0,
            byType: {}
          };
        }
        
        dataByDate[dateKey].total++;
        if (item.isCorrect) {
          dataByDate[dateKey].correct++;
        }
        
        // Group by training type
        const type = item.trainingType;
        if (!dataByDate[dateKey].byType[type]) {
          dataByDate[dateKey].byType[type] = { total: 0, correct: 0 };
        }
        dataByDate[dateKey].byType[type].total++;
        if (item.isCorrect) {
          dataByDate[dateKey].byType[type].correct++;
        }
      }
    });

    // Convert to array and sort by date
    const sortedData = Object.values(dataByDate).sort((a, b) => 
      dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1
    );

    return sortedData;
  };

  // Generate ECharts options
  const getChartOptions = () => {
    const data = generateChartData();
    if (!data || data.length === 0) {
      return null;
    }

    const dates = data.map(d => dayjs(d.date).format('MMM DD'));
    
    let series = [];
    let yAxisName = '';
    
    if (chartMode === 'accuracy') {
      yAxisName = 'Accuracy (%)';
      series = [
        {
          name: 'Overall Accuracy',
          type: 'line',
          data: data.map(d => ((d.correct / d.total) * 100).toFixed(1)),
          smooth: true,
          lineStyle: { color: '#1890ff', width: 3 },
          itemStyle: { color: '#1890ff' }
        }
      ];
      
      // Add series for each training type
      const typeColors = {
        'interval_recognition': '#52c41a',
        'chord_recognition': '#722ed1',
        'note_recognition': '#fa8c16',
        'melody_recognition': '#eb2f96'
      };
      
      Object.keys(typeColors).forEach(type => {
        const typeData = data.map(d => {
          if (d.byType[type]) {
            return ((d.byType[type].correct / d.byType[type].total) * 100).toFixed(1);
          }
          return null;
        });
        
        if (typeData.some(d => d !== null)) {
          series.push({
            name: formatTrainingType(type),
            type: 'line',
            data: typeData,
            smooth: true,
            lineStyle: { color: typeColors[type], width: 2 },
            itemStyle: { color: typeColors[type] }
          });
        }
      });
    } else if (chartMode === 'volume') {
      yAxisName = 'Questions';
      series = [
        {
          name: 'Total Questions',
          type: 'bar',
          data: data.map(d => d.total),
          itemStyle: { color: '#1890ff' }
        },
        {
          name: 'Correct Answers',
          type: 'bar',
          data: data.map(d => d.correct),
          itemStyle: { color: '#52c41a' }
        }
      ];
    }

    return {
      title: {
        text: `Training Performance - ${chartMode === 'accuracy' ? 'Accuracy' : 'Volume'}`,
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      legend: {
        data: series.map(s => s.name),
        top: '10%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        axisLabel: { rotate: 45 }
      },
      yAxis: {
        type: 'value',
        name: yAxisName,
        nameLocation: 'middle',
        nameGap: 50
      },
      series: series,
      animationDuration: 1000
    };
  };

  if (loading || chartLoading) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <Title level={4} style={{ marginTop: 16 }}>Loading your progress...</Title>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Title level={4} type="danger">Error loading dashboard</Title>
          <p>{error.message}</p>
          <Button type="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
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
    <div className="dashboard-container" style={{ padding: '24px' }}>
      <Card>
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              🎵 Welcome back, {user?.firstName || user?.username}!
            </Title>
            <Text type="secondary">Here's your musical training progress</Text>
          </div>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={loading || chartLoading}
            type="primary"
            ghost
          >
            Refresh
          </Button>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24, marginTop: 24 }}>
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

      {/* Performance Chart */}
      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card 
            title={<><LineChartOutlined /> Performance Analytics</>} 
            className="dashboard-card"
            extra={
              <Space>
                <Select
                  value={chartMode}
                  onChange={setChartMode}
                  style={{ width: 120 }}
                >
                  <Option value="accuracy">Accuracy</Option>
                  <Option value="volume">Volume</Option>
                </Select>
                <Select
                  value={chartTimeRange}
                  onChange={(value) => {
                    setChartTimeRange(value);
                    if (value !== 'custom') {
                      setCustomDateRange(null);
                    }
                  }}
                  style={{ width: 100 }}
                >
                  <Option value="7d">7 Days</Option>
                  <Option value="30d">30 Days</Option>
                  <Option value="90d">90 Days</Option>
                  <Option value="custom">Custom</Option>
                </Select>
                {chartTimeRange === 'custom' && (
                  <RangePicker
                    value={customDateRange}
                    onChange={setCustomDateRange}
                    format="YYYY-MM-DD"
                  />
                )}
              </Space>
            }
          >
            {recentTraining.length > 0 ? (
              <div style={{ height: '400px' }}>
                <ReactECharts 
                  option={getChartOptions()} 
                  style={{ height: '100%', width: '100%' }}
                  opts={{ renderer: 'canvas' }}
                />
              </div>
            ) : (
              <Empty 
                description="No training data available for chart"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ padding: '60px 0' }}
              />
            )}
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
      </Card>
    </div>
  );
};

export default Dashboard;

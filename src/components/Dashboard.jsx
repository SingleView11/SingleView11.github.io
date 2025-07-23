import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_DATA } from '../graphql/queries';
import authService from '../services/authService';
import './Dashboard.css';

const Dashboard = () => {
  const { loading, error, data, refetch } = useQuery(GET_DASHBOARD_DATA, {
    errorPolicy: 'all',
  });

  const handleLogout = () => {
    authService.logout();
    window.location.reload(); // Simple reload to reset app state
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your training data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-state">
          <h3>Unable to load data</h3>
          <p>Error: {error.message}</p>
          <button onClick={() => refetch()} className="retry-button">
            Try Again
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    );
  }

  const { userAnalytics, recentTraining, todayTrainingCount, weekTrainingCount, sessionSummaries } = data || {};

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome back, {userAnalytics?.username || 'User'}!</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <div className="dashboard-grid">
        {/* Training Statistics */}
        <div className="dashboard-card stats-card">
          <h3>Training Activity</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{todayTrainingCount || 0}</span>
              <span className="stat-label">Today</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{weekTrainingCount || 0}</span>
              <span className="stat-label">This Week</span>
            </div>
          </div>
        </div>

        {/* User Analytics */}
        <div className="dashboard-card analytics-card">
          <h3>Performance Analytics</h3>
          {userAnalytics?.typeStats?.length > 0 ? (
            <div className="analytics-list">
              {userAnalytics.typeStats.map((stat) => (
                <div key={stat.trainingType} className="analytics-item">
                  <div className="analytics-header">
                    <span className="training-type">{stat.trainingType}</span>
                    <span className="accuracy">{(stat.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="analytics-details">
                    <span>{stat.correctAnswers}/{stat.totalQuestions} correct</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${stat.accuracy * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No training data yet. Start practicing to see your progress!</p>
          )}
        </div>

        {/* Recent Training */}
        <div className="dashboard-card recent-card">
          <h3>Recent Training</h3>
          {recentTraining?.length > 0 ? (
            <div className="recent-list">
              {recentTraining.map((record) => (
                <div key={record.id} className={`recent-item ${record.isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="recent-info">
                    <span className="musical-element">{record.musicalElement}</span>
                    <span className="training-type">{record.trainingType}</span>
                  </div>
                  <div className="recent-result">
                    <span className={`result-icon ${record.isCorrect ? 'correct' : 'incorrect'}`}>
                      {record.isCorrect ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No recent training records.</p>
          )}
        </div>

        {/* Session Summaries */}
        <div className="dashboard-card sessions-card">
          <h3>Recent Sessions</h3>
          {sessionSummaries?.length > 0 ? (
            <div className="sessions-list">
              {sessionSummaries.map((session) => (
                <div key={session.sessionId} className="session-item">
                  <div className="session-info">
                    <span className="session-date">
                      {new Date(session.sessionStart).toLocaleDateString()}
                    </span>
                    <span className="session-details">
                      {session.questionCount} questions
                    </span>
                  </div>
                  <div className="session-accuracy">
                    {(session.accuracy * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No session data available.</p>
          )}
        </div>
      </div>

      <div className="dashboard-actions">
        <button className="action-button primary">
          Start Training
        </button>
        <button className="action-button secondary">
          View Full Analytics
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

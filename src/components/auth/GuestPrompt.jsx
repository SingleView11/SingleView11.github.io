import React from 'react';
import { Modal, Button, Typography, Space } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const GuestPrompt = ({ visible, onClose, sessionStats }) => {
  return (
    <Modal
      title="Great Training Session!"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="continue" onClick={onClose}>
          Continue as Guest
        </Button>,
        <Link key="register" to="/auth">
          <Button type="primary" onClick={onClose}>
            Register to Save Progress
          </Button>
        </Link>
      ]}
      width={400}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text>
          You've completed a training session! 
        </Text>
        
        {sessionStats && (
          <div>
            <Text strong>Session Summary:</Text>
            <ul>
              <li>Questions: {sessionStats.totalQuestions}</li>
              <li>Correct: {sessionStats.correctAnswers}</li>
              <li>Accuracy: {((sessionStats.correctAnswers / sessionStats.totalQuestions) * 100).toFixed(1)}%</li>
            </ul>
          </div>
        )}
        
        <Text type="secondary">
          Register for free to:
        </Text>
        <ul>
          <li>Save your training progress</li>
          <li>View detailed analytics</li>
          <li>Track improvement over time</li>
          <li>Compare performance across training types</li>
        </ul>
      </Space>
    </Modal>
  );
};

export default GuestPrompt;

import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Spin, message } from 'antd';
import { authService } from '../../services/authService';
import { ConfigContext } from '../globalStates/ConfigContext';

const OAuth2Redirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useContext(ConfigContext);

  useEffect(() => {
    const handleOAuth2Redirect = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        message.error('OAuth2 authentication failed');
        navigate('/auth');
        return;
      }

      if (token) {
        try {
          // Handle the OAuth2 token
          const user = authService.handleOAuth2Redirect(token);
          
          if (user) {
            setUser(user);
            message.success('Successfully logged in with Google!');
            navigate('/dashboard');
          } else {
            message.error('Failed to process authentication');
            navigate('/auth');
          }
        } catch (error) {
          console.error('OAuth2 redirect error:', error);
          message.error('Authentication failed');
          navigate('/auth');
        }
      } else {
        message.error('No authentication token received');
        navigate('/auth');
      }
    };

    handleOAuth2Redirect();
  }, [searchParams, navigate, setUser]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <Spin size="large" />
      <p style={{ marginTop: '16px' }}>Processing authentication...</p>
    </div>
  );
};

export default OAuth2Redirect;

// App.js
import { Routes, Route, HashRouter, BrowserRouter, useNavigate, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import apolloClient from './services/apolloClient';
import authService from './services/authService';

import AboutComponent from './components/layout/About';
// import IntroductionPage from "./components/layout/IntroductionPage"
import HeaderComponent from './components/layout/Header';
import FooterComponent from './components/layout/Footer';
import ErrorComponent from './components/layout/ErrorPage';
import HomeComponent from './components/layout/Home';
import TrainGround from './components/train/trainGround';
import RepairComponent from './components/layout/Repair';
import AuthPage from './components/auth/AuthPage';
import Dashboard from './components/Dashboard';

import 'antd-button-color/dist/css/style.css';

import { useState, useEffect } from 'react';
import { ConfigContext } from './components/globalStates/ConfigContext';
import { initialConfig } from './components/configs/trainConfig';
import { PlayGround } from './components/play/playGround';

const AppContent = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState(initialConfig)
  const [trainState, setTrainState] = useState(0)
  const [progress, setProgress] = useState({})
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    // Redirect to home page after successful login
    navigate('/');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <ConfigContext.Provider value={{
      config: config, setConfig: setConfig,
      trainState: trainState, setTrainState: setTrainState,
      progress: progress, setProgress: setProgress,
      user: user, setUser: setUser,
      onAuthSuccess: handleAuthSuccess,
      onLogout: handleLogout,
    }}>
      <HeaderComponent></HeaderComponent>
      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/about" element={<AboutComponent />} />
        <Route path='/train' element={<TrainGround />} />
        <Route 
          path='/auth' 
          element={
            user ? 
              <Navigate to="/" replace /> : 
              <AuthPage onAuthSuccess={handleAuthSuccess} />
          } 
        />
        <Route 
          path='/dashboard' 
          element={
            user ? 
              <Dashboard /> : 
              <Navigate to="/auth" replace />
          } 
        />
        <Route path='/listen' element={<RepairComponent />} />
        <Route path='/play' element={<PlayGround />} />
        <Route path='/setting' element={<PlayGround />} />
        <Route 
          path='/user' 
          element={
            user ? 
              <Dashboard /> : 
              <Navigate to="/auth" replace />
          } 
        />
        <Route path='*' element={<ErrorComponent />} />
      </Routes>
      <FooterComponent></FooterComponent>
    </ConfigContext.Provider>
  );
};

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
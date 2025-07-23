import { gql } from '@apollo/client';

// User Analytics Query
export const GET_USER_ANALYTICS = gql`
  query GetUserAnalytics {
    userAnalytics {
      userId
      username
      typeStats {
        trainingType
        totalQuestions
        correctAnswers
        accuracy
      }
    }
  }
`;

// Recent Training Query
export const GET_RECENT_TRAINING = gql`
  query GetRecentTraining($limit: Int = 10) {
    recentTraining(limit: $limit) {
      id
      trainingType
      musicalElement
      playMode
      userAnswer
      isCorrect
      completedAt
      sessionId
    }
  }
`;

// Training History Query
export const GET_TRAINING_HISTORY = gql`
  query GetTrainingHistory($startDate: String!, $endDate: String!) {
    trainingHistory(startDate: $startDate, endDate: $endDate) {
      id
      trainingType
      musicalElement
      playMode
      userAnswer
      isCorrect
      completedAt
      sessionId
    }
  }
`;

// Session Summaries Query
export const GET_SESSION_SUMMARIES = gql`
  query GetSessionSummaries($limit: Int = 10) {
    sessionSummaries(limit: $limit) {
      sessionId
      sessionStart
      questionCount
      accuracy
    }
  }
`;

// Training Statistics Query
export const GET_TRAINING_STATS = gql`
  query GetTrainingStats {
    todayTrainingCount
    weekTrainingCount
  }
`;

// Element Accuracy Query
export const GET_ELEMENT_ACCURACY = gql`
  query GetElementAccuracy($trainingType: String!) {
    elementAccuracy(trainingType: $trainingType) {
      element
      accuracy
    }
  }
`;

// Progress by Type Query
export const GET_PROGRESS_BY_TYPE = gql`
  query GetProgressByType($trainingType: String!, $limit: Int = 50) {
    progressByType(trainingType: $trainingType, limit: $limit) {
      id
      trainingType
      musicalElement
      playMode
      isCorrect
      completedAt
    }
  }
`;

// Session Details Query
export const GET_SESSION_DETAILS = gql`
  query GetSessionDetails($sessionId: String!) {
    session(sessionId: $sessionId) {
      id
      trainingType
      musicalElement
      playMode
      userAnswer
      isCorrect
      completedAt
    }
  }
`;

// Combined Dashboard Query (efficient single request)
export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    userAnalytics {
      userId
      username
      typeStats {
        trainingType
        totalQuestions
        correctAnswers
        accuracy
      }
    }
    recentTraining(limit: 5) {
      id
      trainingType
      musicalElement
      isCorrect
      completedAt
    }
    todayTrainingCount
    weekTrainingCount
    sessionSummaries(limit: 3) {
      sessionId
      sessionStart
      questionCount
      accuracy
    }
  }
`;

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { authService } from './authService';

// HTTP link to your GraphQL endpoint - use environment variables
const httpLink = createHttpLink({
  uri: 'https://dirnot.website/graphql'  // Always use /api/graphql path in production
    
});



// Auth link to add JWT token to requests
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from authService
  const token = authService.getToken();
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Create Apollo Client instance
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    // Configure cache policies for better performance
    typePolicies: {
      Query: {
        fields: {
          recentTraining: {
            // Cache training data for 5 minutes
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          userAnalytics: {
            // Cache analytics for 10 minutes
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  
  // Default options for queries
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export default apolloClient;

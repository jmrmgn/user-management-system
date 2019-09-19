import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloProvider } from '@apollo/react-hooks';

import { currentUser } from './utils/';
import { ApolloLink } from 'apollo-link';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql'
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    const { extensions, message } = graphQLErrors[0];
    if (extensions === 'UNAUTHENTICATED' || message === 'Unauthorized') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }

  if (networkError) {
    console.log('Network error', networkError);
  }
});

const cache = new InMemoryCache();
const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache,
  resolvers: {}
});

const user = currentUser();
const data = {
  currentUser: {
    ...user,
    __typename: 'User'
  },
  networkStatus: {
    __typename: 'NetworkStatus',
    isConnected: false
  }
};

cache.writeData({ data });

client.onResetStore(() => cache.writeData({ data }));

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

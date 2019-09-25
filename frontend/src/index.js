import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';

import { currentUser } from './utils/';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';
import { ApolloProvider } from '@apollo/react-hooks';

const user = currentUser();

const data = {
  currentUser: user
};

const cache = new InMemoryCache({ data });

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    // const { extensions, message } = graphQLErrors[0];
    // if (extensions === 'UNAUTHENTICATED' || message === 'Unauthorized') {
    //   localStorage.removeItem('token');
    //   window.location.href = '/login';
    // }
    // console.log(graphQLErrors, networkError);
  }

  if (networkError) {
    console.log('Network error', networkError);
  }
});

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle;
      Promise.resolve(operation)
        .then(operation => {
          const token = localStorage.getItem('token');
          if (token) {
            operation.setContext({
              headers: {
                authorization: `Bearer ${token}`
              }
            });
          }
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include'
});

const isTokenExpired = token => {
  try {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) return false;
    return true;
  } catch (err) {
    return false;
  }
};

const client = new ApolloClient({
  link: ApolloLink.from([
    new TokenRefreshLink({
      accessTokenField: 'token',
      isTokenValidOrUndefined: () => {
        const token = localStorage.getItem('token');
        return isTokenExpired(token) || !token;
      },
      fetchAccessToken: () => {
        return fetch('http://localhost:4000/refresh_token', {
          method: 'POST',
          credentials: 'include'
        });
      },
      handleFetch: token => {
        localStorage.setItem('token', token);
      },
      handleError: err => {
        console.error(err);
      }
    }),
    errorLink,
    requestLink,
    httpLink
  ]),
  cache
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

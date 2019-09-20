import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

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
  uri: 'http://localhost:4000/graphql'
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, requestLink, httpLink]),
  cache
});

// cache.writeData({ data });

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import { Layout, Row } from 'antd';

import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';

// Layout
import { Navbar } from './layout';

// Components
import { Home, Users, Login, Signup } from './pages';

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

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const { Content } = Layout;
function App(props) {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Layout>
          <div className="App">
            <Navbar />
            <Content>
              <Row
                type="flex"
                justify="center"
                align="middle"
                style={{ minHeight: 500 }}
              >
                <Route exact path="/" component={Home} />
                <Route exact path="/users" component={Users} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/signup" component={Signup} />
              </Row>
            </Content>
          </div>
        </Layout>
      </Router>
    </ApolloProvider>
  );
}

export default App;

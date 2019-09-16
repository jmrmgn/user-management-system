import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import { Layout, Row } from 'antd';

// Apollo
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

// Layout
import { Navbar } from './layout';

// Components
import { Home, Users, Login, Signup } from './pages';

const URI = `http://127.0.0.1:4000/graphql`;
const client = new ApolloClient({
  uri: URI,
  cache: new InMemoryCache(),
  credentials: 'include'
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

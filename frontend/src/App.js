import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import { Layout, Row } from 'antd';

// Layout
import { Navbar } from './layout';

// Components
import { PrivateRoute } from './components';

// Pages
import { Home, Users, Login, Signup } from './pages';

const { Content } = Layout;

function App(props) {
  return (
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
              <PrivateRoute exact path="/users" component={Users} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
            </Row>
          </Content>
        </div>
      </Layout>
    </Router>
  );
}

export default App;

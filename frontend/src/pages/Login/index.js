import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Card, Form, Row, Col, Input, Icon, Button } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const loginQuery = gql`
  mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
        name
      }
    }
  }
`;

function Login(props) {
  const { history } = props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useMutation(loginQuery);

  const handleClick = async () => {
    const variables = { username, password };
    const { data } = await login({
      variables
    });
    const token = data.login.token;

    localStorage.setItem('token', token);

    history.push('/users');
  };

  return (
    <Form onSubmit={() => alert('Test')}>
      <Row>
        <Col span={12}>
          <Card title="Login Form" style={{ width: 400 }}>
            <Input
              placeholder="Enter your username"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              style={{ marginBottom: 10 }}
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <Input.Password
              placeholder="Enter your password"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              style={{ marginBottom: 10 }}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <small>
              No account yet? <Link to="/signup">Sign up here.</Link>
            </small>
            <Button block type="primary" onClick={handleClick}>
              Submit
            </Button>
          </Card>
        </Col>
      </Row>
    </Form>
  );
}

Login.propTypes = {
  history: PropTypes.object
};

export default withRouter(Login);

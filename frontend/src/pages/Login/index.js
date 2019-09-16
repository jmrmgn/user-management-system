import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Form, Row, Col, Input, Icon, Button } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const loginQuery = gql`
  mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      _id
      name
      username
    }
  }
`;

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useMutation(loginQuery);

  const handleClick = async () => {
    const variables = { username, password };
    const user = await login({
      variables
    });

    console.log(user);
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

Login.propTypes = {};

export default Login;

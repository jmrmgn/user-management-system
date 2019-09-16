import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Card, Row, Col, Input, Icon, Button } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const SignUpMutation = gql`
  mutation SignUpMutation(
    $name: String!
    $username: String!
    $password: String!
  ) {
    signUp(name: $name, username: $username, password: $password) {
      token
      user {
        _id
        name
      }
    }
  }
`;

function Signup({ history }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signUp, { loading }] = useMutation(SignUpMutation);

  const handleSubmit = async () => {
    const variables = { name, username, password };
    const { data } = await signUp({
      variables
    });

    const token = data.signUp.token;
    localStorage.setItem('token', token);
    history.push('/users');
  };

  return (
    <Row>
      <Col span={12}>
        <Card title="Create an account" style={{ width: 400 }}>
          <Input
            placeholder="Enter your name"
            prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
            style={{ marginBottom: 10 }}
            value={name}
            onChange={e => setName(e.target.value)}
          />
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
            style={{ marginBottom: 20 }}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <small>
            Already have an account? <Link to="/login">Login here</Link>{' '}
          </small>
          <Button block type="primary" onClick={handleSubmit} loading={loading}>
            {loading ? 'Please wait...' : 'Submit'}
          </Button>
        </Card>
      </Col>
    </Row>
  );
}

Signup.propTypes = {
  history: PropTypes.object
};

export default withRouter(Signup);

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Input, Icon, Button } from 'antd';

function Login(props) {
  return (
    <Row>
      <Col span={12}>
        <Card title="Login Form" style={{ width: 400 }}>
          <Input
            placeholder="Enter your username"
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            style={{ marginBottom: 10 }}
          />
          <Input.Password
            placeholder="Enter your password"
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            style={{ marginBottom: 10 }}
          />

          <small>
            No account yet? <Link to="/signup">Sign up here.</Link>
          </small>
          <Button block type="primary">
            Submit
          </Button>
        </Card>
      </Col>
    </Row>
  );
}

Login.propTypes = {};

export default Login;

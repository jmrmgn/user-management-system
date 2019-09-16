import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Input, Icon, Button } from 'antd';

function Signup(props) {
  return (
    <Row>
      <Col span={12}>
        <Card title="Create an account" style={{ width: 400 }}>
          <Input
            placeholder="Enter your name"
            prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
            style={{ marginBottom: 10 }}
          />
          <Input
            placeholder="Enter your username"
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            style={{ marginBottom: 10 }}
          />
          <Input.Password
            placeholder="Enter your password"
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            style={{ marginBottom: 20 }}
          />

          <small>
            Already have an account? <Link to="/login">Login here</Link>{' '}
          </small>
          <Button block type="primary">
            Submit
          </Button>
        </Card>
      </Col>
    </Row>
  );
}

Signup.propTypes = {};

export default Signup;

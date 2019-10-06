import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Card, Form, Row, Col, Input, Icon, Button, Alert } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';

// Utils
import { isAuthenticated } from '../../utils';

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

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required')
});

function Login(props) {
  const client = useApolloClient();
  const { history } = props;
  const [login, { loading, error }] = useMutation(loginQuery);

  useEffect(() => {
    isAuthenticated() && history.push('/');
  }, [history]);

  const handleClick = async ({ username, password }) => {
    const variables = { username, password };
    const { data } = await login({
      variables
    });
    const token = data.login.token;
    const { _id } = data.login.user;
    client.writeData({ data: { currentUser: _id } });
    localStorage.setItem('token', token);
    history.push('/users');
  };

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleClick}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting
      }) => (
        <>
          <Form autoComplete="off">
            {error && (
              <Alert
                message="Error"
                description={error.message}
                type="error"
                showIcon
                style={{ marginBottom: 10 }}
              />
            )}

            <Row>
              <Col span={12}>
                <Card title="Login Form" style={{ width: 400 }}>
                  <Form.Item
                    validateStatus={
                      errors.username && touched.username && 'error'
                    }
                    help={
                      errors.username && touched.username && errors.username
                    }
                  >
                    <Input
                      name="username"
                      placeholder="Username"
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: 'rgba(0,0,0,.25)' }}
                        />
                      }
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Item>
                  <Form.Item
                    validateStatus={
                      errors.password && touched.password && 'error'
                    }
                    help={
                      errors.password && touched.password && errors.password
                    }
                  >
                    <Input.Password
                      name="password"
                      placeholder="Password"
                      prefix={
                        <Icon
                          type="lock"
                          style={{ color: 'rgba(0,0,0,.25)' }}
                        />
                      }
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Item>
                  <small>
                    No account yet? <Link to="/signup">Sign up here.</Link>
                  </small>
                  <Button
                    block
                    type="primary"
                    loading={loading}
                    onClick={handleSubmit}
                  >
                    {loading ? 'Please wait...' : 'Submit'}
                  </Button>
                </Card>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </Formik>
  );
}

Login.propTypes = {
  history: PropTypes.object
};

export default withRouter(Login);

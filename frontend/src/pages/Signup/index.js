import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Card, Row, Col, Input, Icon, Button, Form } from 'antd';
import { Alert } from '../../components';
import { useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import * as Yup from 'yup';
import gql from 'graphql-tag';

// Utils
import { isAuthenticated } from '../../utils';

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

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Minimum of 2 characters')
    .max(255, 'Maximum of 255 characters')
    .required('Name is required'),
  username: Yup.string()
    .min(3, 'Minimum of 3 characters')
    .max(50, 'Maximum of 50 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Minimum of 6 characters')
    .max(255, 'Maximum of 255 characters')
    .required('Password is required')
});

function Signup({ history }) {
  const [signUp, { loading, error }] = useMutation(SignUpMutation);

  useEffect(() => {
    isAuthenticated() && history.push('/');
  }, [history]);

  const handleClick = async ({ name, username, password }) => {
    const variables = { name, username, password };
    const { data } = await signUp({
      variables
    });

    const token = data.signUp.token;
    localStorage.setItem('token', token);
    history.push('/users');
  };

  return (
    <Formik
      initialValues={{ name: '', username: '', password: '' }}
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
            {error && <Alert type="error" message={error.message} />}
            <Row>
              <Col span={12}>
                <Card title="Create an account" style={{ width: 400 }}>
                  <Form.Item
                    validateStatus={errors.name && touched.name && 'error'}
                    help={errors.name && touched.name && errors.name}
                  >
                    <Input
                      name="name"
                      placeholder="Enter your name"
                      prefix={
                        <Icon
                          type="idcard"
                          style={{ color: 'rgba(0,0,0,.25)' }}
                        />
                      }
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Item>
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
                      placeholder="Enter your username"
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
                      placeholder="Enter your password"
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
                    Already have an account? <Link to="/login">Login here</Link>{' '}
                  </small>
                  <Button
                    block
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading}
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

Signup.propTypes = {
  history: PropTypes.object
};

export default withRouter(Signup);

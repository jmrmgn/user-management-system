import React from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import gql from 'graphql-tag';

// Utils
import { isAuthenticated, signOut } from '../../utils';

const LogoutMutation = gql`
  mutation {
    logout
  }
`;

function Navbar({ location, history }) {
  const apolloClient = useApolloClient();
  const [logout] = useMutation(LogoutMutation);

  const handleSignOut = async () => {
    await logout();
    signOut(apolloClient);
    history.push('/login');
  };

  return (
    <Menu mode="horizontal" selectedKeys={[location.pathname]}>
      <Menu.Item key="/">
        <Link to="/">Home</Link>
      </Menu.Item>
      {isAuthenticated() && (
        <Menu.Item key="/users">
          <Link to="/users">Users</Link>
        </Menu.Item>
      )}
      {!isAuthenticated() && (
        <Menu.Item key="/login">
          <Link to="/login">Login</Link>
        </Menu.Item>
      )}
      {!isAuthenticated() && (
        <Menu.Item key="/signup">
          <Link to="/signup">Sign up</Link>
        </Menu.Item>
      )}
      {isAuthenticated() && (
        <Menu.Item key="/logout" onClick={handleSignOut}>
          Logout
        </Menu.Item>
      )}
    </Menu>
  );
}

Navbar.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(Navbar);

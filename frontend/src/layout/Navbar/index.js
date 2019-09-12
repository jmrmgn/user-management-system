import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd';

function Navbar({ location }) {
  return (
    <Menu mode="horizontal" selectedKeys={[location.pathname]}>
      <Menu.Item key="/">
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="/users">
        <Link to="/users">Users</Link>
      </Menu.Item>
      <Menu.Item key="/login">
        <Link to="/login">Login</Link>
      </Menu.Item>
      <Menu.Item key="/signup">
        <Link to="/signup">Sign up</Link>
      </Menu.Item>
    </Menu>
  );
}

Navbar.propTypes = {
  location: PropTypes.object
};

export default withRouter(Navbar);

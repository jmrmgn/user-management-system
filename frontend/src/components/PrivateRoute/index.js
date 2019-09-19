import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

// Utils
import { isAuthenticated } from '../../utils';

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login' }} />
      )}
    />
  );
}

PrivateRoute.propTypes = {
  component: PropTypes.any
};

export default PrivateRoute;

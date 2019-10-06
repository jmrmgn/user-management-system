import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';

function AlertComponent({ type, message, style = { marginBottom: 10 } }) {
  return (
    <Alert
      message="Error"
      description={message}
      type={type}
      showIcon
      style={style}
    />
  );
}

AlertComponent.propTypes = {
  type: PropTypes.string,
  message: PropTypes.string,
  style: PropTypes.object
};

export default AlertComponent;

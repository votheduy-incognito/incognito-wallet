import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@src/components/core';
import styleSheet from './style';

const ErrorMessage = (props) => {
  const { error, ...others } = props;
  return (
    <Text {...others} style={styleSheet.error}>{error}</Text>
  );
};

ErrorMessage.propTypes = {
  error: PropTypes.string,
};

export default ErrorMessage;
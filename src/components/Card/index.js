import React from 'react';
import PropTypes from 'prop-types';
import {View} from '@src/components/core';
import styles from './style';

const Card = ({ children, direction = 'row', style }) => {
  return (
    <View style={{ ...styles.container, ...style, flexDirection: direction }}>
      {children}
    </View>
  );
};

Card.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
  direction: PropTypes.string,
};

Card.defaultProps = {
  direction: 'row',
};

export default Card;

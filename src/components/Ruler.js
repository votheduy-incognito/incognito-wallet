import React from 'react';
import PropTypes from 'prop-types';
import { View } from '@src/components/core';

const Ruler = ({ width, height }) => <View style={{ width, height, backgroundColor: 'red', opacity: 0.5 }} />;

Ruler.defaultProps = {
  width: 100,
  height: 100,
};

Ruler.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default Ruler;

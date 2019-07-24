import React from 'react';
import PropTypes from 'prop-types';
import { Image } from '@src/components/core';

const TabBarIcon = ({ image }) => <Image source={image} style={{ width: 25, height: 25, resizeMode: 'contain' }} />;

TabBarIcon.propTypes = {
  image: PropTypes.number.isRequired,
};

export default TabBarIcon;
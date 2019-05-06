import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

const DrawerIcon = ({ children }) => (
  <View>
    {
      React.cloneElement(children, { size: 24 })
    }
  </View>
);

DrawerIcon.propTypes = {
  children: PropTypes.node.isRequired
};

export default DrawerIcon;
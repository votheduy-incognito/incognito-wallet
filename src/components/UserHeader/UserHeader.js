import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

const UserHeader = ({ userName }) => (
  <View>
    <Text>{userName}</Text>
  </View>
);

UserHeader.propTypes = {
  userName: PropTypes.string.isRequired
};

UserHeader.defaultProps = {
  userName: 'User'
};

export default UserHeader;
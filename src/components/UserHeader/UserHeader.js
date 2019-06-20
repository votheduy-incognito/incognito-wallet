import { Text, TouchableOpacity, View } from '@src/components/core';
import PropTypes from 'prop-types';
import React from 'react';
import FIcons from 'react-native-vector-icons/FontAwesome';
import styleSheet from './style';

const UserHeader = ({ userName, onPress }) => (
  <View style={styleSheet.container}>
    <TouchableOpacity onPress={onPress} style={styleSheet.visibleEl}>
      <Text style={styleSheet.userName}>{userName}</Text>
      <FIcons name="user-circle" size={24} style={styleSheet.userIcon} />
    </TouchableOpacity>
  </View>
);

UserHeader.propTypes = {
  userName: PropTypes.string.isRequired,
  onPress: PropTypes.func
};

UserHeader.defaultProps = {};

export default UserHeader;

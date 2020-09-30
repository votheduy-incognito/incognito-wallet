import { Text, View, TouchableOpacity } from '@components/core';
import { COLORS } from '@src/styles';
import PropTypes from 'prop-types';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '@src/styles/theme';
import styles from '../style';

const Status = ({ isExpanded, onToggle, value, color }) => (
  <View style={[styles.balanceContainer, theme.MARGIN.marginBottomDefault, { flexDirection: 'row', justifyContent: 'space-between' }]}>
    <Text style={[theme.text.boldTextStyleMedium]}>Status</Text>
    <TouchableOpacity
      style={[{ flexDirection: 'row' }, styles.balanceContainer]}
      onPress={onToggle}
    >
      <View style={{width: 12, height: 12, marginEnd: 5, borderRadius: 6, backgroundColor: color || 'white'}} />
      <Text style={[theme.text.boldTextStyleMedium, theme.MARGIN.marginRightDefault]}>{value || ''}</Text>
      <Ionicons name={isExpanded ? 'ios-arrow-up' : 'ios-arrow-down'} size={25} color={COLORS.colorPrimary} />
    </TouchableOpacity>
  </View>
);

Status.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
};

export default React.memo(Status);

